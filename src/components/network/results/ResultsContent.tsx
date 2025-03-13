
import React from 'react';
import PublisherResults from '../PublisherResults';
import MapView from '../MapView';
import { Publisher } from '../types';
import { PublisherList } from '../../lists/types';

interface ResultsContentProps {
  resultsDisplayMode: 'list' | 'map';
  filteredPublishers: Publisher[];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  selectedPublisher: Publisher | null;
  onPublisherSelect: (publisher: Publisher) => void;
  togglePublisherSelection?: (publisherId: string) => void;
  selectedPublishers?: string[];
  handleSaveToList?: (publisher: Publisher) => void;
  getPublisherLists?: (publisherId: string) => PublisherList[];
}

const ResultsContent: React.FC<ResultsContentProps> = ({
  resultsDisplayMode,
  filteredPublishers,
  viewMode,
  setViewMode,
  selectedPublisher,
  onPublisherSelect,
  togglePublisherSelection,
  selectedPublishers = [],
  handleSaveToList,
  getPublisherLists
}) => {
  return (
    <div className="flex-1 overflow-auto">
      {resultsDisplayMode === 'list' ? (
        <PublisherResults 
          publishers={filteredPublishers} 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          onPublisherSelect={onPublisherSelect}
          togglePublisherSelection={togglePublisherSelection}
          selectedPublishers={selectedPublishers}
          handleSaveToList={handleSaveToList}
          getPublisherLists={getPublisherLists}
        />
      ) : (
        <MapView 
          publishers={filteredPublishers} 
          selectedPublisher={selectedPublisher} 
          onPublisherSelect={onPublisherSelect} 
        />
      )}
    </div>
  );
};

export default ResultsContent;
