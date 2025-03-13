
import React from 'react';
import { Publisher } from './types';
import { PublisherList } from '../lists/types';
import ResultsControls from './results/ResultsControls';
import ResultsContent from './results/ResultsContent';

interface ResultsDisplayProps {
  resultsDisplayMode: 'list' | 'map';
  filteredPublishers: Publisher[];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  selectedPublisher: Publisher | null;
  onPublisherSelect: (publisher: Publisher) => void;
  // Search props
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  publisherCount: number;
  showFilters: boolean;
  toggleFilters: () => void;
  setResultsDisplayMode: (mode: 'list' | 'map') => void;
  // List functionality props
  togglePublisherSelection?: (publisherId: string) => void;
  selectedPublishers?: string[];
  handleSaveToList?: (publisher: Publisher) => void;
  getPublisherLists?: (publisherId: string) => PublisherList[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  resultsDisplayMode,
  filteredPublishers,
  viewMode,
  setViewMode,
  selectedPublisher,
  onPublisherSelect,
  searchQuery,
  onSearchChange,
  publisherCount,
  showFilters,
  toggleFilters,
  setResultsDisplayMode,
  togglePublisherSelection,
  selectedPublishers = [],
  handleSaveToList,
  getPublisherLists
}) => {
  return (
    <div className="flex flex-col h-full">
      <ResultsControls 
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        publisherCount={publisherCount}
        showFilters={showFilters}
        toggleFilters={toggleFilters}
        resultsDisplayMode={resultsDisplayMode}
        setResultsDisplayMode={setResultsDisplayMode}
      />
      
      <ResultsContent 
        resultsDisplayMode={resultsDisplayMode}
        filteredPublishers={filteredPublishers}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedPublisher={selectedPublisher}
        onPublisherSelect={onPublisherSelect}
        togglePublisherSelection={togglePublisherSelection}
        selectedPublishers={selectedPublishers}
        handleSaveToList={handleSaveToList}
        getPublisherLists={getPublisherLists}
      />
    </div>
  );
};

export default ResultsDisplay;
