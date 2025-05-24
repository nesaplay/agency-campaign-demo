
import React from 'react';

const EnvFileChecker = () => {
  const checkEnvFile = async () => {
    console.log('=== ENV FILE CHECKER ===');
    
    // Check if we're in development
    console.log('Environment mode:', import.meta.env.MODE);
    console.log('Is development:', import.meta.env.DEV);
    
    // Try to fetch the .env file (this will fail in production, but might give us clues in dev)
    try {
      const response = await fetch('/.env');
      console.log('.env file fetch status:', response.status);
      if (response.ok) {
        const text = await response.text();
        console.log('.env file contents length:', text.length);
        // Don't log the actual contents for security
      }
    } catch (error) {
      console.log('.env file fetch error (this is normal):', error.message);
    }
    
    // Check all environment variables
    const allEnv = import.meta.env;
    console.log('All import.meta.env keys:', Object.keys(allEnv));
    console.log('VITE_ prefixed keys:', Object.keys(allEnv).filter(k => k.startsWith('VITE_')));
    
    // Check specific variables
    console.log('VITE_SUPABASE_URL:', allEnv.VITE_SUPABASE_URL);
    console.log('VITE_SUPABASE_ANON_KEY present:', !!allEnv.VITE_SUPABASE_ANON_KEY);
    
    console.log('=== END ENV FILE CHECKER ===');
  };

  React.useEffect(() => {
    checkEnvFile();
  }, []);

  return (
    <div className="fixed top-20 left-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded max-w-md z-50">
      <h3 className="font-bold text-sm">Env File Checker</h3>
      <p className="text-xs mt-1">Check console for .env file validation</p>
      <button 
        onClick={checkEnvFile}
        className="mt-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs"
      >
        Re-check Env File
      </button>
    </div>
  );
};

export default EnvFileChecker;
