import type { IncomingMessage, ServerResponse } from "http";
import { Database } from "@/types/supabase";
import { getSupabaseServiceRoleClient, getUserByToken } from "@/lib/server/utils";

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

export default async function handler(req: IncomingMessage & { body?: WelcomePostBody }, res: ServerResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.statusCode = 405;
    return res.end(`Method ${req.method} Not Allowed`);
  }

  // --- Authentication ---
  const { user, error: authError } = await getUserByToken(req);
  if (authError || !user) {
    console.error("Auth Error in POST /api/chat/welcome:", authError);
    res.statusCode = 401;
    /* ... */ res.end(JSON.stringify({ error: "Unauthorized", details: authError?.message }));
    return;
  }
  const userId = user.id;
  // --- End Authentication ---

  const supabaseService = getSupabaseServiceRoleClient();

  try {
    const requestData = req.body;
    const { assistantId } = requestData || {};

    if (!assistantId) {
      res.statusCode = 400;
      /* ... */ res.end(JSON.stringify({ error: "Missing required field: assistantId" }));
      return;
    }

    // 0. Fetch Assistant's Welcome Message
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
      res.statusCode = status;
      /* ... */ res.end(JSON.stringify({ error: message }));
      return;
    }

    // Welcome message is expected to be string[] | null from DB schema
    const welcomeMessages = assistantData.welcome_message;
    if (
      !welcomeMessages ||
      !Array.isArray(welcomeMessages) ||
      welcomeMessages.length === 0 ||
      typeof welcomeMessages[0] !== "string"
    ) {
      console.warn(`Assistant ${assistantId} has no valid welcome message configured.`);
      res.statusCode = 400;
      /* ... */ res.end(
        JSON.stringify({ error: `Assistant ${assistantId} does not have a valid welcome message configured.` }),
      );
      return;
    }
    const firstWelcomeMessage = welcomeMessages[0];

    // 1. Create the new thread
    const threadToInsert: ThreadInsert = {
      user_id: userId,
      assistant_id: assistantId,
      title: "New Conversation", // Use a default title?
    };
    const { data: newThread, error: threadError } = await supabaseService
      .from("threads")
      .insert(threadToInsert)
      .select()
      .single();

    if (threadError || !newThread) {
      console.error("Supabase create thread error:", threadError);
      res.statusCode = 500;
      /* ... */ res.end(
        JSON.stringify({ error: `Failed to create thread: ${threadError?.message || "Unknown error"}` }),
      );
      return;
    }

    // 2. Insert the fetched welcome message
    const messageToInsert: MessageInsert = {
      thread_id: newThread.id,
      user_id: null, // Message is from assistant
      assistant_id: assistantId,
      role: "assistant",
      content: firstWelcomeMessage,
      completed: true, // Welcome message is complete
      metadata: null,
    };

    const { data: newMessage, error: messageError } = await supabaseService
      .from("messages")
      .insert(messageToInsert)
      .select()
      .single();

    if (messageError || !newMessage) {
      console.error("Supabase insert welcome message error:", messageError);
      // Attempt to delete the thread we just created?
      await supabaseService.from("threads").delete().eq("id", newThread.id);
      console.error("Rolled back thread creation due to message insert failure.");
      res.statusCode = 500;
      /* ... */ res.end(
        JSON.stringify({ error: `Failed to save welcome message: ${messageError?.message || "Unknown error"}` }),
      );
      return;
    }

    // Return both the new thread and the message
    res.statusCode = 201; // Created
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ thread: newThread as Thread, message: newMessage as Message }));
  } catch (error: unknown) {
    console.error("Unexpected POST /api/chat/welcome error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    res.statusCode = 500;
    /* ... */ res.end(JSON.stringify({ error: "An unexpected error occurred during welcome setup", details: message }));
  }
}
 