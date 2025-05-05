import type { IncomingMessage, ServerResponse } from 'http';
import { Database } from '@server/supabase'; // Use alias
import { getSupabaseServiceRoleClient, getUserByToken } from '@server/utils'; // Use alias

// Define expected request body shape for PATCH
interface UpdateThreadBody {
    title?: string;
}

export default async function handler(req: IncomingMessage & { query: { threadId?: string }, body?: UpdateThreadBody }, res: ServerResponse) {

    if (req.method !== 'PATCH') {
        res.setHeader('Allow', ['PATCH']);
        res.statusCode = 405;
        return res.end(`Method ${req.method} Not Allowed`);
    }

    // --- Authentication ---
    const { user, error: authError } = await getUserByToken(req);
    if (authError || !user) {
        console.error('Auth Error in PATCH /api/chat/threads/[threadId]:', authError);
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized', details: authError?.message }));
        return;
    }
    // --- End Authentication ---

    const supabaseService = getSupabaseServiceRoleClient();

    try {
        // 1. Extract Params & Body
        const threadId = req.query.threadId;
        // Vercel automatically parses JSON body if Content-Type is correct
        const requestData = req.body;
        const title = requestData?.title;

        // 2. Initial Validation
        if (!threadId) {
            res.statusCode = 400; /* ... */ res.end(JSON.stringify({ error: 'Thread ID is required in URL path' })); return;
        }
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            res.statusCode = 400; /* ... */ res.end(JSON.stringify({ error: 'Title is required and must be a non-empty string' })); return;
        }

        // 3. Check if thread exists and belongs to user (or handle permissions differently)
        // Note: Original code didn't check if user owns the thread, only if it exists.
        // Adding ownership check for security.
        const { data: threadData, error: threadFetchError } = await supabaseService
            .from('threads')
            .select('user_id')
            .eq('id', threadId)
            .eq('user_id', user.id) // Check ownership
            .single();

        if (threadFetchError || !threadData) {
            const status = (threadFetchError && threadFetchError.code === 'PGRST116') ? 404 : 500;
            const message = status === 404 ? 'Thread not found or access denied.' : `Database fetch error: ${threadFetchError?.message}`;
            console.error(`Fetch error for thread ${threadId}:`, threadFetchError || 'Not found/access denied');
            res.statusCode = status; /* ... */ res.end(JSON.stringify({ error: message })); return;
        }

        // 4. Update the thread title
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
            res.statusCode = 500; /* ... */ res.end(JSON.stringify({ error: 'Failed to update thread title' })); return;
        }

        // 5. Respond with updated data
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));

    } catch (error: unknown) {
        console.error("Error handling PATCH request:", error);
        const errorMessage = error instanceof Error ? `Server error: ${error.message}` : 'Internal Server Error';
        res.statusCode = 500; /* ... */ res.end(JSON.stringify({ error: errorMessage }));
    }
} 