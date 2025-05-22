import type { Request, Response } from 'express';
// import type { IncomingMessage } from "http"; // No longer needed
import { Database } from "@/types/supabase";
// Remove getUserByToken from imports
import { getSupabaseServiceRoleClient } from "@/lib/server/utils";

const SERVICE_USER_ID = process.env.SUPABASE_SERVICE_ROLE_UID;

if (!SERVICE_USER_ID) {
  throw new Error('SUPABASE_SERVICE_ROLE_UID is not set in environment variables');
}

// Now TypeScript knows this is a string
const userId: string = SERVICE_USER_ID;

// Type Aliases
type Thread = Database["public"]["Tables"]["threads"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];
type Assistant = Database["public"]["Tables"]["assistants"]["Row"];
type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];
type ThreadInsert = Database["public"]["Tables"]["threads"]["Insert"];

// Request Body Type
interface WelcomePostBody {
  assistantId?: string;
}

export default async function welcomeHandler(req: Request, res: Response) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).send(`Method ${req.method} Not Allowed`);
  }

  const supabaseService = getSupabaseServiceRoleClient();
  const { assistant_id } = req.body;

  try {
    const { data: thread, error: threadError } = await supabaseService
      .from("threads")
      .insert({
        user_id: userId,
        assistant_id: assistant_id || null,
        metadata: {
          is_welcome_thread: true,
        },
      })
      .select()
      .single();

    if (threadError) {
      console.error("Error creating welcome thread:", threadError);
      return res.status(500).json({ error: "Failed to create welcome thread" });
    }

    return res.status(200).json({ thread_id: thread.id });
  } catch (error) {
    console.error("Error in welcome handler:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
 