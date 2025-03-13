
import React from 'react';
import { Publisher } from './types';
import { PublisherList } from '../lists/types';
import ResultsControls from './results/ResultsControls';
import ResultsContent from './results/ResultsContent';

interface ResultsDisplayProps {
  resultsDisplayMode: 'list' | 'grid' | 'map';
  filteredPublishers: Publisher[];
  selectedPublisher: Publisher | null;
  onPublisherSelect: (publisher: Publisher) => void;
  // Search props
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  publisherCount: number;
  showFilters: boolean;
  toggleFilters: () => void;
  setResultsDisplayMode: (mode: 'list' | 'grid' | 'map') => void;
  // List functionality props
  togglePublisherSelection?: (publisherId: string) => void;
  selectedPublishers?: string[];
  handleSaveToList?: (publisher: Publisher) => void;
  getPublisherLists?: (publisherId: string) => PublisherList[];
  // Filter props
  selectedStates?: string[];
  selectedCategories?: string[];
  toggleState?: (state: string) => void;
  toggleCategory?: (category: string) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  resultsDisplayMode,
  filteredPublishers,
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
  getPublisherLists,
  selectedStates = [],
  selectedCategories = [],
  toggleState,
  toggleCategory
}) => {
  const handleSortChange = (sortBy: string) => {
    // Sort functionality will be implemented when needed
    console.log('Sorting by:', sortBy);
  };

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
        selectedStates={selectedStates}
        selectedCategories={selectedCategories}
        toggleState={toggleState}
        toggleCategory={toggleCategory}
      />
      
      <ResultsContent 
        resultsDisplayMode={resultsDisplayMode}
        filteredPublishers={filteredPublishers}
        selectedPublisher={selectedPublisher}
        onPublisherSelect={onPublisherSelect}
        togglePublisherSelection={togglePublisherSelection}
        selectedPublishers={selectedPublishers}
        handleSaveToList={handleSaveToList}
        getPublisherLists={getPublisherLists}
        publisherCount={publisherCount}
      />
    </div>
  );
};

export default ResultsDisplay;
