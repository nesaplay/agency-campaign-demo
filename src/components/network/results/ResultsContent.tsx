
import React from 'react';
import { Publisher } from '../types';
import PublisherResults from '../PublisherResults';
import MapView from '../MapView';
import { PublisherList } from '@/components/lists/types';

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
  publisherCount?: number;
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
  getPublisherLists,
  publisherCount
}) => {
  return (
    <div className="flex-1 h-0">
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
          publisherCount={publisherCount !== undefined ? publisherCount : filteredPublishers.length}
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
