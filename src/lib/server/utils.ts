import type { IncomingMessage } from 'http';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Database } from '../../../api/types/supabase';

// --- Supabase Client Initialization ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log(supabaseUrl, supabaseServiceKey);
let supabaseServiceClientInstance: SupabaseClient<Database> | null = null;

export function getSupabaseServiceRoleClient(): SupabaseClient<Database> {
    if (!supabaseServiceClientInstance) {
        if (supabaseUrl && supabaseServiceKey) {
            supabaseServiceClientInstance = createClient<Database>(supabaseUrl, supabaseServiceKey);
        } else {
            console.error("Missing Supabase URL or Service Role Key env vars. Cannot initialize Supabase client.");
            // Throw an error or handle appropriately based on application needs
            throw new Error("Supabase client configuration error.");
        }
    }
    return supabaseServiceClientInstance;
}
// --- End Supabase Client ---

// --- Auth Helper ---
export async function getUserByToken(req: IncomingMessage): Promise<{ user: User | null; error: Error | null }> {
    const supabaseService = getSupabaseServiceRoleClient(); // Get instance

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { user: null, error: new Error('Missing or invalid Authorization header') };
    }
    const token = authHeader.split(' ')[1];

    if (!process.env.SUPABASE_JWT_SECRET) {
        console.error("Missing SUPABASE_JWT_SECRET env var.");
        return { user: null, error: new Error('Server configuration error') };
    }

    // No need to check if client is initialized here, getSupabaseServiceRoleClient handles it
    const { data, error } = await supabaseService.auth.getUser(token);

    if (error) {
        console.error('Token verification error:', error);
        return { user: null, error };
    }
    return { user: data.user, error: null };
}
// --- End Auth Helper --- 