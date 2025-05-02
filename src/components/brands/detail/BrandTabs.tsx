import React from 'react';
import { cn } from '@/lib/utils';

// Helper function to capitalize strings
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface BrandTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs?: string[]; // Add optional tabs prop
}

// Define default tabs
const defaultTabs = ['overview', 'campaigns', 'publishers', 'settings'];

const BrandTabs: React.FC<BrandTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  tabs = defaultTabs // Use default if tabs prop is not provided
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center px-6">
        {tabs.map((tab) => (
          <button 
            key={tab}
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", // Added whitespace-nowrap
              activeTab === tab 
                ? "border-empowerlocal-blue text-empowerlocal-navy" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab(tab)}
          >
            {capitalize(tab)} {/* Use capitalized tab name */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrandTabs;
