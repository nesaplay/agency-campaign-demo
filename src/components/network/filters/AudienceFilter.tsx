
import React from 'react';
import FilterSection from './FilterSection';

interface AudienceFilterProps {
  selectedAgeGroups: string[];
  toggleAgeGroup: (age: string) => void;
  selectedGenderGroups: string[];
  setSelectedGenderGroups: (genders: string[]) => void;
  selectedIncomeGroups: string[];
  toggleIncomeGroup: (income: string) => void;
  expandedSections: { [key: string]: boolean };
  toggleSection: (section: string) => void;
}

// Audience demographics
const AUDIENCE_DEMOGRAPHICS = {
  age: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
  gender: ['Male-dominant', 'Female-dominant', 'Balanced'],
  income: ['Budget', 'Mid-tier', 'Affluent', 'Luxury']
};

const AudienceFilter: React.FC<AudienceFilterProps> = ({
  selectedAgeGroups,
  toggleAgeGroup,
  selectedGenderGroups,
  setSelectedGenderGroups,
  selectedIncomeGroups,
  toggleIncomeGroup,
  expandedSections,
  toggleSection
}) => {
  return (
    <FilterSection 
      title="Audience Demographics" 
      isExpanded={expandedSections.audience} 
      toggleSection={() => toggleSection('audience')}
    >
      {/* Age Groups */}
      <div>
        <h5 className="text-xs font-medium text-gray-500 mb-2">Age Groups</h5>
        <div className="grid grid-cols-2 gap-2">
          {AUDIENCE_DEMOGRAPHICS.age.map(age => (
            <label key={age} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded text-empowerlocal-green focus:ring-empowerlocal-green" 
                checked={selectedAgeGroups.includes(age)} 
                onChange={() => toggleAgeGroup(age)} 
              />
              <span className="text-sm">{age}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Gender */}
      <div>
        <h5 className="text-xs font-medium text-gray-500 mb-2">Primary Audience</h5>
        <div className="space-y-2">
          {AUDIENCE_DEMOGRAPHICS.gender.map(gender => (
            <label key={gender} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="gender" 
                className="text-empowerlocal-blue focus:ring-empowerlocal-blue" 
                checked={selectedGenderGroups.includes(gender)} 
                onChange={() => {
                  setSelectedGenderGroups([gender]);
                }} 
              />
              <span className="text-sm">{gender}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Income Level */}
      <div>
        <h5 className="text-xs font-medium text-gray-500 mb-2">Income Level</h5>
        <div className="space-y-2">
          {AUDIENCE_DEMOGRAPHICS.income.map(income => (
            <label key={income} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded text-empowerlocal-green focus:ring-empowerlocal-green" 
                checked={selectedIncomeGroups.includes(income)} 
                onChange={() => toggleIncomeGroup(income)} 
              />
              <span className="text-sm">{income}</span>
            </label>
          ))}
        </div>
      </div>
    </FilterSection>
  );
};

export default AudienceFilter;
