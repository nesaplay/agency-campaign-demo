import type { Request, Response } from "express";
import { Json } from "../types/supabase";
import OpenAI from "openai";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// --- Supabase Client Initialization ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase URL or Service Role Key environment variables");
}


type Database = any;
type Assistant = any;
type AssistantConfig = any

// Now TypeScript knows these are strings
const url: string = supabaseUrl;
const key: string = supabaseServiceKey;

let supabaseServiceClientInstance: SupabaseClient<Database> | null = null;

function getSupabaseServiceRoleClient(): SupabaseClient<Database> {
  if (!supabaseServiceClientInstance) {
    supabaseServiceClientInstance = createClient<Database>(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: "public",
      },
    });
  }
  return supabaseServiceClientInstance;
}

const createServiceRoleClient = () => {
  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables for service role client');
  }

  return createServerClient<Database>(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        get(name: string) {
          return undefined;
        },
        set(name: string, value: string, options: CookieOptions) {},
        remove(name: string, options: CookieOptions) {},
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      }
    }
  );
};

/**
 * Retrieves an OpenAI Assistant object using its corresponding database configuration ID.
 *
 * @param assistantId - The UUID of the assistant record in the public.assistants table.
 * @returns The OpenAI Assistant object.
 * @throws Error if the database record or OpenAI assistant cannot be found or retrieved.
 */
async function getOpenaiAssistantByDbId(assistantId: string): Promise<Assistant> {
  const supabase = createServiceRoleClient();

  // 1. Fetch assistant config from DB by its primary key (UUID)
  console.log(`Fetching assistant config for DB ID: ${assistantId}`);
  const { data: assistantConfig, error: fetchError } = (await supabase
    .from("assistants")
    .select("id, name, openai_assistant_id, system_prompt") // Select necessary fields
    .eq("id", assistantId)
    .single()) as { data: AssistantConfig; error: any };

  if (fetchError || !assistantConfig) {
    console.error(`Error fetching assistant config for ID ${assistantId}:`, fetchError);
    const errorMessage =
      fetchError?.code === "PGRST116"
        ? `Assistant configuration with ID ${assistantId} not found in the database.`
        : `Failed to fetch assistant configuration: ${fetchError?.message || "Unknown error"}`;
    throw new Error(errorMessage);
  }

  const openaiAssistantId = assistantConfig.openai_assistant_id;
  const assistantName = assistantConfig.name; // For logging

  if (!openaiAssistantId) {
    console.error(`Assistant config ${assistantId} (${assistantName}) is missing its openai_assistant_id.`);
    // create a new assistant, pass system_prompt
    const assistant = await openai.beta.assistants.create({
      name: assistantName,
      instructions: assistantConfig.system_prompt,
      model: "gpt-4o",
    });

    // update the assistant config with the new assistant id
    await supabase.from("assistants").update({ openai_assistant_id: assistant.id }).eq("id", assistantId);

    return assistant;
  }

  // 2. Retrieve Assistant from OpenAI using the stored ID
  console.log(`Retrieving OpenAI assistant ${openaiAssistantId} for DB config ${assistantId} (${assistantName})`);
  try {
    const assistant = await openai.beta.assistants.retrieve(openaiAssistantId);
    return assistant;
  } catch (error: any) {
    console.error(`Failed to retrieve OpenAI assistant ${openaiAssistantId} (DB ID ${assistantId}):`, error);
    // Check if the error is specifically a 'not found' error from OpenAI
    if (error?.status === 404) {
      throw new Error(
        `OpenAI Assistant with ID ${openaiAssistantId} (linked to DB config ${assistantId}) not found on OpenAI.`,
      );
    }
    throw new Error(`Failed to retrieve OpenAI assistant ${openaiAssistantId}: ${error.message || "Unknown error"}`);
  }
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SERVICE_USER_ID = process.env.SUPABASE_SERVICE_ROLE_UID;
const DEFAULT_ASSISTANT_ID = process.env.SUPABASE_ASSISTANT_ID;

if (!SERVICE_USER_ID) {
  throw new Error("SUPABASE_SERVICE_ROLE_UID is not set in environment variables");
}

if (!DEFAULT_ASSISTANT_ID) {
  throw new Error("SUPABASE_ASSISTANT_ID is not set in environment variables");
}

// Now TypeScript knows these are strings
const userId: string = SERVICE_USER_ID;
const defaultAssistantId: string = DEFAULT_ASSISTANT_ID;

type MessagesTable = Database["public"]["Tables"]["messages"];
type MessageInsert = MessagesTable["Insert"];
type ThreadsTable = Database["public"]["Tables"]["threads"];
type ThreadInsert = ThreadsTable["Insert"];

interface StreamPostBody {
  message?: string;
  filename?: string;
  hiddenMessage?: boolean;
  context?: Record<string, unknown>;
  thread_id?: string;
  assistantId?: string;
}

function writeToStream(res: Response, data: string) {
  res.write(data);
}

export default async function POST(req: Request, res: Response) {
  // if (req.method !== "POST") {
  //   res.setHeader("Allow", ["POST"]);
  //   return res.status(405).send(`Method ${req.method} Not Allowed`);
  // }

  const startTime = performance.now();
  console.log("Starting chat stream processing...");

  // No user authentication, always use SERVICE_USER_ID
  const supabaseService = getSupabaseServiceRoleClient();
  const requestData: StreamPostBody = req.body;
  let db_thread_id: string;
  let openai_thread_id: string | undefined;
  let newThreadCreated = false;

  try {
    const { message, filename, hiddenMessage, context } = requestData || {};
    const request_thread_id = requestData?.thread_id;
    const assistantId = requestData?.assistantId || defaultAssistantId;

    if (!message) {
      return res.status(400).json({ error: "Missing required field: message" });
    }

    if (request_thread_id) {
      db_thread_id = request_thread_id;
      console.log(`Using provided DB thread ID: ${db_thread_id}`);
      const { data: threadData, error: threadFetchError } = await supabaseService
        .from("threads")
        .select("metadata")
        .eq("id", db_thread_id)
        .eq("user_id", userId) // Use SERVICE_USER_ID
        .single();
      if (threadFetchError) {
        console.error(`Error fetching thread ${db_thread_id} for user ${userId}:`, threadFetchError);
        return res.status(404).json({ error: "Provided thread not found or access denied." });
      }
      const existingMetadata = threadData?.metadata as ThreadInsert["metadata"];
      const potentialOpenaiId =
        typeof existingMetadata === "object" && existingMetadata !== null && "openai_thread_id" in existingMetadata
          ? existingMetadata.openai_thread_id
          : undefined;
      openai_thread_id = typeof potentialOpenaiId === "string" ? potentialOpenaiId : undefined;

      if (!openai_thread_id) {
        console.log(`No OpenAI thread ID found for DB thread ${db_thread_id}. Creating/linking.`);
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
          console.error(`Failed update ${db_thread_id} w/ OpenAI ID ${openai_thread_id}:`, updateError);
          return res.status(500).json({ error: "Failed to associate OpenAI thread." });
        }
        console.log(`Associated OpenAI thread ${openai_thread_id} w/ DB thread ${db_thread_id}`);
      } else {
        console.log(`Using existing OpenAI thread ${openai_thread_id} for DB thread ${db_thread_id}`);
      }
    } else {
      newThreadCreated = true;
      console.log(`Creating new DB/OpenAI threads for user ${userId}.`);
      const newOpenaiThread = await openai.beta.threads.create();
      openai_thread_id = newOpenaiThread.id;
      console.log(`Created new OpenAI thread: ${openai_thread_id}`);
      const newDbThreadData: ThreadInsert = {
        user_id: userId, // Use SERVICE_USER_ID
        assistant_id: assistantId,
        metadata: { openai_thread_id: openai_thread_id },
      };
      const { data: createdDbThread, error: dbCreateError } = await supabaseService
        .from("threads")
        .insert(newDbThreadData)
        .select("id")
        .single();
      if (dbCreateError || !createdDbThread) {
        console.error(`Failed create new DB thread for user ${userId}:`, dbCreateError);
        return res.status(500).json({ error: "Failed to create new DB thread." });
      }
      db_thread_id = createdDbThread.id;
      console.log(`Created DB thread ${db_thread_id} -> OpenAI thread ${openai_thread_id}`);
    }

    if (!hiddenMessage) {
      const userMessageMetadata: MessageInsert["metadata"] =
        context && typeof context === "object" ? (context as MessageInsert["metadata"]) : null;
      const userMessageToInsert: MessageInsert = {
        thread_id: db_thread_id,
        user_id: userId, // Use SERVICE_USER_ID
        role: "user",
        content: message,
        completed: true,
        assistant_id: null,
        metadata: userMessageMetadata,
      };
      const { error: insertUserMsgError } = await supabaseService.from("messages").insert(userMessageToInsert);
      if (insertUserMsgError) {
        console.error("Supabase user message insert error:", insertUserMsgError);
        return res.status(500).json({ error: `Failed to save user message: ${insertUserMsgError.message}` });
      }
    }

    let openaiFileId: string | undefined;
    if (filename) {
      const fileStartTime = performance.now();
      const { data: fileRecord, error: fileFetchError } = await supabaseService
        .from("files")
        .select("storage_path, filename, mime_type")
        .eq("id", filename)
        .eq("user_id", userId) // Use SERVICE_USER_ID
        .single();
      if (fileFetchError || !fileRecord || !fileRecord.storage_path) {
        console.error(`Failed fetch file record ${filename}:`, fileFetchError);
        return res.status(400).json({ error: "Failed to process attached file record." });
      }
      const { data: blob, error: downloadError } = await supabaseService.storage
        .from("files")
        .download(fileRecord.storage_path);
      if (downloadError || !blob) {
        console.error(`Failed download file ${fileRecord.storage_path}:`, downloadError);
        return res.status(500).json({ error: "Failed to download attached file data." });
      }
      const openaiFile = await openai.files.create({
        file: new File([blob], fileRecord.filename || `file_${filename}`, {
          type: fileRecord.mime_type || "application/octet-stream",
        }),
        purpose: "assistants",
      });
      openaiFileId = openaiFile.id;
      console.log(
        `File processing took: ${(performance.now() - fileStartTime).toFixed(2)}ms. OpenAI File ID: ${openaiFileId}`,
      );
    }

    const assistant = await getOpenaiAssistantByDbId(assistantId);
    const { data: assistantData } = await supabaseService
      .from("assistants")
      .select("user_prompt")
      .eq("id", assistantId)
      .single();
    const userPrompt = assistantData?.user_prompt;
    const messageWithContext = context ? `${message}\n\nCONTEXT:${JSON.stringify(context)}` : message;
    const messageToSend = userPrompt ? `${userPrompt}\n\n${messageWithContext}` : messageWithContext;

    await openai.beta.threads.messages.create(openai_thread_id!, {
      role: "user",
      content: messageToSend,
      ...(openaiFileId ? { attachments: [{ file_id: openaiFileId, tools: [{ type: "code_interpreter" }] }] } : {}),
    });

    const run = await openai.beta.threads.runs.create(openai_thread_id!, {
      assistant_id: assistant.id,
    });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    if (newThreadCreated) {
      res.setHeader("X-Thread-ID", db_thread_id);
    }
    res.status(200);

    console.log("Using polling fallback for OpenAI run completion.");
    let status;
    let pollCount = 0;
    const maxPolls = 50;
    do {
      await new Promise((r) => setTimeout(r, 1000));
      status = await openai.beta.threads.runs.retrieve(openai_thread_id!, run.id);
      pollCount++;
      if (pollCount > maxPolls) {
        throw new Error("Polling timeout waiting for OpenAI run completion");
      }
    } while (status.status !== "completed" && status.status !== "failed" && status.status !== "cancelled");

    if (status.status !== "completed") {
      throw new Error(`OpenAI run did not complete successfully. Status: ${status.status}`);
    }

    console.log(`Polling finished after ${pollCount} polls.`);
    const messages = await openai.beta.threads.messages.list(openai_thread_id!);
    const lastMessage = messages.data[0];

    if (lastMessage?.content?.[0]?.type === "text") {
      const assistantContent = lastMessage.content[0].text.value;
      const assistantMessageMetadata: MessageInsert["metadata"] = {
        openai_message_id: lastMessage.id,
        openai_run_id: run.id,
        ...(newThreadCreated && { new_db_thread_id: db_thread_id }),
        ...(newThreadCreated && requestData?.context && { client_context: requestData.context as Json }),
      };
      const assistantMessageToInsert: MessageInsert = {
        thread_id: db_thread_id,
        user_id: userId, // Use SERVICE_USER_ID
        role: "assistant",
        content: assistantContent,
        completed: true,
        assistant_id: assistantId,
        metadata: assistantMessageMetadata,
      };
      const { error: insertAssistantMsgError } = await supabaseService
        .from("messages")
        .insert(assistantMessageToInsert);

      if (insertAssistantMsgError) {
        console.error("Supabase assistant message insert error:", insertAssistantMsgError);
        // Don't send client error here as stream already started with 200
        // Log it, and the stream will end, potentially incomplete from client view
      }
      writeToStream(res, assistantContent);
    } else {
      console.error("No text content found in last assistant message.");
      // Don't send client error here as stream already started with 200
      writeToStream(res, "[Error: No text content from assistant]");
    }
    res.end();
  } catch (streamError: unknown) {
    console.error("Stream processing error:", streamError);
    const errorMessage = streamError instanceof Error ? streamError.message : String(streamError);
    if (!res.headersSent) {
      res.status(500).json({ error: "Stream error", details: errorMessage });
    } else {
      if (!res.writableEnded) {
        try {
          writeToStream(res, `\n[Error: ${errorMessage}]`);
        } catch (e) {
          /* ignore */
        }
        res.end();
      }
    }
  }
  console.log(`Chat stream processing finished in ${(performance.now() - startTime).toFixed(2)}ms`);
}

// function processOpenAIChunk(chunk: any): string | null {
//     return chunk?.choices?.[0]?.delta?.content || null;
// }
