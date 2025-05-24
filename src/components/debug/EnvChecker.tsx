
import React from 'react';

const EnvChecker = () => {
  const envVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    NODE_ENV: import.meta.env.NODE_ENV,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
  };

  const allViteVars = Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'));

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <h3 className="font-bold mb-2">Environment Variables Debug</h3>
      <div className="text-sm space-y-1">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key}>
            <span className="font-mono">{key}:</span>{' '}
            <span className={value ? 'text-green-400' : 'text-red-400'}>
              {value ? (key.includes('KEY') ? 'Present' : value) : 'Missing'}
            </span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="font-semibold">All VITE_ vars:</div>
          <div className="text-xs">{allViteVars.join(', ')}</div>
        </div>
      </div>
    </div>
  );
};

export default EnvChecker;
