
import React from 'react';
import FilterModal from '../FilterModal';

interface FilterModalWrapperProps {
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

const FilterModalWrapper: React.FC<FilterModalWrapperProps> = ({
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
  return (
    <FilterModal 
      showFilters={showFilters}
      toggleFilters={toggleFilters}
      selectedStates={selectedStates}
      toggleState={toggleState}
      selectedCategories={selectedCategories}
      toggleCategory={toggleCategory}
      handleFilter={handleFilter}
      clearFilters={clearFilters}
      states={states}
      categories={categories}
    />
  );
};

export default FilterModalWrapper;
