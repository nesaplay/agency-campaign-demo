
import React from 'react';
import PublisherResults from './PublisherResults';
import MapView from './MapView';
import { Publisher } from './types';
import { Search, Filter, Map, List } from 'lucide-react';

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
  setResultsDisplayMode
}) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Controls bar */}
      <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-4 sticky top-0 z-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search publishers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
        
        <div className="text-sm font-medium text-gray-500">
          {publisherCount} publishers found
        </div>
        
        <button 
          onClick={toggleFilters} 
          className={`p-2 rounded-lg flex items-center gap-1 transition-colors ${
            showFilters ? 'bg-empowerlocal-blue text-white' : 'hover:bg-gray-100'
          }`}
        >
          <Filter className="h-4 w-4" />
          <span className="text-sm">Filters</span>
        </button>
        
        <div className="flex bg-gray-100 rounded-lg">
          <button
            onClick={() => setResultsDisplayMode('list')}
            className={`p-2 flex items-center gap-1 transition-colors ${
              resultsDisplayMode === 'list' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'
            } rounded-l-lg`}
          >
            <List className="h-4 w-4" />
            <span className="text-sm">List</span>
          </button>
          <button
            onClick={() => setResultsDisplayMode('map')}
            className={`p-2 flex items-center gap-1 transition-colors ${
              resultsDisplayMode === 'map' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'
            } rounded-r-lg`}
          >
            <Map className="h-4 w-4" />
            <span className="text-sm">Map</span>
          </button>
        </div>
      </div>

      {/* Results content */}
      <div className="flex-1 overflow-auto">
        {resultsDisplayMode === 'list' ? (
          <PublisherResults 
            publishers={filteredPublishers} 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
            onPublisherSelect={onPublisherSelect} 
          />
        ) : (
          <MapView 
            publishers={filteredPublishers} 
            selectedPublisher={selectedPublisher} 
            onPublisherSelect={onPublisherSelect} 
          />
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
