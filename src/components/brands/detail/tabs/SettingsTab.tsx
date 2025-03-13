
import React from 'react';
import { Settings } from 'lucide-react';
import { Brand } from '@/components/brands/types';

interface SettingsTabProps {
  brand: Brand;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ brand }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center mb-6">
        <h2 className="text-lg font-medium text-gray-800">Settings</h2>
      </div>
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <Settings className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Settings content will appear here</h3>
        <p className="text-gray-500 max-w-md">
          This is a preview of the settings tab. In a real implementation, this would show brand settings for {brand.name}.
        </p>
      </div>
    </div>
  );
};

export default SettingsTab;
