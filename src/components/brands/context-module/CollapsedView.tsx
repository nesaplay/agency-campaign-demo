
import React from 'react';
import { Brand } from '../types';
import { Badge } from '@/components/ui/badge';
import { BarChart2 } from 'lucide-react';

interface CollapsedViewProps {
  brand: Brand;
}

const CollapsedView: React.FC<CollapsedViewProps> = ({ brand }) => {
  return (
    <div className="flex items-center gap-3 flex-shrink-0 w-[calc(100%-80px)]">
      <div 
        className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
        style={{ backgroundColor: brand.color }}
      >
        {brand.name.charAt(0)}
      </div>
      <div>
        <h2 className="text-lg font-semibold">{brand.name}</h2>
        <p className="text-sm text-gray-500 max-w-md truncate">{brand.description}</p>
      </div>
      
      {/* Key Metrics - Visible in Collapsed State */}
      <div className="flex items-center gap-6 ml-auto flex-grow justify-end flex-wrap flex-shrink-0">
        <div className="text-center">
          <div className="flex items-center justify-center text-gray-500 mb-1">
            <BarChart2 className="h-4 w-4 mr-1" />
            <span className="text-xs">Campaigns</span>
          </div>
          <span className="text-lg font-semibold">{brand.campaignCount}</span>
        </div>
        
        <Badge 
          className="h-7 rounded-md flex items-center" 
          variant="outline"
          style={{ 
            borderColor: brand.isActive ? '#22c55e' : '#94a3b8',
            backgroundColor: brand.isActive ? 'rgba(34, 197, 94, 0.1)' : 'transparent'
          }}
        >
          <span className={`mr-1.5 h-2 w-2 rounded-full ${brand.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          {brand.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>
    </div>
  );
};

export default CollapsedView;
