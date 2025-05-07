import type { Request, Response } from 'express';
// import type { IncomingMessage } from "http"; // No longer needed
import { Database } from "@/types/supabase";
// Remove getUserByToken from imports
import { getSupabaseServiceRoleClient } from "@/lib/server/utils";

const SERVICE_USER_ID = process.env.SUPABASE_SERVICE_ROLE_UID;

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

  // No user authentication, always use SERVICE_USER_ID
  const userId = SERVICE_USER_ID;
  
  const supabaseService = getSupabaseServiceRoleClient();

  try {
    const requestData: WelcomePostBody = req.body;
    const { assistantId } = requestData || {};

    if (!assistantId) {
      return res.status(400).json({ error: "Missing required field: assistantId" });
    }

    // Fetch Assistant's Welcome Message (no user context needed for this part)
    const { data: assistantData, error: assistantError } = await supabaseService
      .from("assistants")
      .select("welcome_message")
      .eq("id", assistantId)
      .single();

    if (assistantError || !assistantData) {
      console.error(`Assistant fetch error for ID ${assistantId}:`, assistantError);
      const status = assistantError?.code === "PGRST116" ? 404 : 500;
      const message =
        status === 404 ? "Assistant not found." : `Failed to fetch assistant details: ${assistantError?.message}`;
      return res.status(status).json({ error: message });
    }

    const welcomeMessages = assistantData.welcome_message;
    if (
      !welcomeMessages ||
      !Array.isArray(welcomeMessages) ||
      welcomeMessages.length === 0 ||
      typeof welcomeMessages[0] !== "string"
    ) {
      console.warn(`Assistant ${assistantId} has no valid welcome message configured.`);
      return res.status(400).json(
        { error: `Assistant ${assistantId} does not have a valid welcome message configured.` },
      );
    }
    const firstWelcomeMessage = welcomeMessages[0];

    // Create the new thread using SERVICE_USER_ID
    const threadToInsert: ThreadInsert = {
      user_id: userId, // Use SERVICE_USER_ID
      assistant_id: assistantId,
      title: "New Conversation",
    };
    const { data: newThread, error: threadError } = await supabaseService
      .from("threads")
      .insert(threadToInsert)
      .select()
      .single();

    if (threadError || !newThread) {
      console.error("Supabase create thread error:", threadError);
      return res.status(500).json(
        { error: `Failed to create thread: ${threadError?.message || "Unknown error"}` },
      );
    }

    // Insert the fetched welcome message (user_id is null as it's from assistant)
    const messageToInsert: MessageInsert = {
      thread_id: newThread.id,
      user_id: null, 
      assistant_id: assistantId,
      role: "assistant",
      content: firstWelcomeMessage,
      completed: true,
      metadata: null,
    };

    const { data: newMessage, error: messageError } = await supabaseService
      .from("messages")
      .insert(messageToInsert)
      .select()
      .single();

    if (messageError || !newMessage) {
      console.error("Supabase insert welcome message error:", messageError);
      await supabaseService.from("threads").delete().eq("id", newThread.id);
      console.error("Rolled back thread creation due to message insert failure.");
      return res.status(500).json(
        { error: `Failed to save welcome message: ${messageError?.message || "Unknown error"}` },
      );
    }

    return res.status(201).json({ thread: newThread as Thread, message: newMessage as Message });

  } catch (error: unknown) {
    console.error("Unexpected POST /api/chat/welcome error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return res.status(500).json({ error: "An unexpected error occurred during welcome setup", details: message });
  }
}
 