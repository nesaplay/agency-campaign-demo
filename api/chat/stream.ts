import type { IncomingMessage, ServerResponse } from "http";
import { Database } from "../../src/types/supabase";
import { openai } from "../../src/lib/openai";
import { getOpenaiAssistantByDbId } from "../../src/lib/assistant/assistant-service";
import { getSupabaseServiceRoleClient, getUserByToken } from "../../src/lib/server/utils";

type MessagesTable = Database["public"]["Tables"]["messages"];
type MessageInsert = MessagesTable["Insert"];
type ThreadsTable = Database["public"]["Tables"]["threads"];
type ThreadInsert = ThreadsTable["Insert"];

interface StreamPostBody {
  message?: string;
  filename?: string; // This is likely the DB file ID
  hiddenMessage?: boolean;
  context?: Record<string, unknown>; // Keep input flexible, but validate/cast before DB insert
  thread_id?: string; // Optional DB thread ID
  assistantId?: string;
}

function writeToStream(res: ServerResponse, data: string) {
  res.write(data);
}

export default async function handler(req: IncomingMessage & { body?: StreamPostBody }, res: ServerResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.statusCode = 405;
    return res.end(`Method ${req.method} Not Allowed`);
  }

  const startTime = performance.now();
  console.log("Starting chat stream processing...");

  const { user, error: authError } = await getUserByToken(req);
  if (authError || !user) {
    console.error("Auth Error in POST /api/chat/stream:", authError);
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Unauthorized", details: authError?.message }));
    return;
  }
  const userId = user.id;

  const supabaseService = getSupabaseServiceRoleClient();

  const requestData: StreamPostBody | undefined = req.body;
  let request_thread_id: string | undefined;
  let db_thread_id: string;
  let openai_thread_id: string | undefined;
  let assistantId: string | undefined;
  let newThreadCreated = false;

  try {
    const { message, filename, hiddenMessage, context } = requestData || {};
    request_thread_id = requestData?.thread_id;
    assistantId = requestData?.assistantId;

    if (!message || !assistantId) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Missing required fields: message, assistantId" }));
      return;
    }

    if (request_thread_id) {
      db_thread_id = request_thread_id;
      console.log(`Using provided DB thread ID: ${db_thread_id}`);
      const { data: threadData, error: threadFetchError } = await supabaseService
        .from("threads")
        .select("metadata")
        .eq("id", db_thread_id)
        .eq("user_id", userId)
        .single();
      if (threadFetchError) {
        console.error(`Error fetching thread ${db_thread_id} for user ${userId}:`, threadFetchError);
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Provided thread not found or access denied." }));
        return;
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
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Failed to associate OpenAI thread." }));
          return;
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
        user_id: userId,
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
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Failed to create new DB thread." }));
        return;
      }
      db_thread_id = createdDbThread.id;
      console.log(`Created DB thread ${db_thread_id} -> OpenAI thread ${openai_thread_id}`);
    }

    if (!hiddenMessage) {
      const userMessageMetadata: MessageInsert["metadata"] =
        context && typeof context === "object" ? (context as MessageInsert["metadata"]) : null;
      const userMessageToInsert: MessageInsert = {
        thread_id: db_thread_id,
        user_id: userId,
        role: "user",
        content: message,
        completed: true,
        assistant_id: null,
        metadata: userMessageMetadata,
      };
      const { error: insertUserMsgError } = await supabaseService.from("messages").insert(userMessageToInsert);
      if (insertUserMsgError) {
        console.error("Supabase user message insert error:", insertUserMsgError);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: `Failed to save user message: ${insertUserMsgError.message}` }));
        return;
      }
    }

    let openaiFileId: string | undefined;
    if (filename) {
      const fileStartTime = performance.now();
      const { data: fileRecord, error: fileFetchError } = await supabaseService
        .from("files")
        .select("storage_path, filename, mime_type")
        .eq("id", filename)
        .eq("user_id", userId)
        .single();
      if (fileFetchError || !fileRecord || !fileRecord.storage_path) {
        console.error(`Failed fetch file record ${filename}:`, fileFetchError);
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Failed to process attached file record." }));
        return;
      }
      const { data: blob, error: downloadError } = await supabaseService.storage
        .from("files")
        .download(fileRecord.storage_path);
      if (downloadError || !blob) {
        console.error(`Failed download file ${fileRecord.storage_path}:`, downloadError);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Failed to download attached file data." }));
        return;
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
    res.statusCode = 200;

    console.log("Using polling fallback for OpenAI run completion.");
    let status;
    let pollCount = 0;
    const maxPolls = 30;
    do {
      await new Promise((r) => setTimeout(r, 2000));
      status = await openai.beta.threads.runs.retrieve(openai_thread_id!, run.id);
      pollCount++;
      if (pollCount > maxPolls) throw new Error("Polling timeout waiting for OpenAI run completion");
    } while (status.status !== "completed");

    console.log(`Polling finished after ${pollCount} polls.`);
    const messages = await openai.beta.threads.messages.list(openai_thread_id!);
    const lastMessage = messages.data[0];

    if (lastMessage?.content?.[0]?.type === "text") {
      const assistantContent = lastMessage.content[0].text.value;
      const assistantMessageMetadata: MessageInsert["metadata"] = {
        openai_message_id: lastMessage.id,
        openai_run_id: run.id,
      };
      const assistantMessageToInsert: MessageInsert = {
        thread_id: db_thread_id,
        user_id: userId,
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
        console.error("Failed to save assistant message:", insertAssistantMsgError);
      }

      writeToStream(res, assistantContent);
    } else {
      console.log("Last message was not text or content is empty.");
      writeToStream(res, "[Assistant response was not text]");
    }

    res.end();
    console.log(`Chat stream processing finished in ${(performance.now() - startTime).toFixed(2)}ms`);
  } catch (error: unknown) {
    console.error("Error during stream processing:", error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      const message = error instanceof Error ? error.message : "Internal server error during stream processing";
      res.end(JSON.stringify({ error: message }));
    } else {
      res.end();
    }
  }
}

// function processOpenAIChunk(chunk: any): string | null {
//     return chunk?.choices?.[0]?.delta?.content || null;
// }
 