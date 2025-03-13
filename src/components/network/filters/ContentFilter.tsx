
import React from 'react';
import FilterSection from './FilterSection';

interface ContentFilterProps {
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  categories: string[];
  expandedSections: { [key: string]: boolean };
  toggleSection: (section: string) => void;
}

const ContentFilter: React.FC<ContentFilterProps> = ({
  selectedCategories,
  toggleCategory,
  categories,
  expandedSections,
  toggleSection
}) => {
  return (
    <FilterSection 
      title="Content Categories" 
      isExpanded={expandedSections.content} 
      toggleSection={() => toggleSection('content')}
    >
      <div className="grid grid-cols-2 gap-2">
        {categories.map(category => (
          <label key={category} className="flex items-center gap-2 cursor-pointer">
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
    </FilterSection>
  );
};

export default ContentFilter;
