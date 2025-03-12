
import React from 'react';
import PublisherResults from './PublisherResults';
import MapView from './MapView';
import { Publisher } from './types';

interface ResultsDisplayProps {
  resultsDisplayMode: 'list' | 'map';
  filteredPublishers: Publisher[];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  selectedPublisher: Publisher | null;
  onPublisherSelect: (publisher: Publisher) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  resultsDisplayMode,
  filteredPublishers,
  viewMode,
  setViewMode,
  selectedPublisher,
  onPublisherSelect
}) => {
  return (
    <div className="flex-1 flex flex-col">
      {resultsDisplayMode === 'list' ? (
        <div className="flex-1">
          <PublisherResults 
            publishers={filteredPublishers} 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
            onPublisherSelect={onPublisherSelect} 
          />
        </div>
      ) : (
        <div className="flex-1">
          <MapView 
            publishers={filteredPublishers} 
            selectedPublisher={selectedPublisher} 
            onPublisherSelect={onPublisherSelect} 
          />
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
