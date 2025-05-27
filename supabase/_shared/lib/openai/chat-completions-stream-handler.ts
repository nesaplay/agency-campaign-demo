import { SupabaseClient, PostgrestError } from "npm:@supabase/supabase-js@^2.39.0";
import OpenAI from "npm:openai@^4.20.0";
import { Database } from "../types.ts";
// import { TextEncoder } from "util"; // TextEncoder is global in Deno

type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];

export interface HandleOpenAIChatCompletionsStreamParams {
  openai: OpenAI;
  supabaseService: SupabaseClient<Database>;
  writer: WritableStreamDefaultWriter<Uint8Array>;
  encoder: TextEncoder;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  dbThreadId: string;
  dbAssistantId: string; // The ID of the assistant config from our database
  userId: string;
  model: string;
}

export async function handleOpenAIChatCompletionsStream({
  openai,
  supabaseService,
  writer,
  encoder,
  messages,
  dbThreadId,
  dbAssistantId,
  userId,
  model,
}: HandleOpenAIChatCompletionsStreamParams): Promise<void> {
  let accumulatedResponse = "";
  const streamStartTime = performance.now();
  console.log(`[ChatCompletionsHandler] Starting stream for thread ${dbThreadId}, model ${model}`);

  try {
    const stream = await openai.chat.completions.create({
      model: model,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        accumulatedResponse += content;
        await writer.write(encoder.encode(content));
      }
      // Handle potential finish_reason (e.g., length, content_filter)
      if (chunk.choices[0]?.finish_reason) {
        console.log(`[ChatCompletionsHandler] Stream finished. Reason: ${chunk.choices[0].finish_reason}`);
        await writer.close();
        break; 
      }
    }
    console.log(`[ChatCompletionsHandler] Stream ended. Accumulation took: ${(performance.now() - streamStartTime).toFixed(2)}ms. Total length: ${accumulatedResponse.length}`);

  } catch (errorUnknown: unknown) { // Typed error
    const error = errorUnknown as Error & { message?: string };
    console.error("[ChatCompletionsHandler] Error during OpenAI stream:", error);
    if (!writer.closed) {
      try {
        const errorMessage = JSON.stringify({ type: "error", error: error.message || "Stream failed" });
        await writer.write(encoder.encode(errorMessage));
      } catch (writeError) {
        console.error("[ChatCompletionsHandler] Failed to write error to stream:", writeError);
      }
    }
    throw error; // Re-throw to be caught by the route handler
  } finally {
    if (!writer.closed) {
      try {
        console.log("[ChatCompletionsHandler] Attempting to close writer in finally.");
        await writer.close();
        console.log("[ChatCompletionsHandler] Writer closed successfully in finally.");
      } catch (e: unknown) {
        const closeError = e as Error;
        console.error("[ChatCompletionsHandler] Error closing writer in finally, attempting abort:", closeError.message);
        if (!writer.closed) {
            try {
                await writer.abort(closeError.message || "Abort due to close error");
                console.log("[ChatCompletionsHandler] Writer aborted in finally after close failed.");
            } catch (abortError: unknown) {
                console.error("[ChatCompletionsHandler] Error aborting writer in finally:", (abortError as Error).message);
            }
        }
      }
    } else {
        console.log("[ChatCompletionsHandler] Writer was already closed before finally block.");
    }
  }

  if (accumulatedResponse.trim()) {
    const assistantMessageToInsert: MessageInsert = {
      thread_id: dbThreadId,
      user_id: userId,
      role: "assistant",
      content: accumulatedResponse,
      completed: true, 
      assistant_id: dbAssistantId, // Link to our internal assistant config ID
      // model: model, // Optional: if you add a model column to messages table
    };

    const { error: insertError } = await supabaseService
      .from("messages")
      .insert(assistantMessageToInsert);

    if (insertError) {
      console.error("[ChatCompletionsHandler] Supabase assistant message insert error:", insertError);
      // Not throwing here as the client already received the message. Log and monitor.
    } else {
      console.log(`[ChatCompletionsHandler] Assistant message saved to DB for thread ${dbThreadId}.`);
    }
  } else {
    console.log("[ChatCompletionsHandler] No response content from assistant to save.");
  }
} 