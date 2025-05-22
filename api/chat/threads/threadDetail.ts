import type { Request, Response } from 'express';
// import type { IncomingMessage } from "http"; // No longer needed
// Adjusted paths should still be correct
import { Database } from '../../types/supabase'; 
// Remove getUserByToken from imports
import { getSupabaseServiceRoleClient } from '../../../src/lib/server/utils';

const SERVICE_USER_ID = "26d5d4cf-c2f6-4f5d-a0a9-5aafcaf7e541";

// Define expected request body shape for PATCH
interface UpdateThreadBody {
    title?: string;
}

// Renamed handler and updated signature for Express
export default async function threadDetailHandler(req: Request, res: Response) {

    if (req.method !== 'PATCH') {
        res.setHeader('Allow', ['PATCH']);
        return res.status(405).send(`Method ${req.method} Not Allowed`);
    }

    // No user authentication, always use SERVICE_USER_ID
    const userId = SERVICE_USER_ID;
    const supabaseService = getSupabaseServiceRoleClient();

    try {
        const threadId = req.params.threadId; // Use req.params for dynamic route parameters
        const requestData: UpdateThreadBody = req.body;
        const title = requestData?.title;

        if (!threadId) {
            // This case should ideally be prevented by route setup, but good for robustness
            return res.status(400).json({ error: 'Thread ID is required in URL path' });
        }
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
        }

        // Check if thread exists and belongs to SERVICE_USER_ID
        const { data: threadData, error: threadFetchError } = await supabaseService
            .from('threads')
            .select('user_id') // Can select minimal field just for existence check
            .eq('id', threadId)
            .eq('user_id', userId) // Use SERVICE_USER_ID
            .single();

        if (threadFetchError || !threadData) {
            const status = (threadFetchError && threadFetchError.code === 'PGRST116') ? 404 : 500;
            const message = status === 404 ? 'Thread not found or access denied.' : `Database fetch error: ${threadFetchError?.message}`;
            console.error(`Fetch error for thread ${threadId}:`, threadFetchError || 'Not found/access denied');
            return res.status(status).json({ error: message });
        }

        const trimmedTitle = title.trim();
        const updateTimestamp = new Date().toISOString();

        const { data, error: updateError } = await supabaseService
            .from('threads')
            .update({ title: trimmedTitle, updated_at: updateTimestamp })
            .eq('id', threadId)
            .select('id, title, updated_at')
            .single();

        if (updateError) {
            console.error('Error updating thread title:', updateError);
            return res.status(500).json({ error: 'Failed to update thread title' });
        }

        return res.status(200).json(data);

    } catch (error: unknown) {
        console.error("Error handling PATCH request:", error);
        const errorMessage = error instanceof Error ? `Server error: ${error.message}` : 'Internal Server Error';
        return res.status(500).json({ error: errorMessage });
    }
} 