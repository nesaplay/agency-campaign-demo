
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  console.log('=== VITE CONFIG DEBUG ===');
  console.log('Mode:', mode);
  console.log('Command:', command);
  console.log('Current working directory:', process.cwd());
  console.log('VITE_SUPABASE_URL from loadEnv:', env.VITE_SUPABASE_URL);
  console.log('VITE_SUPABASE_ANON_KEY from loadEnv:', env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
  console.log('=== END VITE CONFIG DEBUG ===');

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    envPrefix: 'VITE_',
    define: {
      // Explicitly define env vars if they exist
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
    }
  };
});
