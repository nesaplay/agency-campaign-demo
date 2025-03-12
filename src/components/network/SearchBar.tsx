
import React from 'react';
import { Search, Filter, Map, List } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  publisherCount: number;
  showFilters: boolean;
  toggleFilters: () => void;
  resultsDisplayMode: 'list' | 'map';
  setResultsDisplayMode: (mode: 'list' | 'map') => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  publisherCount,
  showFilters,
  toggleFilters,
  resultsDisplayMode,
  setResultsDisplayMode,
}) => {
  return (
    <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-4 sticky top-0 z-10">
      <div className="relative flex-1 max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input 
          type="search" 
          placeholder="Search publishers by name, location, or category..." 
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-empowerlocal-blue focus:border-empowerlocal-blue" 
          value={searchQuery} 
          onChange={onSearchChange} 
        />
      </div>
      
      <div className="text-sm font-medium text-gray-500">
        {publisherCount} publishers found
      </div>
      
      <button 
        onClick={toggleFilters} 
        className={`p-2 rounded-lg flex items-center gap-1 ${showFilters ? 'bg-empowerlocal-blue text-white' : 'hover:bg-gray-100'}`}
      >
        <Filter className="h-4 w-4" />
        <span className="text-sm">Filters</span>
      </button>
      
      <div className="flex bg-gray-100 rounded-lg">
        <button
          onClick={() => setResultsDisplayMode('list')}
          className={`p-2 flex items-center gap-1 ${resultsDisplayMode === 'list' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'} rounded-l-lg`}
        >
          <List className="h-4 w-4" />
          <span className="text-sm">List</span>
        </button>
        <button
          onClick={() => setResultsDisplayMode('map')}
          className={`p-2 flex items-center gap-1 ${resultsDisplayMode === 'map' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'} rounded-r-lg`}
        >
          <Map className="h-4 w-4" />
          <span className="text-sm">Map</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
