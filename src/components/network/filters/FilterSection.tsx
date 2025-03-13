
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  toggleSection: () => void;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  isExpanded,
  toggleSection,
  children
}) => {
  return (
    <div className="mb-4">
      <button 
        onClick={toggleSection} 
        className="flex justify-between items-center w-full text-left mb-2"
      >
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        {isExpanded ? 
          <ChevronUp className="h-4 w-4 text-gray-500" /> : 
          <ChevronDown className="h-4 w-4 text-gray-500" />
        }
      </button>
      
      {isExpanded && (
        <div className="space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterSection;
