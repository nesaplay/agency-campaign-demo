import type { IncomingMessage, ServerResponse } from "http";
import { Database } from "@/types/supabase"; // Use alias
import { getSupabaseServiceRoleClient, getUserByToken } from "@/lib/server/utils"; // Use alias
import { URLSearchParams } from "url";

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

export default async function handler(req: IncomingMessage & { body?: PostMessageBody }, res: ServerResponse) {
  // --- Authentication (Common for GET and POST) ---
  // Uses getUserByToken which uses getSupabaseServiceRoleClient internally for auth.getUser()
  const { user, error: authError } = await getUserByToken(req);
  if (authError || !user) {
    console.error(`Auth Error in ${req.method} /api/chat/messages:`, authError);
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Unauthorized", details: authError?.message }));
    return;
  }
  const userId = user.id;
  // --- End Authentication ---

  // Get the Supabase Service Role Client instance for DB operations
  const supabaseService = getSupabaseServiceRoleClient();

  if (req.method === "GET") {
    const queryParams = new URLSearchParams(req.url?.split("?")[1] || "");
    const threadId = queryParams.get("thread_id");

    if (!threadId) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "thread_id query parameter is required" }));
      return;
    }

    try {
      console.log(`GET: Fetching messages for thread ${threadId} for user ${userId}`);

      // Verify user has access to the thread using Service Role Client
      const { count: threadCount, error: threadCheckError } = await supabaseService
        .from("threads")
        .select("*", { count: "exact", head: true })
        .eq("id", threadId)
        .eq("user_id", userId);

      if (threadCheckError || threadCount === 0) {
        console.error(`Thread access check failed in GET for thread ${threadId}, user ${userId}:`, threadCheckError);
        const status = threadCheckError ? 500 : 404;
        const message =
          status === 404 ? "Thread not found or access denied." : `Database check error: ${threadCheckError?.message}`;
        res.statusCode = status;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: message }));
        return;
      }

      // Fetch messages using Service Role Client
      const { data: messages, error: messagesError } = await supabaseService
        .from("messages")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });

      if (messagesError) {
        console.error("Supabase GET messages error:", messagesError);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: `Failed to fetch messages: ${messagesError.message}` }));
        return;
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ messages: (messages || []) as Message[] }));
    } catch (error: unknown) {
      console.error("Unexpected GET /api/chat/messages error:", error);
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "An unexpected error occurred while fetching messages", details: message }));
    }
  } else if (req.method === "POST") {
    // Use req.body (Vercel parses JSON)
    const requestData = req.body;
    const { content, thread_id, metadata } = requestData || {};

    if (!content || !thread_id) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Missing required fields: content, thread_id" }));
      return;
    }

    try {
      // Verify user has access to the thread using Service Role Client
      const { count: threadCount, error: threadCheckError } = await supabaseService
        .from("threads")
        .select("*", { count: "exact", head: true })
        .eq("id", thread_id)
        .eq("user_id", userId);

      if (threadCheckError || threadCount === 0) {
        console.error(
          `Thread access check failed before POST for thread ${thread_id}, user ${userId}:`,
          threadCheckError,
        );
        const status = threadCheckError ? 500 : 403; // 403 Forbidden if thread exists but no access
        const message =
          status === 403 ? "Access denied to this thread." : `Database check error: ${threadCheckError?.message}`;
        res.statusCode = status;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: message }));
        return;
      }

      const messageToInsert: MessageInsert = {
        thread_id: thread_id,
        user_id: userId, // Use userId from authentication
        assistant_id: null,
        role: "user",
        content: content,
        completed: true, // Assume user messages are always complete
        metadata: metadata === undefined ? null : metadata, // Use metadata from body
      };

      // Insert using Service Role Client
      const { data: newMessage, error: insertError } = await supabaseService
        .from("messages")
        .insert(messageToInsert)
        .select()
        .single();

      if (insertError) {
        console.error("Supabase POST message error:", insertError);
        const status = insertError.code === "23503" ? 400 : 500; // Handle foreign key violation
        const message =
          status === 400 ? `Invalid thread_id: ${thread_id}` : `Failed to save message: ${insertError.message}`;
        res.statusCode = status;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: message }));
        return;
      }

      res.statusCode = 201; // Created
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(newMessage as Message));
    } catch (error: unknown) {
      console.error("Unexpected POST /api/chat/messages error:", error);
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "An unexpected error occurred while saving the message", details: message }));
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.statusCode = 405;
    res.end(`Method ${req.method} Not Allowed`);
  }
}
 