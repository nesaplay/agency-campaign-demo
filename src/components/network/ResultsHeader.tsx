
import React from 'react';
import { List, Grid2X2, Map } from 'lucide-react';

interface ResultsHeaderProps {
  activeBrowseMethod: string;
  resultsDisplayMode: 'list' | 'grid' | 'map';
  setResultsDisplayMode: (mode: 'list' | 'grid' | 'map') => void;
  publisherCount?: number;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ 
  activeBrowseMethod,
  resultsDisplayMode,
  setResultsDisplayMode,
  publisherCount
}) => {
  return (
    <div className="p-4 bg-white border-b border-gray-200 shadow-sm flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h2 className="heading-3 text-lg font-medium text-empowerlocal-navy">
          {activeBrowseMethod}
        </h2>
        {publisherCount !== undefined && (
          <span className="small-text text-sm text-gray-500 ml-2">
            ({publisherCount} publishers found)
          </span>
        )}
      </div>
      
      {/* View controls */}
      <div className="flex bg-gray-100 rounded-lg">
        <button 
          onClick={() => setResultsDisplayMode('list')} 
          className={`p-2 flex items-center gap-1 transition-colors ${
            resultsDisplayMode === 'list' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'
          } rounded-l-lg`}
        >
          <List className="h-4 w-4" />
          <span className="text-sm small-text">List</span>
        </button>
        <button 
          onClick={() => setResultsDisplayMode('grid')} 
          className={`p-2 flex items-center gap-1 transition-colors ${
            resultsDisplayMode === 'grid' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Grid2X2 className="h-4 w-4" />
          <span className="text-sm small-text">Grid</span>
        </button>
        <button 
          onClick={() => setResultsDisplayMode('map')} 
          className={`p-2 flex items-center gap-1 transition-colors ${
            resultsDisplayMode === 'map' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'
          } rounded-r-lg`}
        >
          <Map className="h-4 w-4" />
          <span className="text-sm small-text">Map</span>
        </button>
      </div>
    </div>
  );
};

export default ResultsHeader;
