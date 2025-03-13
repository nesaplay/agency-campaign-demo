
import React from 'react';
import { Publisher } from '../types';
import PublisherResults from '../PublisherResults';
import MapView from '../MapView';
import { PublisherList } from '@/components/lists/types';

interface ResultsContentProps {
  resultsDisplayMode: 'list' | 'grid' | 'map';
  filteredPublishers: Publisher[];
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
      {resultsDisplayMode === 'map' ? (
        <MapView 
          publishers={filteredPublishers}
          selectedPublisher={selectedPublisher}
          onPublisherSelect={onPublisherSelect}
        />
      ) : (
        <PublisherResults 
          publishers={filteredPublishers}
          viewMode={resultsDisplayMode}
          onPublisherSelect={onPublisherSelect}
          togglePublisherSelection={togglePublisherSelection}
          selectedPublishers={selectedPublishers}
          handleSaveToList={handleSaveToList}
          getPublisherLists={getPublisherLists}
          publisherCount={publisherCount !== undefined ? publisherCount : filteredPublishers.length}
        />
      )}
    </div>
  );
};

export default ResultsContent;
