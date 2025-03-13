
import React from 'react';
import { Briefcase, Plus, Search } from 'lucide-react';

interface EmptyBrandsProps {
  isFiltered: boolean;
}

const EmptyBrands: React.FC<EmptyBrandsProps> = ({ isFiltered }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-16">
      {isFiltered ? (
        <>
          <div className="rounded-full bg-gray-100 p-3 mb-4">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No brands found</h3>
          <p className="text-gray-500 max-w-md">
            We couldn't find any brands matching your search. Try adjusting your search terms or create a new brand.
          </p>
        </>
      ) : (
        <>
          <div className="rounded-full bg-gray-100 p-3 mb-4">
            <Briefcase className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No brands yet</h3>
          <p className="text-gray-500 max-w-md mb-6">
            You haven't created any brands yet. Brands help you organize campaigns and audiences for different clients.
          </p>
          <button className="flex items-center gap-2 bg-empowerlocal-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-empowerlocal-navy transition-colors animate-pulse">
            <Plus className="h-5 w-5" />
            Add Your First Brand
          </button>
        </>
      )}
    </div>
  );
};

export default EmptyBrands;
