
import React from 'react';

const EnvDebugger = () => {
  const checkEnvFile = () => {
    // Check if we can access process.env (this won't work in browser but good to check)
    console.log("=== ENV FILE CHECK ===");
    
    // Check import.meta.env
    console.log("import.meta.env object:", import.meta.env);
    console.log("All keys:", Object.keys(import.meta.env));
    
    // Specifically check our vars
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log("VITE_SUPABASE_URL value:", supabaseUrl);
    console.log("VITE_SUPABASE_ANON_KEY value:", supabaseKey);
    console.log("URL is defined:", !!supabaseUrl);
    console.log("KEY is defined:", !!supabaseKey);
    
    // Check if running in dev mode
    console.log("Development mode:", import.meta.env.DEV);
    console.log("Production mode:", import.meta.env.PROD);
    console.log("Mode:", import.meta.env.MODE);
  };

  React.useEffect(() => {
    checkEnvFile();
  }, []);

  return (
    <div className="fixed top-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md z-50">
      <h3 className="font-bold text-sm">Environment Debug</h3>
      <p className="text-xs mt-1">Check browser console for detailed env var info</p>
      <button 
        onClick={checkEnvFile}
        className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
      >
        Re-check Env Vars
      </button>
    </div>
  );
};

export default EnvDebugger;
