
import React from 'react';
import { Newspaper, Image, LineChart } from 'lucide-react';

interface AvailableInventoryProps {
  // No specific props needed for now, but could be expanded later
}

const AvailableInventory: React.FC<AvailableInventoryProps> = () => {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-500 mb-2">Available Inventory</h4>
      
      <div className="space-y-3">
        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-empowerlocal-blue" />
            <div>
              <div className="text-sm font-medium">Content Placement</div>
              <div className="text-xs text-gray-500">Sponsored articles</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">$1,500</div>
            <div className="text-xs text-gray-500">per article</div>
          </div>
        </div>
        
        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5 text-empowerlocal-green" />
            <div>
              <div className="text-sm font-medium">Banner Ads</div>
              <div className="text-xs text-gray-500">300x250, 728x90</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">$12 CPM</div>
            <div className="text-xs text-gray-500">min 10,000 impr.</div>
          </div>
        </div>
        
        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-purple-500" />
            <div>
              <div className="text-sm font-medium">Newsletter Insertion</div>
              <div className="text-xs text-gray-500">25,000 subscribers</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">$800</div>
            <div className="text-xs text-gray-500">per insertion</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableInventory;
