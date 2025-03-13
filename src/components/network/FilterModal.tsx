
import React from 'react';
import FilterPanel from './FilterPanel';

interface FilterModalProps {
  showFilters: boolean;
  toggleFilters: () => void;
  selectedStates: string[];
  toggleState: (state: string) => void;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  handleFilter: () => void;
  clearFilters: () => void;
  states: string[];
  categories: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  showFilters,
  toggleFilters,
  selectedStates,
  toggleState,
  selectedCategories,
  toggleCategory,
  handleFilter,
  clearFilters,
  states,
  categories
}) => {
  if (!showFilters) return null;
  
  return (
    <>
      {/* Semi-transparent overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={toggleFilters}
      ></div>
      
      {/* Central filter dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <FilterPanel 
            selectedStates={selectedStates}
            toggleState={toggleState}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            handleFilter={handleFilter}
            clearFilters={clearFilters}
            states={states}
            categories={categories}
            closeFilters={toggleFilters}
          />
        </div>
      </div>
    </>
  );
};

export default FilterModal;
