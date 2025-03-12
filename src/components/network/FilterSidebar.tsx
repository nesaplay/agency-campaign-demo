
import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface FilterSidebarProps {
  onApplyFilters: (filters: any) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onApplyFilters }) => {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const states = ['Arizona', 'California', 'Nevada', 'Oregon', 'Washington'];
  const categories = ['News', 'Sports', 'Lifestyle', 'Food', 'Entertainment', 'Business'];
  
  const toggleState = (state: string) => {
    if (selectedStates.includes(state)) {
      setSelectedStates(selectedStates.filter(s => s !== state));
    } else {
      setSelectedStates([...selectedStates, state]);
    }
  };
  
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  const clearFilters = () => {
    setSelectedStates([]);
    setSelectedCategories([]);
  };
  
  const applyFilters = () => {
    onApplyFilters({
      states: selectedStates,
      categories: selectedCategories,
    });
  };
  
  return (
    <div className="w-64 border-r border-gray-200 bg-white flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium text-empowerlocal-navy">Filters</h3>
        </div>
        
        <button 
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear All
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {/* Applied Filters */}
        {(selectedStates.length > 0 || selectedCategories.length > 0) && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Applied Filters</h4>
            <div className="flex flex-wrap gap-2">
              {selectedStates.map(state => (
                <div 
                  key={state}
                  className="px-2 py-1 bg-blue-50 text-empowerlocal-blue rounded-full text-xs flex items-center gap-1"
                >
                  {state}
                  <button onClick={() => toggleState(state)}>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              {selectedCategories.map(category => (
                <div 
                  key={category}
                  className="px-2 py-1 bg-green-50 text-empowerlocal-green rounded-full text-xs flex items-center gap-1"
                >
                  {category}
                  <button onClick={() => toggleCategory(category)}>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Geographic Filters */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Location</h4>
          
          <div className="space-y-2">
            {states.map(state => (
              <label 
                key={state}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="rounded text-empowerlocal-blue focus:ring-empowerlocal-blue"
                  checked={selectedStates.includes(state)}
                  onChange={() => toggleState(state)}
                />
                <span className="text-sm">{state}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Content Category Filters */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Content Categories</h4>
          
          <div className="space-y-2">
            {categories.map(category => (
              <label 
                key={category}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="rounded text-empowerlocal-green focus:ring-empowerlocal-green"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                <span className="text-sm">{category}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Audience Filters */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Audience Size</h4>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="audience"
                className="text-empowerlocal-blue focus:ring-empowerlocal-blue"
              />
              <span className="text-sm">Small (Under 10k)</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="audience"
                className="text-empowerlocal-blue focus:ring-empowerlocal-blue"
              />
              <span className="text-sm">Medium (10k-50k)</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="audience"
                className="text-empowerlocal-blue focus:ring-empowerlocal-blue"
              />
              <span className="text-sm">Large (50k+)</span>
            </label>
          </div>
        </div>
        
        {/* Performance Filters */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Performance</h4>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded text-empowerlocal-blue focus:ring-empowerlocal-blue"
              />
              <span className="text-sm">Good</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded text-empowerlocal-blue focus:ring-empowerlocal-blue"
              />
              <span className="text-sm">Average</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded text-empowerlocal-blue focus:ring-empowerlocal-blue"
              />
              <span className="text-sm">Excellent</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={applyFilters}
          className="w-full py-2 bg-gradient-to-r from-empowerlocal-green to-empowerlocal-blue text-white rounded-lg font-medium"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
