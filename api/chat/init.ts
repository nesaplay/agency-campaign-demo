import type { IncomingMessage, ServerResponse } from "http";
import { Database } from "@/types/supabase";
import { URLSearchParams } from "url";
import { getSupabaseServiceRoleClient, getUserByToken } from "@/lib/server/utils";

// Type Aliases (Keep these)
type Message = Database["public"]["Tables"]["messages"]["Row"];
type Thread = Pick<
  Database["public"]["Tables"]["threads"]["Row"],
  "id" | "title" | "updated_at" | "assistant_id" | "created_at"
>;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.statusCode = 405;
    return res.end(`Method ${req.method} Not Allowed`);
  }

  // --- Authentication ---
  const { user, error: authError } = await getUserByToken(req); // Use imported helper
  if (authError || !user) {
    console.error("Auth Error in GET /api/chat/init:", authError);
    res.statusCode = 401;
    /* ... */ res.end(JSON.stringify({ error: "Unauthorized", details: authError?.message }));
    return;
  }
  const userId = user.id;
  // --- End Authentication ---

  const supabaseService = getSupabaseServiceRoleClient(); // Get client instance

  const queryParams = new URLSearchParams(req.url?.split("?")[1] || "");
  const assistantId = queryParams.get("assistantId");

  if (!assistantId) {
    res.statusCode = 400;
    /* ... */ res.end(JSON.stringify({ error: "assistantId query parameter is required" }));
    return;
  }

  console.log(`GET Init: Fetching threads for assistant ${assistantId} and user ${userId}`);

  try {
    // 1. Fetch all threads for the user & assistant
    const { data: threadsData, error: threadsError } = await supabaseService
      .from("threads")
      .select("id, title, updated_at, assistant_id, created_at")
      .eq("user_id", userId)
      .eq("assistant_id", assistantId)
      .order("updated_at", { ascending: false });

    if (threadsError) {
      console.error("Supabase GET threads error:", threadsError);
      res.statusCode = 500;
      /* ... */ res.end(JSON.stringify({ error: `Failed to fetch threads: ${threadsError.message}` }));
      return;
    }

    const threads = (threadsData || []) as Thread[];
    let messagesForLatestThread: Message[] = [];

    // 2. If threads exist, fetch messages for the most recent one
    if (threads.length > 0) {
      const latestThreadId = threads[0].id;
      console.log(`GET Init: Found ${threads.length} threads, fetching messages for latest: ${latestThreadId}`);
      const { data: messagesData, error: messagesError } = await supabaseService
        .from("messages")
        .select("*")
        .eq("thread_id", latestThreadId)
        .order("created_at", { ascending: true });

      if (messagesError) {
        console.error("Supabase GET latest messages error:", messagesError);
        // Non-fatal error: Log it but continue with empty messages
      } else {
        messagesForLatestThread = (messagesData || []) as Message[];
      }
    } else {
      console.log(`GET Init: No threads found for assistant ${assistantId} and user ${userId}`);
    }

    // Return both threads and the messages for the latest thread
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ threads: threads, messages: messagesForLatestThread }));
  } catch (error: unknown) {
    console.error("Unexpected GET /api/chat/init error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    res.statusCode = 500;
    /* ... */ res.end(
      JSON.stringify({ error: "An unexpected error occurred during initialization", details: message }),
    );
  }
}
 