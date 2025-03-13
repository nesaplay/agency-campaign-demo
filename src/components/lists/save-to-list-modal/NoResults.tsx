
import React from 'react';
import { Search } from 'lucide-react';

interface NoResultsProps {
  searchQuery: string;
  onCreateNew: () => void;
}

const NoResults: React.FC<NoResultsProps> = ({ searchQuery, onCreateNew }) => {
  return (
    <div className="py-8 flex flex-col items-center justify-center text-gray-500">
      <Search className="h-10 w-10 text-gray-300 mb-2" />
      <p className="text-sm mb-2">No lists found matching "{searchQuery}"</p>
      <button 
        className="text-empowerlocal-blue text-sm font-medium hover:underline"
        onClick={onCreateNew}
      >
        Create a new list?
      </button>
    </div>
  );
};

export default NoResults;
