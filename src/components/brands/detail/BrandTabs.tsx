
import React from 'react';
import { cn } from '@/lib/utils';

interface BrandTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BrandTabs: React.FC<BrandTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center px-6">
        <button 
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === 'overview' 
              ? "border-empowerlocal-blue text-empowerlocal-navy" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === 'campaigns' 
              ? "border-empowerlocal-blue text-empowerlocal-navy" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setActiveTab('campaigns')}
        >
          Campaigns
        </button>
        <button 
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === 'publishers' 
              ? "border-empowerlocal-blue text-empowerlocal-navy" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setActiveTab('publishers')}
        >
          Publishers
        </button>
        <button 
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === 'settings' 
              ? "border-empowerlocal-blue text-empowerlocal-navy" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>
    </div>
  );
};

export default BrandTabs;
