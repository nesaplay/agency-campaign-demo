
import React from 'react';
import { Grid2X2, LayoutList } from 'lucide-react';
import { Publisher } from './types';
import PublisherCard from './PublisherCard';
import PublisherListItem from './PublisherListItem';
import SortControls from './SortControls';
import { PublisherList } from '../lists/types';
import EnhancedPublisherCard from './EnhancedPublisherCard';
import EnhancedPublisherListItem from './EnhancedPublisherListItem';

interface PublisherResultsProps {
  publishers: Publisher[];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onPublisherSelect: (publisher: Publisher) => void;
  togglePublisherSelection?: (publisherId: string) => void;
  selectedPublishers?: string[];
  handleSaveToList?: (publisher: Publisher) => void;
  getPublisherLists?: (publisherId: string) => PublisherList[];
  publisherCount?: number;
}

const PublisherResults: React.FC<PublisherResultsProps> = ({
  publishers,
  viewMode,
  setViewMode,
  onPublisherSelect,
  togglePublisherSelection,
  selectedPublishers = [],
  handleSaveToList,
  getPublisherLists,
  publisherCount
}) => {
  const handleSortChange = (sortBy: string) => {
    // Sort functionality will be implemented when needed
    console.log('Sorting by:', sortBy);
  };

  // Determine if we're using the enhanced components with list functionality
  const hasListFunctionality = !!togglePublisherSelection && !!handleSaveToList && !!getPublisherLists;
  
  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="text-sm font-medium text-gray-500 whitespace-nowrap">
          {publisherCount} publishers found
        </div>
        
        <div className="flex items-center gap-4">
          <SortControls onSortChange={handleSortChange} />
          
          <div className="flex bg-gray-100 rounded-lg shadow-sm">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-gradient-to-r from-empowerlocal-blue to-empowerlocal-green text-white shadow-inner' : 'text-gray-600 hover:bg-gray-200'}`}>
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-gradient-to-r from-empowerlocal-blue to-empowerlocal-green text-white shadow-inner' : 'text-gray-600 hover:bg-gray-200'}`}>
              <LayoutList className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="flex-1 p-4 overflow-auto bg-gray-50">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {publishers.map(publisher => 
              hasListFunctionality ? (
                <EnhancedPublisherCard 
                  key={publisher.id} 
                  publisher={publisher} 
                  onClick={() => onPublisherSelect(publisher)} 
                  isSelected={selectedPublishers.includes(publisher.id)} 
                  onToggleSelect={() => togglePublisherSelection!(publisher.id)} 
                  onSaveToList={() => handleSaveToList!(publisher)} 
                  inLists={getPublisherLists!(publisher.id)} 
                />
              ) : (
                <PublisherCard 
                  key={publisher.id} 
                  publisher={publisher} 
                  onClick={() => onPublisherSelect(publisher)} 
                />
              )
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {publishers.map(publisher => 
              <div key={publisher.id}>
                {hasListFunctionality ? (
                  <EnhancedPublisherListItem 
                    publisher={publisher} 
                    onClick={() => onPublisherSelect(publisher)} 
                    isSelected={selectedPublishers.includes(publisher.id)} 
                    onToggleSelect={() => togglePublisherSelection!(publisher.id)} 
                    onSaveToList={() => handleSaveToList!(publisher)} 
                    inLists={getPublisherLists!(publisher.id)} 
                  />
                ) : (
                  <PublisherListItem 
                    publisher={publisher} 
                    onClick={() => onPublisherSelect(publisher)} 
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublisherResults;
