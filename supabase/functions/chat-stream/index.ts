// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"; // This should provide Deno namespace
import OpenAI from "npm:openai@^4.20.0";
import {
  createClient,
  SupabaseClient,
  // PostgrestError, // Import if needed for specific error handling
} from "npm:@supabase/supabase-js@^2.39.0";

// Environment variables (ensure these are set in your Supabase project)
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SERVICE_ROLE_KEY");
const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
const serviceUserId = Deno.env.get("SERVICE_ROLE_UID");
const defaultAssistantIdFromEnv = Deno.env.get("ASSISTANT_ID");

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing Supabase URL or Service Role Key environment variables",
  );
}
if (!openaiApiKey) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}
if (!serviceUserId) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_UID is not set in environment variables",
  );
}
if (!defaultAssistantIdFromEnv) {
  throw new Error(
    "SUPABASE_ASSISTANT_ID is not set in environment variables",
  );
}

// --- BEGIN Types ---
// It's good practice to define types more specifically if possible.
// For Supabase, you can generate types from your schema:
// https://supabase.com/docs/guides/api/generating-types

// Generic Supabase table row type, customize if you have a specific structure.
interface SupabaseTableRow {
  id: string;
  [key: string]: any; // Allow other properties
}

// More specific type for your 'assistants' table rows
interface AssistantConfig extends SupabaseTableRow {
  name: string;
  openai_assistant_id: string | null;
  system_prompt: string | null;
  user_prompt?: string | null; // Make optional if it can be null/undefined
}

// Type for OpenAI Assistant object (can be made more specific based on OpenAI SDK)
type OpenAIAssistant = OpenAI.Beta.Assistants.Assistant;

// Using a generic Database definition. Replace with generated types for better safety.
type Database = {
  public: {
    Tables: {
      assistants: {
        Row: AssistantConfig; // For select
        Insert: Partial<AssistantConfig>; // For insert, often partial
        Update: Partial<AssistantConfig>; // For update, often partial
      };
      threads: {
        Row: any; // Define more specifically if possible
        Insert: ThreadInsert;
        Update: Partial<ThreadInsert>; // Define more specifically
      };
      messages: {
        Row: any; // Define more specifically if possible
        Insert: MessageInsert;
        Update: Partial<MessageInsert>; // Define more specifically
      };
      files: {
        Row: any; // Define more specifically if possible
        Insert: any;
        Update: any;
      };
      // Add other tables as needed
    };
    Views: {
      // Define views if you use them
      [key: string]: {
        Row: any;
      };
    };
    Functions: {
      // Define functions if you use them
      [key: string]: {
        Args: any;
        Returns: any;
      };
    };
  };
};

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type ThreadsTable = Database["public"]["Tables"]["threads"];
type ThreadInsert = {
  user_id: string;
  assistant_id: string;
  metadata?: {
    openai_thread_id?: string;
    [key: string]: any; // Allow other metadata properties
  } | null;
  id?: string; // Usually auto-generated
  created_at?: string; // Usually auto-generated
};

type MessagesTable = Database["public"]["Tables"]["messages"];
type MessageInsert = {
  thread_id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  completed?: boolean | null;
  assistant_id?: string | null;
  metadata?: {
    openai_message_id?: string;
    openai_run_id?: string;
    new_db_thread_id?: string;
    client_context?: Json;
    [key: string]: any; // Allow other metadata properties
  } | null;
  id?: string; // Usually auto-generated
  created_at?: string; // Usually auto-generated
};

interface StreamPostBody {
  message?: string;
  filename?: string;
  hiddenMessage?: boolean;
  context?: Record<string, unknown>;
  thread_id?: string;
  assistantId?: string;
}
// --- END Types ---

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

let supabaseServiceClientInstance: SupabaseClient<Database> | null = null;

function getSupabaseServiceRoleClient(): SupabaseClient<Database> {
  if (!supabaseServiceClientInstance) {
    supabaseServiceClientInstance = createClient<Database>(
      supabaseUrl!,
      supabaseServiceKey!,
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

async function getOpenaiAssistantByDbId(
  assistantId: string,
  supabaseClient: SupabaseClient<Database>,
): Promise<OpenAIAssistant> {
  console.log(`Fetching assistant config for DB ID: ${assistantId}`);
  const { data: assistantConfig, error: fetchError } = await supabaseClient
    .from("assistants")
    .select("id, name, openai_assistant_id, system_prompt")
    .eq("id", assistantId)
    .single<AssistantConfig>(); // Specify the expected return type for single()

  if (fetchError || !assistantConfig) {
    console.error(
      `Error fetching assistant config for ID ${assistantId}:`,
      fetchError,
    );
    const errorMessage = fetchError?.code === "PGRST116" // PostgREST error code for not found
      ? `Assistant configuration with ID ${assistantId} not found in the database.`
      : `Failed to fetch assistant configuration: ${
        fetchError?.message || "Unknown error"
      }`;
    throw new Error(errorMessage);
  }

  let openaiAssistantId = assistantConfig.openai_assistant_id;
  const assistantName = assistantConfig.name;

  if (!openaiAssistantId) {
    console.error(
      `Assistant config ${assistantId} (${assistantName}) is missing openai_assistant_id. Creating...`,
    );
    const newOpenaiAssistant = await openai.beta.assistants.create({
      name: assistantName,
      instructions: assistantConfig.system_prompt,
      model: "gpt-4o",
    });
    await supabaseClient
      .from("assistants")
      .update({ openai_assistant_id: newOpenaiAssistant.id })
      .eq("id", assistantId);
    console.log(
      `Created & linked OpenAI assistant ${newOpenaiAssistant.id} for DB config ${assistantId}`,
    );
    return newOpenaiAssistant;
  }

  console.log(
    `Retrieving OpenAI assistant ${openaiAssistantId} for DB config ${assistantId} (${assistantName})`,
  );
  try {
    const assistant = await openai.beta.assistants.retrieve(openaiAssistantId);
    return assistant;
  } catch (error) {
    // It's better to check error type if possible, e.g. if (error instanceof OpenAI.APIError)
    const apiError = error as OpenAI.APIError; // Type assertion
    console.error(
      `Failed to retrieve OpenAI assistant ${openaiAssistantId} (DB ID ${assistantId}):`,
      apiError,
    );
    if (apiError?.status === 404) {
      throw new Error(
        `OpenAI Assistant ID ${openaiAssistantId} (DB config ${assistantId}) not found on OpenAI.`,
      );
    }
    throw new Error(
      `Failed to retrieve OpenAI assistant ${openaiAssistantId}: ${
        apiError.message || "Unknown error"
      }`,
    );
  }
}

Deno.serve(async (req: Request) => {
  const startTime = performance.now();
  console.log("Starting chat stream processing (Edge Function)...");

  // --- BEGIN CORS Headers ---
  // Set this to your frontend's origin in production.
  // For local development, it might be 'http://localhost:3000' or similar.
  // Using '*' is generally permissive and okay for development/testing,
  // but be more specific for production.
  const allowedOrigin = req.headers.get("Origin") || "*"; // Reflect origin or use wildcard

  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS", // OPTIONS is important for preflight requests
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey", // Add any custom headers your client sends
    "Access-Control-Expose-Headers": "X-Thread-ID", // Ensure client can read this custom header
  };

  // Handle OPTIONS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  // --- END CORS Headers ---

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: `Method ${req.method} Not Allowed` }), {
      status: 405,
      headers: { ...corsHeaders, Allow: "POST", "Content-Type": "application/json" },
    });
  }

  let requestData: StreamPostBody;
  try {
    requestData = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseService = getSupabaseServiceRoleClient();
  let db_thread_id: string;
  let openai_thread_id: string | undefined;
  let newThreadCreated = false;
  // responseHeaders will be merged with corsHeaders before sending
  const responseHeaders = new Headers({
    "Content-Type": "text/plain; charset=utf-8",
    ...corsHeaders // Apply CORS headers to all responses by default
  });

  try {
    const { message, filename, hiddenMessage, context } = requestData || {};
    const request_thread_id = requestData?.thread_id;
    const assistantId = requestData?.assistantId || defaultAssistantIdFromEnv!;

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Missing required field: message" }),
        { status: 400, headers: { ...responseHeaders, "Content-Type": "application/json" } }, // Ensure responseHeaders includes CORS
      );
    }

    if (request_thread_id) {
      db_thread_id = request_thread_id;
      console.log(`Using provided DB thread ID: ${db_thread_id}`);
      const { data: threadData, error: threadFetchError } = await supabaseService
        .from("threads")
        .select("metadata")
        .eq("id", db_thread_id)
        .eq("user_id", serviceUserId!)
        .single<{ metadata: ThreadInsert["metadata"] }>(); // Specify metadata type

      if (threadFetchError) {
        console.error(
          `Error fetching thread ${db_thread_id} for user ${serviceUserId}:`,
          threadFetchError,
        );
        return new Response(
          JSON.stringify({ error: "Provided thread not found or access denied." }),
          { status: 404, headers: { ...responseHeaders, "Content-Type": "application/json" } },
        );
      }
      const existingMetadata = threadData?.metadata;
      openai_thread_id = typeof existingMetadata === "object" &&
          existingMetadata !== null &&
          typeof existingMetadata.openai_thread_id === "string"
        ? existingMetadata.openai_thread_id
        : undefined;

      if (!openai_thread_id) {
        console.log(`No OpenAI thread ID for DB thread ${db_thread_id}. Creating/linking.`);
        const newOpenaiThread = await openai.beta.threads.create();
        openai_thread_id = newOpenaiThread.id;
        const baseMetadata = typeof existingMetadata === "object" && existingMetadata !== null ? existingMetadata : {};
        const newMetadataForUpdate: ThreadInsert["metadata"] = {
          ...baseMetadata,
          openai_thread_id: openai_thread_id,
        };
        const { error: updateError } = await supabaseService
          .from("threads")
          .update({ metadata: newMetadataForUpdate })
          .eq("id", db_thread_id);
        if (updateError) {
          console.error(`Failed to update ${db_thread_id} with OpenAI ID ${openai_thread_id}:`, updateError);
          return new Response(JSON.stringify({ error: "Failed to associate OpenAI thread." }),
            { status: 500, headers: { ...responseHeaders, "Content-Type": "application/json" } });
        }
        console.log(`Associated OpenAI thread ${openai_thread_id} with DB thread ${db_thread_id}`);
      } else {
        console.log(`Using existing OpenAI thread ${openai_thread_id} for DB thread ${db_thread_id}`);
      }
    } else {
      newThreadCreated = true;
      console.log(`Creating new DB/OpenAI threads for user ${serviceUserId}.`);
      const newOpenaiThread = await openai.beta.threads.create();
      openai_thread_id = newOpenaiThread.id;
      console.log(`Created new OpenAI thread: ${openai_thread_id}`);
      const newDbThreadData: ThreadInsert = {
        user_id: serviceUserId!,
        assistant_id: assistantId,
        metadata: { openai_thread_id: openai_thread_id },
      };
      const { data: createdDbThread, error: dbCreateError } = await supabaseService
        .from("threads")
        .insert(newDbThreadData)
        .select("id")
        .single<{ id: string }>(); // Specify return type
      if (dbCreateError || !createdDbThread) {
        console.error(`Failed to create new DB thread for user ${serviceUserId}:`, dbCreateError);
        return new Response(JSON.stringify({ error: "Failed to create new DB thread." }),
          { status: 500, headers: { ...responseHeaders, "Content-Type": "application/json" } });
      }
      db_thread_id = createdDbThread.id;
      responseHeaders.set("X-Thread-ID", db_thread_id);
      console.log(`Created DB thread ${db_thread_id} -> OpenAI thread ${openai_thread_id}`);
    }

    if (!hiddenMessage) {
      const userMessageMetadata: MessageInsert["metadata"] = context && typeof context === "object" ? (context as Json) : null;
      const userMessageToInsert: MessageInsert = {
        thread_id: db_thread_id,
        user_id: serviceUserId!,
        role: "user",
        content: message!,
        completed: true,
        assistant_id: null,
        metadata: userMessageMetadata,
      };
      const { error: insertUserMsgError } = await supabaseService.from("messages").insert(userMessageToInsert);
      if (insertUserMsgError) {
        console.error("Supabase user message insert error:", insertUserMsgError);
        return new Response(JSON.stringify({ error: `Failed to save user message: ${insertUserMsgError.message}` }),
          { status: 500, headers: { ...responseHeaders, "Content-Type": "application/json" } });
      }
    }

    let openaiFileId: string | undefined;
    if (filename) {
      const fileStartTime = performance.now();
      const { data: fileRecord, error: fileFetchError } = await supabaseService
        .from("files")
        .select("storage_path, filename, mime_type")
        .eq("id", filename)
        .eq("user_id", serviceUserId!)
        .single<{ storage_path: string; filename: string; mime_type: string }>(); // Specify return type

      if (fileFetchError || !fileRecord || !fileRecord.storage_path) {
        console.error(`Failed to fetch file record for ID ${filename}:`, fileFetchError);
        return new Response(JSON.stringify({ error: "Failed to process attached file record." }),
          { status: 400, headers: { ...responseHeaders, "Content-Type": "application/json" } });
      }

      const { data: blob, error: downloadError } = await supabaseService.storage
        .from("files")
        .download(fileRecord.storage_path);

      if (downloadError || !blob) {
        console.error(`Failed to download file ${fileRecord.storage_path}:`, downloadError);
        return new Response(JSON.stringify({ error: "Failed to download attached file data." }),
          { status: 500, headers: { ...responseHeaders, "Content-Type": "application/json" } });
      }

      const openaiUploadable = new Blob([blob], { type: fileRecord.mime_type || "application/octet-stream" });
      const openaiFile = await openai.files.create({ file: openaiUploadable as any, purpose: "assistants" });
      openaiFileId = openaiFile.id;
      console.log(`File processing took: ${(performance.now() - fileStartTime).toFixed(2)}ms. OpenAI File ID: ${openaiFileId}`);
    }

    const assistant = await getOpenaiAssistantByDbId(assistantId, supabaseService);
    const { data: assistantData } = await supabaseService
      .from("assistants")
      .select("user_prompt")
      .eq("id", assistantId)
      .single<{ user_prompt: string | null }>(); // Specify return type

    const userPrompt = assistantData?.user_prompt;
    const messageWithContext = context ? `${message}\n\nCONTEXT:${JSON.stringify(context)}` : message;
    const messageToSend = userPrompt ? `${userPrompt}\n\n${messageWithContext}` : messageWithContext;
    const fastMessageToSend = messageToSend + "\n\nGive me short answer, limit to 250 characters. Prioritize speed and simplicity.";

    await openai.beta.threads.messages.create(openai_thread_id!, {
      role: "user",
      content: fastMessageToSend,
      ...(openaiFileId ? { attachments: [{ file_id: openaiFileId, tools: [{ type: "code_interpreter" }] }] } : {}),
    });

    const run = await openai.beta.threads.runs.create(openai_thread_id!, { assistant_id: assistant.id });

    console.log("Using polling for OpenAI run completion.");
    let currentRunStatus;
    let pollCount = 0;
    const maxPolls = 50;
    do {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      currentRunStatus = await openai.beta.threads.runs.retrieve(openai_thread_id!, run.id);
      pollCount++;
      if (pollCount > maxPolls) {
        console.error("Polling timeout waiting for OpenAI run completion");
        throw new Error("Polling timeout waiting for OpenAI run completion");
      }
      console.log(`Poll ${pollCount}: Run status: ${currentRunStatus.status}`);
    } while (
      currentRunStatus.status === "queued" ||
      currentRunStatus.status === "in_progress" ||
      currentRunStatus.status === "cancelling"
    );

    if (currentRunStatus.status === "requires_action") {
      console.warn(`OpenAI run ${run.id} requires action. This is not handled in this version.`);
      throw new Error(`OpenAI run requires action. Status: ${currentRunStatus.status}`);
    }

    if (currentRunStatus.status !== "completed") {
      console.error(`OpenAI run did not complete successfully. Final Status: ${currentRunStatus.status}`, currentRunStatus);
      throw new Error(`OpenAI run did not complete successfully. Status: ${currentRunStatus.status}`);
    }

    console.log(`Polling finished after ${pollCount} polls. Run ${run.id} completed.`);
    const messages = await openai.beta.threads.messages.list(openai_thread_id!, { order: 'desc', limit: 1 });
    const lastMessage = messages.data[0];
    let assistantContent = "[Error: No text content from assistant]";

    if (lastMessage?.role === "assistant" && lastMessage?.content?.[0]?.type === "text") {
      assistantContent = lastMessage.content[0].text.value;
      const assistantMessageMetadata: MessageInsert["metadata"] = {
        openai_message_id: lastMessage.id,
        openai_run_id: run.id,
        ...(newThreadCreated && { new_db_thread_id: db_thread_id }),
        ...(newThreadCreated && requestData?.context && { client_context: requestData.context as Json }),
      };
      const assistantMessageToInsert: MessageInsert = {
        thread_id: db_thread_id,
        user_id: serviceUserId!,
        role: "assistant",
        content: assistantContent,
        completed: true,
        assistant_id: assistantId,
        metadata: assistantMessageMetadata,
      };
      const { error: insertAssistantMsgError } = await supabaseService.from("messages").insert(assistantMessageToInsert);
      if (insertAssistantMsgError) {
        console.error("Supabase assistant message insert error:", insertAssistantMsgError);
      }
    } else {
      console.error("No text content or wrong role in last message:", lastMessage);
    }

    console.log(`Chat stream processing finished in ${(performance.now() - startTime).toFixed(2)}ms`);
    // Ensure final response also has all necessary headers, including exposed ones.
    // The responseHeaders object already contains corsHeaders.
    return new Response(assistantContent, { status: 200, headers: responseHeaders });

  } catch (error) {
    // Check if error is an instance of Error, otherwise stringify
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Stream processing error:", error); // Log the original error too
    // Ensure error responses also have CORS headers
  return new Response(
      JSON.stringify({ error: "Stream error", details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

/*
To deploy:
1. Ensure Deno is installed and configured in your Supabase CLI environment.
2. Set environment variables in your Supabase project settings (Vault or .env for local):
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - OPENAI_API_KEY
   - SUPABASE_SERVICE_ROLE_UID (UID of a service user in your auth.users table)
   - SUPABASE_ASSISTANT_ID (Default assistant ID from your 'assistants' table)
3. Run `supabase functions deploy chat-stream --no-verify-jwt`
   (JWT verification might be skipped if using service role key for auth, or handled via custom middleware if needed)

To invoke locally (after `supabase start` and ensuring env vars are loaded, e.g., via `supabase functions serve --env-file ./supabase/.env.local`):
  curl -i --location --request POST 'http://localhost:54321/functions/v1/chat-stream' \\
    --header 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY_OR_SERVICE_KEY' \\
    --header 'Content-Type: application/json' \\
    --data '{
      "message": "Hello from test!",
      "assistantId": "YOUR_ASSISTANT_DB_ID"
    }'

NOTE ON STREAMING AND DENO EDGE FUNCTIONS:
The original Express.js code used `res.write()` for Node.js HTTP response streaming.
Deno's `Deno.serve` handler expects a single `Response` object to be returned.
True HTTP streaming (chunked transfer encoding as data becomes available) in Deno Edge Functions
requires the `body` of the `Response` to be a `ReadableStream`.

This converted version *does not* implement HTTP response streaming for the OpenAI response.
It polls for the assistant's complete response and then sends it as a single payload.
The `Transfer-Encoding: chunked` header, if set without a ReadableStream body,
might not behave as expected or might be ignored by the Deno runtime. It's commented out.

If you need to stream partial responses from OpenAI *as they arrive* (e.g., token by token
from a Chat Completion stream), you would:
1. Use the OpenAI API endpoint that supports streaming (e.g., Chat Completions with `stream: true`).
2. Adapt the OpenAI SDK usage to handle an event stream or async iterator.
3. Construct a `ReadableStream` in Deno, pushing data chunks from OpenAI into it.
4. Return this `ReadableStream` in the `Response` body.

However, the OpenAI Assistants API (runs and messages) follows a request-poll-retrieve pattern,
not a direct content stream for the assistant's turn. The polling logic here is appropriate
for that API. "Streaming" in the original context likely referred to the sequence of operations,
not necessarily HTTP chunked streaming of the final AI response itself.
*/
