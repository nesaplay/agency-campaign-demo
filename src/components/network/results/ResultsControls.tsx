import React from 'react';
import { Filter, Search, Map, List } from 'lucide-react';
interface ResultsControlsProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  publisherCount: number;
  showFilters: boolean;
  toggleFilters: () => void;
  resultsDisplayMode: 'list' | 'map';
  setResultsDisplayMode: (mode: 'list' | 'map') => void;
}
const ResultsControls: React.FC<ResultsControlsProps> = ({
  searchQuery,
  onSearchChange,
  publisherCount,
  showFilters,
  toggleFilters,
  resultsDisplayMode,
  setResultsDisplayMode
}) => {
  return <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-4 sticky top-0 z-10">
      
      
      <button onClick={toggleFilters} className={`p-2 rounded-lg flex items-center gap-1 transition-colors ${showFilters ? 'bg-empowerlocal-blue text-white' : 'hover:bg-gray-100'}`}>
        <Filter className="h-4 w-4" />
        <span className="text-sm">Filters</span>
      </button>
      
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="Search publishers..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-empowerlocal-blue focus:border-transparent" value={searchQuery} onChange={onSearchChange} />
      </div>
      
      <div className="flex bg-gray-100 rounded-lg ml-auto">
        <button onClick={() => setResultsDisplayMode('list')} className={`p-2 flex items-center gap-1 transition-colors ${resultsDisplayMode === 'list' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'} rounded-l-lg`}>
          <List className="h-4 w-4" />
          <span className="text-sm">List</span>
        </button>
        <button onClick={() => setResultsDisplayMode('map')} className={`p-2 flex items-center gap-1 transition-colors ${resultsDisplayMode === 'map' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'} rounded-r-lg`}>
          <Map className="h-4 w-4" />
          <span className="text-sm">Map</span>
        </button>
      </div>
    </div>;
};
export default ResultsControls;