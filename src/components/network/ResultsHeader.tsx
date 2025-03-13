
import React from 'react';
import { List, Grid2X2, Map } from 'lucide-react';

interface ResultsHeaderProps {
  activeBrowseMethod: string;
  resultsDisplayMode: 'list' | 'grid' | 'map';
  setResultsDisplayMode: (mode: 'list' | 'grid' | 'map') => void;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ 
  activeBrowseMethod,
  resultsDisplayMode,
  setResultsDisplayMode
}) => {
  return (
    <div className="p-4 bg-white border-b border-gray-200 shadow-sm flex justify-between items-center">
      <h2 className="text-lg font-medium text-empowerlocal-navy">
        {activeBrowseMethod}
      </h2>
      
      {/* View controls moved up here */}
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
  );
};

export default ResultsHeader;
