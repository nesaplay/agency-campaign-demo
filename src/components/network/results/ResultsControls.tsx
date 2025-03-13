
import React from 'react';
import { Filter, Map, Grid2X2, List, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SortControls from '../SortControls';

interface ResultsControlsProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  publisherCount: number;
  showFilters: boolean;
  toggleFilters: () => void;
  resultsDisplayMode: 'list' | 'grid' | 'map';
  setResultsDisplayMode: (mode: 'list' | 'grid' | 'map') => void;
  selectedStates: string[];
  selectedCategories: string[];
  toggleState?: (state: string) => void;
  toggleCategory?: (category: string) => void;
}

const ResultsControls: React.FC<ResultsControlsProps> = ({
  showFilters,
  toggleFilters,
  resultsDisplayMode,
  setResultsDisplayMode,
  selectedStates,
  selectedCategories,
  toggleState,
  toggleCategory,
  publisherCount
}) => {
  const hasActiveFilters = selectedStates.length > 0 || selectedCategories.length > 0;
  
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      {/* First row: Filters and view controls */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleFilters} 
            className={`p-2 rounded-lg flex items-center gap-1 transition-colors ${
              showFilters ? 'bg-empowerlocal-blue text-white' : 'hover:bg-gray-100'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm">Apply Filters</span>
          </button>
          
          <div className="flex-1 flex items-center gap-2 overflow-x-auto px-2 py-1 scrollbar-hide">
            {/* Active filter tags */}
            {hasActiveFilters && (
              <>
                {selectedStates.map(state => (
                  <Badge 
                    key={`state-${state}`} 
                    variant="outline" 
                    className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 flex items-center gap-1"
                  >
                    {state}
                    {toggleState && (
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleState(state);
                        }} 
                      />
                    )}
                  </Badge>
                ))}
                
                {selectedCategories.map(category => (
                  <Badge 
                    key={`category-${category}`} 
                    variant="outline" 
                    className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 flex items-center gap-1"
                  >
                    {category}
                    {toggleCategory && (
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategory(category);
                        }} 
                      />
                    )}
                  </Badge>
                ))}
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Sort controls - moved to match the image */}
          <SortControls onSortChange={() => {}} />
          
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
              onClick={() => setResultsDisplayMode('grid')} 
              className={`p-2 flex items-center gap-1 transition-colors ${
                resultsDisplayMode === 'grid' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid2X2 className="h-4 w-4" />
              <span className="text-sm">Grid</span>
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
      </div>
      
      {/* Second row: Publisher count only */}
      <div className="px-4 py-2 border-t border-gray-100">
        {/* Left-aligned publisher count */}
        <div className="text-sm text-gray-500 ml-2">
          {publisherCount} publishers found
        </div>
      </div>
    </div>
  );
};

export default ResultsControls;
