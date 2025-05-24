
import { createBrowserClient } from "@supabase/ssr";

// Enhanced debugging for environment variables
console.log("=== Environment Variables Debug ===");
console.log("NODE_ENV:", import.meta.env.NODE_ENV);
console.log("MODE:", import.meta.env.MODE);
console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log("All VITE_ prefixed vars:", Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
console.log("All env vars:", import.meta.env);
console.log("Document ready state:", document.readyState);
console.log("Timestamp:", new Date().toISOString());

// Check if we're in development mode
console.log("Is development:", import.meta.env.DEV);
console.log("Is production:", import.meta.env.PROD);

// Fallback values in case env variables are not loaded
const FALLBACK_URL = "https://mcvvxrrllkpzlqubgthy.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jdnZ4cnJsbGtwemxxdWJndGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3ODg4MDUsImV4cCI6MjA2MDM2NDgwNX0.O7iahvRBDKOAM0Qouqlp6hCu9GdkR6S74h4mgytEocQ";

console.log("=== End Debug ===");

export const createClient = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY;

  console.log("Creating Supabase client with:", { 
    url: url ? "Present" : "Missing", 
    key: key ? "Present" : "Missing",
    usingFallback: !import.meta.env.VITE_SUPABASE_URL,
    actualUrl: import.meta.env.VITE_SUPABASE_URL,
    actualKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? "Present" : "Missing"
  });

  if (!url || !key) {
    console.error("Missing Supabase environment variables:");
    console.error("VITE_SUPABASE_URL:", url);
    console.error("VITE_SUPABASE_ANON_KEY:", key ? "Present" : "Missing");
    throw new Error("Missing required Supabase environment variables");
  }

  return createBrowserClient(url, key);
};
