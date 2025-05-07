import type { Request, Response } from 'express';
// import type { IncomingMessage } from "http"; // No longer needed
import { Database } from "@/types/supabase";
// Remove getUserByToken from imports
import { getSupabaseServiceRoleClient } from "@/lib/server/utils";
// import { URLSearchParams } from "url"; // No longer needed for Express query params

const SERVICE_USER_ID = "26d5d4cf-c2f6-4f5d-a0a9-5aafcaf7e541";

// Type aliases for clarity
type MessagesTable = Database["public"]["Tables"]["messages"];
type Message = MessagesTable["Row"];
type MessageInsert = MessagesTable["Insert"];

// Define expected request body shape for POST based on Insert type fields
interface PostMessageBody {
  content?: string;
  thread_id?: string;
  metadata?: MessageInsert["metadata"];
}

export default async function messagesHandler(req: Request, res: Response) {
  // No user authentication, always use SERVICE_USER_ID
  const userId = SERVICE_USER_ID;
  const supabaseService = getSupabaseServiceRoleClient();

  if (req.method === "GET") {
    const threadId = req.query.thread_id as string | undefined;

    if (!threadId) {
      return res.status(400).json({ error: "thread_id query parameter is required" });
    }

    try {
      console.log(`GET: Fetching messages for thread ${threadId} for user ${userId}`);
      // Verify thread belongs to SERVICE_USER_ID
      const { count: threadCount, error: threadCheckError } = await supabaseService
        .from("threads")
        .select("*", { count: "exact", head: true })
        .eq("id", threadId)
        .eq("user_id", userId); // Use SERVICE_USER_ID

      if (threadCheckError || threadCount === 0) {
        console.error(`Thread access check failed in GET for thread ${threadId}, user ${userId}:`, threadCheckError);
        const status = threadCheckError ? 500 : 404;
        const message =
          status === 404 ? "Thread not found or access denied." : `Database check error: ${threadCheckError?.message}`;
        return res.status(status).json({ error: message });
      }

      const { data: messages, error: messagesError } = await supabaseService
        .from("messages")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });

      if (messagesError) {
        console.error("Supabase GET messages error:", messagesError);
        return res.status(500).json({ error: `Failed to fetch messages: ${messagesError.message}` });
      }

      return res.status(200).json({ messages: (messages || []) as Message[] });
    } catch (error: unknown) {
      console.error("Unexpected GET /api/chat/messages error:", error);
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      return res.status(500).json({ error: "An unexpected error occurred while fetching messages", details: message });
    }
  } else if (req.method === "POST") {
    const requestData: PostMessageBody = req.body;
    const { content, thread_id, metadata } = requestData || {};

    if (!content || !thread_id) {
      return res.status(400).json({ error: "Missing required fields: content, thread_id" });
    }

    try {
      // Verify thread belongs to SERVICE_USER_ID
      const { count: threadCount, error: threadCheckError } = await supabaseService
        .from("threads")
        .select("*", { count: "exact", head: true })
        .eq("id", thread_id)
        .eq("user_id", userId); // Use SERVICE_USER_ID

      if (threadCheckError || threadCount === 0) {
        console.error(
          `Thread access check failed before POST for thread ${thread_id}, user ${userId}:`,
          threadCheckError,
        );
        const status = threadCheckError ? 500 : 403;
        const message =
          status === 403 ? "Access denied to this thread." : `Database check error: ${threadCheckError?.message}`;
        return res.status(status).json({ error: message });
      }

      const messageToInsert: MessageInsert = {
        thread_id: thread_id,
        user_id: userId, // Use SERVICE_USER_ID
        assistant_id: null,
        role: "user",
        content: content,
        completed: true,
        metadata: metadata === undefined ? null : metadata,
      };

      const { data: newMessage, error: insertError } = await supabaseService
        .from("messages")
        .insert(messageToInsert)
        .select()
        .single();

      if (insertError) {
        console.error("Supabase POST message error:", insertError);
        const status = insertError.code === "23503" ? 400 : 500;
        const message =
          status === 400 ? `Invalid thread_id: ${thread_id}` : `Failed to save message: ${insertError.message}`;
        return res.status(status).json({ error: message });
      }

      return res.status(201).json(newMessage as Message);
    } catch (error: unknown) {
      console.error("Unexpected POST /api/chat/messages error:", error);
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      return res.status(500).json({ error: "An unexpected error occurred while saving the message", details: message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).send(`Method ${req.method} Not Allowed`);
  }
}
 