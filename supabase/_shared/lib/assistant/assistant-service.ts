import OpenAI from "npm:openai@^4.20.0";
import { openai } from "../openai.ts";
import { Database } from "../types.ts";
import { SupabaseClient, createClient as createSupabaseClient, PostgrestError } from "npm:@supabase/supabase-js@^2.39.0";

type Assistant = OpenAI.Beta.Assistants.Assistant;
type AssistantUpdateParams = OpenAI.Beta.Assistants.AssistantUpdateParams;

// Environment variables for Supabase client (needed if not already globally available)
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SERVICE_ROLE_KEY");

// Helper function to create a service role client (similar to chat-stream-new)
let supabaseServiceClientInstance: SupabaseClient<Database> | null = null;
function getSupabaseServiceRoleClient(): SupabaseClient<Database> {
  if (!supabaseUrl || !supabaseServiceKey) {
    // This should ideally be checked at the top level of the function or module
    // For now, throwing an error here or ensuring they are set before calling.
    console.warn("Supabase URL or Service Key is not set. This might lead to errors if getSupabaseServiceRoleClient is called before they are available from environment.");
    // throw new Error("Supabase URL or Service Key is not initialized for service client in assistant-service.");
  }
  if (!supabaseServiceClientInstance) {
    if (!supabaseUrl || !supabaseServiceKey) { // Check again to ensure they are loaded if called early
        throw new Error("Supabase URL or Service Key is not available for creating client in assistant-service.");
    }
    supabaseServiceClientInstance = createSupabaseClient<Database>(
      supabaseUrl!,
      supabaseServiceKey!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }
  return supabaseServiceClientInstance;
}

type AssistantConfig = Database["public"]["Tables"]["assistants"]["Row"];

/**
 * Retrieves an OpenAI Assistant object using its corresponding database configuration ID.
 * Ensures the assistant is linked to a dedicated vector store.
 *
 * @param assistantId - The UUID of the assistant record in the public.assistants table.
 * @returns The OpenAI Assistant object.
 * @throws Error if the database record or OpenAI assistant cannot be found or retrieved/created.
 */
export async function getOpenaiAssistantByDbId(assistantId: string): Promise<Assistant> {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase environment variables (SUPABASE_URL, SERVICE_ROLE_KEY) are not loaded in assistant-service.");
  }
  const supabase = getSupabaseServiceRoleClient();

  // 1. Fetch assistant config from DB by its primary key (UUID)
  console.log(`Fetching assistant config for DB ID: ${assistantId}`);
  const { data: assistantConfig, error: fetchError } = (await supabase
    .from("assistants")
    .select("id, name, openai_assistant_id, system_prompt, openai_vector_store_id")
    .eq("id", assistantId)
    .single()) as { data: AssistantConfig; error: PostgrestError | null };

  if (fetchError || !assistantConfig) {
    console.error(`Error fetching assistant config for ID ${assistantId}:`, fetchError);
    const errorMessage =
      fetchError?.code === "PGRST116"
        ? `Assistant configuration with ID ${assistantId} not found in the database.`
        : `Failed to fetch assistant configuration: ${fetchError?.message || "Unknown error"}`;
    throw new Error(errorMessage);
  }

  const assistantName = assistantConfig.name || "Default Assistant Name";
  const systemPrompt = assistantConfig.system_prompt || "";

  // Scenario 1: OpenAI Assistant ID is missing in DB - Create new OpenAI assistant and vector store
  if (!assistantConfig.openai_assistant_id) {
    console.log(`OpenAI Assistant ID not found in DB for ${assistantId} (${assistantName}). Creating new OpenAI assistant and vector store.`);
    
    // 1a. Create new Vector Store
    console.log(`Creating new vector store for new assistant ${assistantName}...`);
    const newVectorStore = await openai.vectorStores.create({
      name: `VectorStore for ${assistantName} (DB ID: ${assistantId})`,
    });
    const newOpenAiVectorStoreId = newVectorStore.id;
    console.log(`Created new OpenAI vector store ${newOpenAiVectorStoreId}`);

    // 1b. Create new Assistant, linking to the new Vector Store
    const newOpenaiAssistant = await openai.beta.assistants.create({
      name: assistantName,
      instructions: systemPrompt,
      tools: [{ type: "file_search" }],
      tool_resources: {
        file_search: {
          vector_store_ids: [newOpenAiVectorStoreId],
        },
      },
      model: "gpt-4o", // Consider making this configurable
    });
    const newOpenaiAssistantId = newOpenaiAssistant.id;
    console.log(`Created new OpenAI assistant ${newOpenaiAssistantId}`);

    // 1c. Update the assistant config in DB with new OpenAI assistant ID and vector store ID
    console.log(`Updating DB for assistant ${assistantId} with new OpenAI assistant ID ${newOpenaiAssistantId} and VS ID ${newOpenAiVectorStoreId}`);
    const { error: dbUpdateError } = await supabase
      .from("assistants")
      .update({ 
        openai_assistant_id: newOpenaiAssistantId,
        openai_vector_store_id: newOpenAiVectorStoreId 
      })
      .eq("id", assistantId);

    if (dbUpdateError) {
      console.error(`Failed to update assistant ${assistantId} in DB with new OpenAI IDs:`, dbUpdateError);
      // Attempt to clean up created OpenAI resources if DB update fails
      await openai.beta.assistants.del(newOpenaiAssistantId).catch((err: Error) => console.error("Cleanup: Failed to delete new assistant", err));
      await openai.vectorStores.del(newOpenAiVectorStoreId).catch((err: Error) => console.error("Cleanup: Failed to delete new vector store", err));
      throw new Error(`Failed to update database after creating OpenAI resources: ${dbUpdateError.message}`);
    }
    return newOpenaiAssistant;
  }

  // Scenario 2: Existing OpenAI Assistant ID found in DB
  const currentOpenaiAssistantId = assistantConfig.openai_assistant_id;
  let currentDbVectorStoreId = assistantConfig.openai_vector_store_id;

  console.log(`Retrieving OpenAI assistant ${currentOpenaiAssistantId} (DB Vector Store ID: ${currentDbVectorStoreId || 'None'}) for DB config ${assistantId} (${assistantName})`);
  
  try {
    const assistant = await openai.beta.assistants.retrieve(currentOpenaiAssistantId);
    let needsUpdate = false;
    const updatePayload: AssistantUpdateParams = {};

    // Ensure file_search tool exists
    const hasFileSearchTool = assistant.tools.some(tool => tool.type === "file_search");
    if (!hasFileSearchTool) {
      console.log(`Assistant ${currentOpenaiAssistantId} is missing 'file_search' tool. Adding.`);
      updatePayload.tools = [...assistant.tools, { type: "file_search" }];
      needsUpdate = true;
    }

    // Ensure Vector Store exists and is linked
    if (!currentDbVectorStoreId) {
      console.log(`Assistant ${currentOpenaiAssistantId} has no vector store ID in DB. Creating and assigning one.`);
      const newVectorStore = await openai.vectorStores.create({
        name: `VectorStore for ${assistantName} (DB ID: ${assistantId}, existing assistant ${currentOpenaiAssistantId})`,
      });
      currentDbVectorStoreId = newVectorStore.id;
      console.log(`Created new OpenAI vector store ${currentDbVectorStoreId}`);
      
      const { error: vsUpdateError } = await supabase
        .from("assistants")
        .update({ openai_vector_store_id: currentDbVectorStoreId })
        .eq("id", assistantId);
      
      if (vsUpdateError) {
        console.error(`Failed to update assistant ${assistantId} in DB with new VS ID ${currentDbVectorStoreId}:`, vsUpdateError);
        await openai.vectorStores.del(currentDbVectorStoreId).catch((err: Error) => console.error("Cleanup: Failed to delete new vector store after DB update failure", err));
        throw new Error(`Failed to update database with new vector store ID: ${vsUpdateError.message}`);
      }
      console.log(`Saved new VS ID ${currentDbVectorStoreId} to DB for assistant ${assistantId}.`);
      // This new VS ID needs to be attached to the assistant on OpenAI
      needsUpdate = true; 
    }
    
    // Ensure the assistant on OpenAI is linked to the correct vector store ID from DB
    const assistantToolResources = assistant.tool_resources || {};
    const assistantFileSearch = assistantToolResources.file_search || {};
    const assistantVsIds = assistantFileSearch.vector_store_ids || [];

    if (!currentDbVectorStoreId) {
        // This should ideally not be reached if the logic above successfully creates/assigns currentDbVectorStoreId
        console.error("CRITICAL: currentDbVectorStoreId is still null/undefined after check/creation logic. This indicates a flaw.");
        throw new Error("Failed to establish a valid vector store ID for the assistant.");
    }

    if (!assistantVsIds.includes(currentDbVectorStoreId)) {
      console.log(`OpenAI assistant ${currentOpenaiAssistantId} not linked to required VS ${currentDbVectorStoreId}. Current linked VS: ${assistantVsIds.join(', ')}. Updating.`);
      updatePayload.tool_resources = {
        ...assistantToolResources,
        file_search: {
          ...assistantFileSearch,
          vector_store_ids: [currentDbVectorStoreId], // Assign the single dedicated VS
        }
      };
      needsUpdate = true;
    }

    if (needsUpdate) {
      // Preserve other fields if not explicitly changing them in updatePayload
      if (!updatePayload.name) updatePayload.name = assistant.name;
      if (!updatePayload.instructions) updatePayload.instructions = assistant.instructions;
      if (!updatePayload.model) updatePayload.model = assistant.model;

      console.log(`Updating OpenAI assistant ${currentOpenaiAssistantId} with payload:`, JSON.stringify(updatePayload));
      const updatedAssistant = await openai.beta.assistants.update(currentOpenaiAssistantId, updatePayload);
      console.log(`Successfully updated OpenAI assistant ${currentOpenaiAssistantId}.`);
      return updatedAssistant;
    }

    console.log(`OpenAI assistant ${currentOpenaiAssistantId} is up-to-date.`);
    return assistant; // Return original if no updates needed

  } catch (errorUnknown: unknown) {
    const error = errorUnknown as Error & { status?: number, message?: string };
    console.error(`Failed to retrieve or update OpenAI assistant ${currentOpenaiAssistantId} (DB ID ${assistantId}):`, error);
    if (error?.status === 404) {
      // If assistant not found on OpenAI, but DB had an ID, this is an inconsistency.
      // One option: clear the bad openai_assistant_id and openai_vector_store_id from DB and recall this function.
      // This would then trigger the creation flow. For simplicity now, just error out.
      console.error(`Attempting to clear problematic OpenAI IDs from DB assistant ${assistantId}`);
      await supabase.from("assistants").update({ openai_assistant_id: null, openai_vector_store_id: null }).eq("id", assistantId);
      throw new Error(
        `OpenAI Assistant ID ${currentOpenaiAssistantId} (from DB ${assistantId}) not found on OpenAI. Cleared DB record. Please try again. Original error: ${error.message}`
      );
    }
    throw new Error(`Failed to process OpenAI assistant ${currentOpenaiAssistantId}: ${error.message || "Unknown error"}`);
  }
}
