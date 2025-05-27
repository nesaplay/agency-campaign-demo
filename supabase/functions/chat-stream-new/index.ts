import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "npm:openai@^4.20.0"; // Assuming similar version to other function
import {
  createClient as createSupabaseClient, // Renamed to avoid conflict
  SupabaseClient,
  User,
  PostgrestError, // Added for more specific error typing
} from "npm:@supabase/supabase-js@^2.39.0"; // Assuming similar version
import { Database, MessageInsert, ThreadInsert, Json } from "../../_shared/lib/types.ts";
import { openai } from "../../_shared/lib/openai.ts";
import { getOpenaiAssistantByDbId } from "../../_shared/lib/assistant/assistant-service.ts";
import { handleOpenAIChatStream } from "../../_shared/lib/openai/chat-stream-handler.ts";
import { handleOpenAIChatCompletionsStream } from "../../_shared/lib/openai/chat-completions-stream-handler.ts";
type Assistant = OpenAI.Beta.Assistants.Assistant; // Use via main OpenAI import

// Environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SERVICE_ROLE_KEY");
// const openaiApiKey = Deno.env.get("OPENAI_API_KEY"); // openai client is imported

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase URL or Service Role Key environment variables");
}
// if (!openaiApiKey) { // Check is done within shared openai.ts
//   throw new Error("Missing OPENAI_API_KEY environment variable");
// }

// Configuration for Chat Completions path
const GPT_4O_MODEL = "gpt-4o";
const GPT_4O_CONTEXT_LIMIT = 128000; // Tokens
// Simple token estimation: average 3.5 chars per token. Adjust as needed.
const estimateTokenCount = (text: string): number => Math.ceil((text || "").length / 3.5);

// Simple in-memory cache for OpenAI Assistant objects
interface CacheEntry {
  assistant: Assistant;
  timestamp: number;
}
const assistantCache = new Map<string, CacheEntry>();
const ASSISTANT_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Helper function to create a service role client
let supabaseServiceClientInstance: SupabaseClient<Database> | null = null;
function getSupabaseServiceRoleClient(): SupabaseClient<Database> {
  if (!supabaseServiceClientInstance) {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase URL or Service Key is not initialized for service client");
    }
    supabaseServiceClientInstance = createSupabaseClient<Database>(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }
  return supabaseServiceClientInstance;
}

// Type definitions for Promise.all results
interface UserAuthResponse {
  data: { user: User | null };
  error: Error | null;
}

interface AssistantConfigResponse {
  data: { user_prompt: string | null; name: string | null } | null;
  error: PostgrestError | null;
}

interface ThreadResponse {
  data: { id: string; user_id: string; metadata: Json | null; assistant_id: string | null } | null;
  error: PostgrestError | null;
}

export async function POST(request: Request) {
  const startTime = performance.now();
  console.log("Starting chat stream processing...");

  let requestData;
  let request_thread_id: string | undefined;
  let db_thread_id: string | undefined;
  let openai_thread_id: string | undefined; // Only used for Assistants API path
  let dbAssistantId: string; // UUID from our DB
  let openaiActualAssistantId: string; // OpenAI's actual assistant ID, only for Assistants API path
  let newThreadCreated = false;

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();
  const supabaseService = getSupabaseServiceRoleClient();

  try {
    // Extract JWT from Authorization header for user-specific client
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return new Response(JSON.stringify({ error: "Unauthorized: Missing or invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const jwt = authHeader.replace("Bearer ", "");
    const supabaseUserClient = createSupabaseClient<Database>(supabaseUrl!, supabaseServiceKey!, { // Or use a different client for user context if needed. For now, using service key for auth.getUser
         global: { headers: { Authorization: `Bearer ${jwt}` } },
         auth: { persistSession: false }
    });

    requestData = await request.json();
    const { message, filename, hiddenMessage, context } = requestData;
    request_thread_id = requestData.thread_id;
    dbAssistantId = requestData.assistantId; // This is our DB assistant UUID

    if (!message || !dbAssistantId) {
      return new Response(JSON.stringify({ error: "Missing required fields: message, assistantId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Prepare promises for parallel execution
    const promisesToAwait: [
        Promise<UserAuthResponse>,
        Promise<AssistantConfigResponse>,
        Promise<ThreadResponse>?
    ] = [
      supabaseUserClient.auth.getUser() as Promise<UserAuthResponse>, // User client for getUser
      supabaseService
        .from("assistants")
        .select("user_prompt, name")
        .eq("id", dbAssistantId)
        .single(),
    ];

    if (request_thread_id) {
      promisesToAwait.push(
        supabaseService
          .from("threads")
          .select("id, user_id, metadata, assistant_id")
          .eq("id", request_thread_id)
          .single()
      );
    }

    const results = await Promise.all(promisesToAwait.filter(p => p !== undefined)); // Filter out undefined if thread_id is not present

    // Process user authentication result
    const userAuthResult = results[0] as UserAuthResponse; // Use defined type
    if (userAuthResult.error || !userAuthResult.data.user) {
      console.error("Auth Error in POST /api/chat/stream:", userAuthResult.error);
      if (!writer.closed) await writer.abort("Unauthorized");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const user = userAuthResult.data.user;
    const userId = user.id;

    // Process assistant configuration result
    const assistantConfigResult = results[1] as AssistantConfigResponse; // Use defined type
    if (assistantConfigResult.error || !assistantConfigResult.data) {
      console.error(`Error fetching assistant config for DB ID ${dbAssistantId}:`, assistantConfigResult.error);
      const errorDetail = assistantConfigResult.error?.code === 'PGRST116' ? "not found" : "database error";
      if (!writer.closed) await writer.abort(`Failed to fetch assistant configuration (${errorDetail})`);
      return new Response(JSON.stringify({ error: `Failed to load assistant configuration: ${errorDetail}.` }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    const assistantConfig = assistantConfigResult.data;
    const userPrompt = assistantConfig.user_prompt;
    const assistantName = assistantConfig.name || "Default Assistant";

    // Process thread data result (if fetched)
    let dbFetchedThreadData: { id: string; user_id: string; metadata: Json | null; assistant_id: string | null } | null = null;
    if (request_thread_id && results.length > 2) {
      const threadResult = results[2] as ThreadResponse; // Use defined type
      if (!threadResult || threadResult.error || !threadResult.data) {
        console.error(`Error fetching provided thread ${request_thread_id} for user ${userId}:`, threadResult?.error);
        if (!writer.closed) await writer.abort("Provided thread not found or failed to load.");
        return new Response(JSON.stringify({ error: "Provided thread not found or access denied." }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      dbFetchedThreadData = threadResult.data;
      if (dbFetchedThreadData.user_id !== userId) {
        console.error(`User ${userId} attempted to access thread ${request_thread_id} owned by ${dbFetchedThreadData.user_id}. Access denied.`);
        if (!writer.closed) await writer.abort("Thread access denied");
        return new Response(JSON.stringify({ error: "Provided thread not found or access denied." }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
      db_thread_id = dbFetchedThreadData.id;
    } else if (request_thread_id) {
      console.error(`Error: request_thread_id ${request_thread_id} was provided but no corresponding promise result found.`);
      if (!writer.closed) await writer.abort("Internal error processing thread.");
      return new Response(JSON.stringify({ error: "Internal error processing thread information." }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
      });
    }

    // Determine whether to use Chat Completions or Assistants API
    let useChatCompletions = false;
    const effectiveMessage = context ? `${message}\n\nCONTEXT:${JSON.stringify(context)}` : message;
    const estimatedTokens = estimateTokenCount(effectiveMessage) + estimateTokenCount(userPrompt || "");

    if (!filename && estimatedTokens < GPT_4O_CONTEXT_LIMIT) {
      useChatCompletions = true;
    }

    console.log(`Decision: Use Chat Completions? ${useChatCompletions}. Estimated tokens: ${estimatedTokens}. File provided: ${!!filename}`);

    if (useChatCompletions) {
      // --- CHAT COMPLETIONS API PATH ---
      console.log(`PATH: Chat Completions API. Model: ${GPT_4O_MODEL}. DB Assistant ID: ${dbAssistantId}. Estimated Tokens: ${estimatedTokens}`);
      console.log(`Using Chat Completions API for user ${userId}, DB Assistant ID ${dbAssistantId}`);

      if (request_thread_id) {
        if (!db_thread_id) { 
            console.error(`ChatCompletions: request_thread_id ${request_thread_id} was provided but db_thread_id is not set. This indicates an issue in prior fetch/validation.`);
            if (!writer.closed) await writer.abort("Error with provided thread for ChatCompletions.");
            return new Response(JSON.stringify({ error: "Error processing provided thread for ChatCompletions." }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
        console.log(`Using existing DB thread ID: ${db_thread_id} for Chat Completions (validated).`);
      } else {
        newThreadCreated = true;
        console.log(`No thread_id provided for Chat Completions. Creating new DB thread for user ${userId}.`);
        const newDbThreadData: ThreadInsert = {
          user_id: userId,
          assistant_id: dbAssistantId,
          metadata: { chat_api: "completions", model: GPT_4O_MODEL },
        };
        const { data: createdDbThread, error: dbCreateError } = await supabaseService
          .from("threads")
          .insert(newDbThreadData)
          .select("id")
          .single();

        if (dbCreateError || !createdDbThread) {
          console.error(`Failed to create new DB thread for Chat Completions (user ${userId}):`, dbCreateError);
          if (!writer.closed) await writer.abort("Failed to create thread in database for Chat Completions");
          return new Response(JSON.stringify({ error: "Failed to create new thread in database for Chat Completions." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
        db_thread_id = createdDbThread.id;
        console.log(`Created new DB thread ${db_thread_id} for Chat Completions.`);
      }

      // Construct messages for Chat Completions API, including history
      const chatCompletionsMessages: { role: "system" | "user" | "assistant"; content: string }[] = [];

      if (userPrompt) {
        chatCompletionsMessages.push({ role: "system", content: userPrompt });
      }

      // Fetch and prepend history if db_thread_id is available
      if (db_thread_id) {
        const { data: historicalMessages, error: historyError } = await supabaseService
          .from("messages")
          .select("role, content")
          .eq("thread_id", db_thread_id)
          .in("role", ["user", "assistant"])
          .order("created_at", { ascending: true });

        if (historyError) {
          console.error(`Error fetching message history for thread ${db_thread_id}:`, historyError);
          // Decide if this is a fatal error or if we can proceed without history
          if (!writer.closed) await writer.abort("Failed to load message history.");
          return new Response(JSON.stringify({ error: "Failed to load message history." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (historicalMessages) {
          for (const msg of historicalMessages) {
            if (msg.content && (msg.role === 'user' || msg.role === 'assistant')) {
              chatCompletionsMessages.push({ role: msg.role, content: msg.content });
            }
          }
        }
      }
      
      chatCompletionsMessages.push({ role: "user", content: effectiveMessage });
      
      handleOpenAIChatCompletionsStream({
        openai,
        supabaseService,
        writer,
        encoder,
        messages: chatCompletionsMessages,
        dbThreadId: db_thread_id!,
        dbAssistantId, // For saving messages with correct assistant association
        userId, // For saving messages
        model: GPT_4O_MODEL,
      }).catch((handlerError: Error) => {
        console.error("[RouteStream] Unhandled error from handleOpenAIChatCompletionsStream promise:", handlerError);
        if (!writer.closed) {
          const abortReason = handlerError instanceof Error ? handlerError.message : "Unknown error in Chat Completions stream handler";
          writer.abort(abortReason).catch(e => console.error("[RouteStream] Error aborting writer after Chat Completions handler failure:", e));
        }
      });

    } else {
      // --- ASSISTANTS API PATH ---
      console.log(`Using Assistants API for user ${userId}, DB Assistant ID ${dbAssistantId}`);
      
      let assistant: Assistant | undefined = undefined; 

      // 1. Check cache for OpenAI Assistant object
      const cachedEntry = assistantCache.get(dbAssistantId);
      if (cachedEntry && (Date.now() - cachedEntry.timestamp < ASSISTANT_CACHE_TTL_MS)) {
        assistant = cachedEntry.assistant;
        openaiActualAssistantId = assistant.id;
        console.log(`Retrieved OpenAI Assistant ${openaiActualAssistantId} for DB ID ${dbAssistantId} from cache.`);
      } else {
        // Not in cache or expired, fetch and cache
        const assistantFetchStartTime = performance.now();
        try {
          console.log(`Fetching OpenAI Assistant for DB ID ${dbAssistantId} (cache miss or expired).`);
          assistant = await getOpenaiAssistantByDbId(dbAssistantId); 
          openaiActualAssistantId = assistant.id;
          assistantCache.set(dbAssistantId, { assistant, timestamp: Date.now() });
          console.log(`Fetched and cached OpenAI Assistant ${openaiActualAssistantId}. Lookup/sync took: ${(performance.now() - assistantFetchStartTime).toFixed(2)}ms`);
        } catch (getAssistantErrorUnknown: unknown) { 
          const getAssistantError = getAssistantErrorUnknown as Error;
          console.error(`Failed to get/sync OpenAI Assistant for DB ID ${dbAssistantId}:`, getAssistantError);
          if (!writer.closed) await writer.abort("Failed to initialize AI assistant.");
          return new Response(JSON.stringify({ error: `Failed to initialize AI assistant: ${getAssistantError.message}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
      
      // Ensure assistant is defined before proceeding (should be, due to error handling above)
      if (!assistant) {
        console.error(`Critical error: Assistant object is undefined for DB ID ${dbAssistantId} after cache/fetch logic.`);
        if (!writer.closed) await writer.abort("Failed to initialize AI assistant due to an unexpected error.");
        return new Response(JSON.stringify({ error: "Failed to initialize AI assistant due to an unexpected error." }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      console.log(`PATH: Assistants API. OpenAI Assistant ID: ${openaiActualAssistantId}. Model: ${assistant.model || 'N/A'}. DB Assistant ID: ${dbAssistantId}. Estimated Tokens: ${estimatedTokens}`);
      
      // 2. Handle DB Thread and OpenAI Thread ID
      if (request_thread_id) {
        // db_thread_id is already set if dbFetchedThreadData was processed and valid.
        // dbFetchedThreadData contains metadata and assistant_id.
        if (!db_thread_id || !dbFetchedThreadData) {
             console.error(`Assistants API: request_thread_id ${request_thread_id} was provided but db_thread_id or dbFetchedThreadData is not set. This indicates an issue in prior fetch/validation.`);
            if (!writer.closed) await writer.abort("Error with provided thread for Assistants API.");
            return new Response(JSON.stringify({ error: "Error processing provided thread for Assistants API." }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
        console.log(`Assistants API: Using provided DB thread ID: ${db_thread_id} (validated).`);
        
        // Check if assistant matches - if not, this might be an issue or require new OpenAI thread.
        if (dbFetchedThreadData.assistant_id !== dbAssistantId) {
            console.warn(`DB Thread ${db_thread_id} was associated with assistant ${dbFetchedThreadData.assistant_id}, but current request is for ${dbAssistantId}. Proceeding with new OpenAI thread logic.`);
            // Treat as if new OpenAI thread is needed, but keep existing db_thread_id
            const newOpenaiThread = await openai.beta.threads.create();
            openai_thread_id = newOpenaiThread.id;
            const currentMetadata = typeof dbFetchedThreadData?.metadata === "object" && dbFetchedThreadData.metadata !== null ? dbFetchedThreadData.metadata : {};
            const newMetadata = { ...currentMetadata, openai_thread_id: openai_thread_id, chat_api: "assistants", model: assistant?.model || "gpt-4o" }; 
            const { error: updateError } = await supabaseService.from("threads").update({ metadata: newMetadata, assistant_id: dbAssistantId }).eq("id", db_thread_id!);
            if (updateError) { console.error(`Assistants API: Failed to update thread ${db_thread_id} metadata/assistant after mismatch:`, updateError); }

        } else {
            const metadata = dbFetchedThreadData?.metadata; // This should be Json | null from ThreadResponse
            openai_thread_id = (metadata as { openai_thread_id?: string })?.openai_thread_id; // Type assertion for specific property access
            if (!openai_thread_id) {
                console.log(`No OpenAI thread ID found for existing DB thread ${db_thread_id}. Creating new OpenAI thread.`);
                const newOpenaiThread = await openai.beta.threads.create();
                openai_thread_id = newOpenaiThread.id;
                const currentMetadata = typeof dbFetchedThreadData?.metadata === "object" && dbFetchedThreadData.metadata !== null ? dbFetchedThreadData.metadata : {};
                const newMetadata = { ...currentMetadata, openai_thread_id: openai_thread_id, chat_api: "assistants", model: assistant?.model || "gpt-4o" }; 
                const { error: updateError } = await supabaseService.from("threads").update({ metadata: newMetadata }).eq("id", db_thread_id!);
                if (updateError) { console.error(`Assistants API: Failed to update thread ${db_thread_id} with new OpenAI thread ID:`, updateError); }
            } else {
                 console.log(`Using existing OpenAI thread ${openai_thread_id} for DB thread ${db_thread_id}`);
            }
        }
      } else {
      newThreadCreated = true;
        console.log(`Assistants API: No thread_id provided. Creating new DB and OpenAI threads for user ${userId}.`);
      const newOpenaiThread = await openai.beta.threads.create();
      openai_thread_id = newOpenaiThread.id;
      console.log(`Created new OpenAI thread: ${openai_thread_id}`);

      const newDbThreadData: ThreadInsert = {
        user_id: userId,
          assistant_id: dbAssistantId,
          metadata: { openai_thread_id: openai_thread_id, chat_api: "assistants", model: assistant?.model || "gpt-4o" }, // Use assistant.model safely
      };
      const { data: createdDbThread, error: dbCreateError } = await supabaseService
        .from("threads")
        .insert(newDbThreadData)
        .select("id")
        .single();

      if (dbCreateError || !createdDbThread) {
          console.error(`Failed to create new DB thread for Assistants API (user ${userId}):`, dbCreateError);
          await openai.beta.threads.del(openai_thread_id).catch(e => console.error("Failed to delete orphaned OpenAI thread", e));
          if (!writer.closed) await writer.abort("Failed to create thread in database for Assistants API");
        return new Response(JSON.stringify({ error: "Failed to create new thread in database." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
      }
      db_thread_id = createdDbThread.id;
      console.log(`Created new DB thread ${db_thread_id} associated with OpenAI thread ${openai_thread_id}`);
      }

      // 3. File Processing (if filename is present)
    let openaiFileId: string | undefined = undefined;
    let processedFileName: string | undefined = undefined;
    if (filename) {
        // This logic was already present and seems correct for Assistants API path
        console.log(`Processing request with DB file ID (local): ${filename}`);
      const { data: fileRecord, error: fileFetchError } = await supabaseService
        .from("files")
        .select("filename, openai_file_id, mime_type") 
          .eq("id", filename) // filename is the file's DB ID
          .eq("user_id", userId)
        .single();

      if (fileFetchError || !fileRecord) {
          console.error(`Failed to fetch file record for DB file ID ${filename} or file not found:`, fileFetchError);
          if (!writer.closed) await writer.abort("File not found");
        return new Response(JSON.stringify({ error: "Failed to retrieve file details for chat context." }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
      }
      if (!fileRecord.openai_file_id) {
          console.error(`File record ${filename} is missing its OpenAI File ID.`);
          if (!writer.closed) await writer.abort("File not processed for AI");
        return new Response(JSON.stringify({ error: "File has not been processed for AI use. OpenAI File ID missing." }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
        }
        openaiFileId = fileRecord.openai_file_id;
        processedFileName = fileRecord.filename;
        console.log(`Retrieved OpenAI File ID: ${openaiFileId} and Filename: ${processedFileName} for DB file ${filename}.`);
      }

      // 4. Construct Final Message for Assistants API
      let userMessageForOpenAI = message; // Original user message
        if (processedFileName) {
        // Prepend file acknowledgment prompt if a file is involved
          userMessageForOpenAI = `Please acknowledge that you received the file named "${processedFileName}", and then immediately begin summarizing its contents without waiting. Always read the file first. Address the original query if it's different from summarization after you are done with the summary.\n\nOriginal query: ${message}`;
        }
      // Add context if present
        const messageWithContext = context ? `${userMessageForOpenAI}\n\nCONTEXT:${JSON.stringify(context)}` : userMessageForOpenAI;
      // Add OpenAI file reference if applicable
      const fileContextOpenAI = openaiFileId ? `\n(Referenced File ID: ${openaiFileId})` : "";
      const messageWithFileContext = `${messageWithContext}${fileContextOpenAI}`;
      // Prepend the assistant's system prompt (userPrompt)
      const finalMessageToOpenAI = userPrompt ? `${userPrompt}\n\n${messageWithFileContext}` : messageWithFileContext;
      console.log("Final message being sent to OpenAI Assistants handler:", finalMessageToOpenAI.substring(0, 200) + "...");


      // Call the existing handler for Assistants API
      handleOpenAIChatStream({
        openai: openai,
        supabaseService,
        writer,
        encoder,
        openaiThreadId: openai_thread_id!,
        openaiAssistantId: openaiActualAssistantId,
        userMessageContentForOpenai: finalMessageToOpenAI,
        dbThreadId: db_thread_id!,
        dbAssistantId: dbAssistantId, // dbAssistantId from request
        userId: userId, // Added userId back, ensure handler function expects it
      }).catch(handlerError => {
        console.error("[RouteStream] Unhandled error from handleOpenAIChatStream promise:", handlerError);
        if (!writer.closed) {
          const abortReason = handlerError instanceof Error ? handlerError.message : "Unknown error in Assistants stream handler";
          writer.abort(abortReason).catch(e => console.error("[RouteStream] Error aborting writer after Assistants handler failure:", e));
        }
      });
    }

    // Common logic: Save user message to DB if not hidden
    if (!hiddenMessage && db_thread_id) { // Ensure db_thread_id is set
      const userMessageToInsert: MessageInsert = {
        thread_id: db_thread_id!,
        user_id: userId,
        role: "user",
        content: message, // Original message, not the potentially modified one
        completed: true,
        assistant_id: useChatCompletions ? dbAssistantId : null, // For chat completions, associate with dbAssistantId. For assistants, handled by stream handler.
        // If associating with dbAssistantId for chat completions, ensure `assistant_id` column in `messages` can take it or is nullable.
      };
      supabaseService.from("messages").insert(userMessageToInsert)
        .then(({ error: insertUserMsgError }: { error: PostgrestError | null }) => { // Typed error
          if (insertUserMsgError) console.error("Supabase background user message insert error:", insertUserMsgError);
          else console.log(`User message saved to DB for thread ${db_thread_id}.`);
        });
    } else if (!hiddenMessage && !db_thread_id) {
        console.error("CRITICAL: db_thread_id was not set before attempting to save user message. This should not happen.");
    }

    const responseHeaders = new Headers({
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    });
    if (newThreadCreated && db_thread_id) { // Ensure db_thread_id is set
      responseHeaders.set("X-Thread-ID", db_thread_id!);
      console.log(`Responding with new thread ID in header: ${db_thread_id}`);
    }

    return new Response(stream.readable, {
      headers: responseHeaders,
    });

  } catch (errorUnknown: unknown) { // Typed error
    const error = errorUnknown as Error & {message?: string, status?: number};
    console.error("Error in POST /api/chat/stream (outer catch):", error);
    if (!writer.closed) {
        try { await writer.abort(error.message || "Outer catch error"); }
        catch (e) { console.error("Error aborting writer in outer catch:", e); }
    }
    if (error instanceof SyntaxError && 'bodyUsed' in request && !request.bodyUsed) { // Check bodyUsed directly
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.log(`Failed execution time: ${(performance.now() - startTime).toFixed(2)}ms`);
    return new Response(
      JSON.stringify({ error: `Failed to process streaming message: ${error.message || "Unknown error"}` }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  } finally {
    // Common logic: Update thread timestamp
    if (supabaseService && db_thread_id) {
       supabaseService.from('threads').update({ updated_at: new Date().toISOString() }).eq('id', db_thread_id)
       .then(({error}: {error: PostgrestError | null}) => { // Typed error
          if(error) console.error("BG Thread Timestamp Update Error:", error);
          else console.log(`Thread ${db_thread_id} timestamp updated.`);
       });
    }
    console.log(`Main route processing finished. Total execution time: ${(performance.now() - startTime).toFixed(2)}ms`);
  }
}

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Or your specific origin: e.g., "http://localhost:8080"
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, ApiKey, apikey", // Added apikey as it's common for Supabase
    // "Access-Control-Allow-Credentials": "true", // Include if you use credentials and specific origins
  };

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204, // No Content
      headers: corsHeaders,
    });
  }

  try {
    const response = await POST(req); // This is the Response object from your POST logic
    // Add CORS headers to the actual response from POST
    for (const [key, value] of Object.entries(corsHeaders)) {
      response.headers.set(key, value);
    }
    return response;
  } catch (e: unknown) {
    const error = e as Error & { message?: string };
    console.error("Unhandled error in Deno.serve wrapper:", error);
    const errorResponsePayload = {
      error: "Internal Server Error",
      message: error.message || "An unexpected error occurred.",
    };
    // Add CORS headers to error responses
    const errorHeaders = new Headers({
      ...corsHeaders,
      "Content-Type": "application/json",
    });
    return new Response(JSON.stringify(errorResponsePayload), {
      status: 500,
      headers: errorHeaders,
    });
  }
});
