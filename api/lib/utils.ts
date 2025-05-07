import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// --- Supabase Client Initialization ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase URL or Service Role Key environment variables');
}

// Now TypeScript knows these are strings
const url: string = supabaseUrl;
const key: string = supabaseServiceKey;

let supabaseServiceClientInstance: SupabaseClient<Database> | null = null;

export function getSupabaseServiceRoleClient(): SupabaseClient<Database> {
    if (!supabaseServiceClientInstance) {
        supabaseServiceClientInstance = createClient<Database>(url, key, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            },
            db: {
                schema: 'public'
            }
        });
    }
    return supabaseServiceClientInstance;
} 