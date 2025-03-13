
import React from 'react';
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
  
  return <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
        {/* Left side - Sort controls */}
        <div className="flex items-center space-x-6">
          <SortControls onSortChange={handleSortChange} />
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
    </div>;
};

export default PublisherResults;
