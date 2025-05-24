
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing required Supabase environment variables. Please configure them in your Supabase integration.");
  }

  return createBrowserClient(url, key);
};
