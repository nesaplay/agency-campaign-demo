import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// --- Supabase Client Initialization ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase URL or Service Role Key environment variables');
}

let supabaseServiceClientInstance: SupabaseClient<Database> | null = null;

export function getSupabaseServiceRoleClient(): SupabaseClient<Database> {
    if (!supabaseServiceClientInstance) {
        supabaseServiceClientInstance = createClient<Database>(supabaseUrl, supabaseServiceKey);
    }
    return supabaseServiceClientInstance;
} 