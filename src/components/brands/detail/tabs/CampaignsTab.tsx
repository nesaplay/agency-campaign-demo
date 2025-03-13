
import React from 'react';
import { LineChart } from 'lucide-react';
import { Brand } from '@/components/brands/types';

interface CampaignsTabProps {
  brand: Brand;
}

const CampaignsTab: React.FC<CampaignsTabProps> = ({ brand }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-800">Campaigns</h2>
        <button className="px-4 py-2 bg-empowerlocal-blue text-white text-sm rounded-lg hover:bg-empowerlocal-navy transition-colors">
          New Campaign
        </button>
      </div>
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <LineChart className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Campaign content will appear here</h3>
        <p className="text-gray-500 max-w-md">
          This is a preview of the campaigns tab. In a real implementation, this would show a list of campaigns for {brand.name}.
        </p>
      </div>
    </div>
  );
};

export default CampaignsTab;
