import type { Request, Response } from 'express';
// import type { IncomingMessage } from "http"; // No longer needed
import { Database } from "@/types/supabase";
// Remove getUserByToken from imports
import { getSupabaseServiceRoleClient } from "@/lib/server/utils";

const SERVICE_USER_ID = "26d5d4cf-c2f6-4f5d-a0a9-5aafcaf7e541";

// Type Aliases
type Message = Database["public"]["Tables"]["messages"]["Row"];
type Thread = Pick<
  Database["public"]["Tables"]["threads"]["Row"],
  "id" | "title" | "updated_at" | "assistant_id" | "created_at"
>;

export default async function initHandler(req: Request, res: Response) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).send(`Method ${req.method} Not Allowed`);
  }

  // No user authentication, always use SERVICE_USER_ID
  const userId = SERVICE_USER_ID;
  const supabaseService = getSupabaseServiceRoleClient();

  const assistantId = req.query.assistantId as string | undefined;

  if (!assistantId) {
    return res.status(400).json({ error: "assistantId query parameter is required" });
  }

  console.log(`GET Init: Fetching threads for assistant ${assistantId} and user ${userId}`);

  try {
    const { data: threadsData, error: threadsError } = await supabaseService
      .from("threads")
      .select("id, title, updated_at, assistant_id, created_at")
      .eq("user_id", userId) // Use SERVICE_USER_ID
      .eq("assistant_id", assistantId)
      .order("updated_at", { ascending: false });

    if (threadsError) {
      console.error("Supabase GET threads error:", threadsError);
      return res.status(500).json({ error: `Failed to fetch threads: ${threadsError.message}` });
    }

    const threads = (threadsData || []) as Thread[];
    let messagesForLatestThread: Message[] = [];

    if (threads.length > 0) {
      const latestThreadId = threads[0].id;
      console.log(`GET Init: Found ${threads.length} threads, fetching messages for latest: ${latestThreadId}`);
      // Message fetching for a thread does not need explicit user_id check if thread itself is scoped to user
      const { data: messagesData, error: messagesError } = await supabaseService
        .from("messages")
        .select("*")
        .eq("thread_id", latestThreadId)
        .order("created_at", { ascending: true });

      if (messagesError) {
        console.error("Supabase GET latest messages error:", messagesError);
      } else {
        messagesForLatestThread = (messagesData || []) as Message[];
      }
    } else {
      console.log(`GET Init: No threads found for assistant ${assistantId} and user ${userId}`);
    }

    return res.status(200).json({ threads: threads, messages: messagesForLatestThread });

  } catch (error: unknown) {
    console.error("Unexpected GET /api/chat/init error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return res.status(500).json(
      { error: "An unexpected error occurred during initialization", details: message },
    );
  }
}
 