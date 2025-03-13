
import React from 'react';
import { LineChart, Globe, LayoutGrid } from 'lucide-react';

const OverviewTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <LineChart className="h-5 w-5 text-empowerlocal-blue" />
          <h3 className="font-medium text-gray-800">Performance Summary</h3>
        </div>
        <div className="h-44 flex items-center justify-center border border-gray-100 rounded bg-gray-50">
          <span className="text-sm text-gray-500">Performance chart preview</span>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-empowerlocal-blue" />
          <h3 className="font-medium text-gray-800">Active Publishers</h3>
        </div>
        <div className="h-44 flex items-center justify-center border border-gray-100 rounded bg-gray-50">
          <span className="text-sm text-gray-500">Publisher map preview</span>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <LayoutGrid className="h-5 w-5 text-empowerlocal-blue" />
          <h3 className="font-medium text-gray-800">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">C</div>
            <div>
              <div className="text-sm font-medium">Campaign Created</div>
              <div className="text-xs text-gray-500">Summer Promotion</div>
            </div>
            <div className="ml-auto text-xs text-gray-500">2d ago</div>
          </div>
          <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">P</div>
            <div>
              <div className="text-sm font-medium">Publisher Added</div>
              <div className="text-xs text-gray-500">Daily Chronicle</div>
            </div>
            <div className="ml-auto text-xs text-gray-500">5d ago</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
