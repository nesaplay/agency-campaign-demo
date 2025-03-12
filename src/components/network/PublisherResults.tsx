import React from 'react';
import { Grid2X2, LayoutList } from 'lucide-react';
import { Publisher } from './types';
import PublisherCard from './PublisherCard';
import PublisherListItem from './PublisherListItem';
import SortControls from './SortControls';

interface PublisherResultsProps {
  publishers: Publisher[];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onPublisherSelect: (publisher: Publisher) => void;
}

const PublisherResults: React.FC<PublisherResultsProps> = ({ 
  publishers, 
  viewMode, 
  setViewMode,
  onPublisherSelect
}) => {
  const handleSortChange = (sortBy: string) => {
    // Sort functionality will be implemented when needed
    console.log('Sorting by:', sortBy);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-medium text-empowerlocal-navy">Publisher Results</h3>
        
        <div className="flex items-center gap-4">
          <SortControls onSortChange={handleSortChange} />
          
          <div className="flex bg-gray-100 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <LayoutList className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="flex-1 p-4 overflow-auto">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {publishers.map(publisher => (
              <PublisherCard 
                key={publisher.id} 
                publisher={publisher}
                onClick={() => onPublisherSelect(publisher)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {publishers.map(publisher => (
              <PublisherListItem 
                key={publisher.id} 
                publisher={publisher}
                onClick={() => onPublisherSelect(publisher)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublisherResults;
