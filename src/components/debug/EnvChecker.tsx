
import React from 'react';

const EnvChecker = () => {
  const envVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    NODE_ENV: import.meta.env.NODE_ENV,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    BASE_URL: import.meta.env.BASE_URL,
    SSR: import.meta.env.SSR,
  };

  const allViteVars = Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'));
  const allEnvKeys = Object.keys(import.meta.env);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md z-50 max-h-96 overflow-y-auto">
      <h3 className="font-bold mb-2">Environment Variables Debug</h3>
      <div className="text-sm space-y-1">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="font-mono text-xs">{key}:</span>{' '}
            <span className={value !== undefined ? 'text-green-400' : 'text-red-400'}>
              {value !== undefined ? (key.includes('KEY') ? 'Present' : String(value)) : 'UNDEFINED'}
            </span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="font-semibold text-xs">All VITE_ vars ({allViteVars.length}):</div>
          <div className="text-xs">{allViteVars.join(', ') || 'NONE FOUND'}</div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="font-semibold text-xs">All env keys ({allEnvKeys.length}):</div>
          <div className="text-xs break-all">{allEnvKeys.join(', ')}</div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="font-semibold text-xs">Env Object Type:</div>
          <div className="text-xs">{typeof import.meta.env}</div>
        </div>
      </div>
    </div>
  );
};

export default EnvChecker;
