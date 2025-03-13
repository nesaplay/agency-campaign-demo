
import React from 'react';
import { Save } from 'lucide-react';
import FilterChip from './FilterChip';

interface AppliedFiltersProps {
  selectedStates: string[];
  toggleState: (state: string) => void;
  selectedRegions: string[];
  toggleRegion: (region: string) => void;
  selectedMetros: string[];
  toggleMetro: (metro: string) => void;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  selectedChannels: string[];
  toggleChannel: (channel: string) => void;
  selectedAgeGroups: string[];
  toggleAgeGroup: (age: string) => void;
  selectedGenderGroups: string[];
  toggleGenderGroup: (gender: string) => void;
  selectedIncomeGroups: string[];
  toggleIncomeGroup: (income: string) => void;
  selectedEngagementRanges: string[];
  toggleEngagementRange: (range: string) => void;
  selectedCpmRanges: string[];
  toggleCpmRange: (range: string) => void;
  selectedSeasons: string[];
  toggleSeason: (season: string) => void;
  saveFilterSet: () => void;
  totalActiveFilters: number;
}

const AppliedFilters: React.FC<AppliedFiltersProps> = ({
  selectedStates,
  toggleState,
  selectedRegions,
  toggleRegion,
  selectedMetros,
  toggleMetro,
  selectedCategories,
  toggleCategory,
  selectedChannels,
  toggleChannel,
  selectedAgeGroups,
  toggleAgeGroup,
  selectedGenderGroups,
  toggleGenderGroup,
  selectedIncomeGroups,
  toggleIncomeGroup,
  selectedEngagementRanges,
  toggleEngagementRange,
  selectedCpmRanges,
  toggleCpmRange,
  selectedSeasons,
  toggleSeason,
  saveFilterSet,
  totalActiveFilters
}) => {
  if (totalActiveFilters === 0) return null;
  
  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-700">Applied Filters</h4>
        <button 
          onClick={saveFilterSet}
          className="flex items-center text-xs text-empowerlocal-blue hover:text-empowerlocal-navy"
        >
          <Save className="h-3 w-3 mr-1" />
          Save Set
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {selectedStates.map(state => (
          <FilterChip 
            key={state} 
            label={state} 
            colorClass="bg-blue-50 text-blue-700" 
            onRemove={() => toggleState(state)} 
          />
        ))}
        
        {selectedRegions.map(region => (
          <FilterChip 
            key={region} 
            label={region} 
            colorClass="bg-indigo-50 text-indigo-700" 
            onRemove={() => toggleRegion(region)} 
          />
        ))}
        
        {selectedMetros.map(metro => (
          <FilterChip 
            key={metro} 
            label={metro} 
            colorClass="bg-purple-50 text-purple-700" 
            onRemove={() => toggleMetro(metro)} 
          />
        ))}
        
        {selectedCategories.map(category => (
          <FilterChip 
            key={category} 
            label={category} 
            colorClass="bg-green-50 text-green-700" 
            onRemove={() => toggleCategory(category)} 
          />
        ))}
        
        {selectedChannels.map(channel => (
          <FilterChip 
            key={channel} 
            label={channel} 
            colorClass="bg-yellow-50 text-yellow-700" 
            onRemove={() => toggleChannel(channel)} 
          />
        ))}
        
        {selectedAgeGroups.map(age => (
          <FilterChip 
            key={age} 
            label={`Age: ${age}`} 
            colorClass="bg-orange-50 text-orange-700" 
            onRemove={() => toggleAgeGroup(age)} 
          />
        ))}
        
        {selectedGenderGroups.map(gender => (
          <FilterChip 
            key={gender} 
            label={gender} 
            colorClass="bg-pink-50 text-pink-700" 
            onRemove={() => toggleGenderGroup(gender)} 
          />
        ))}
        
        {selectedIncomeGroups.map(income => (
          <FilterChip 
            key={income} 
            label={income} 
            colorClass="bg-emerald-50 text-emerald-700" 
            onRemove={() => toggleIncomeGroup(income)} 
          />
        ))}
        
        {selectedEngagementRanges.map(range => (
          <FilterChip 
            key={range} 
            label={`Engagement: ${range}`} 
            colorClass="bg-cyan-50 text-cyan-700" 
            onRemove={() => toggleEngagementRange(range)} 
          />
        ))}
        
        {selectedCpmRanges.map(range => (
          <FilterChip 
            key={range} 
            label={`CPM: ${range}`} 
            colorClass="bg-teal-50 text-teal-700" 
            onRemove={() => toggleCpmRange(range)} 
          />
        ))}
        
        {selectedSeasons.map(season => (
          <FilterChip 
            key={season} 
            label={season} 
            colorClass="bg-red-50 text-red-700" 
            onRemove={() => toggleSeason(season)} 
          />
        ))}
      </div>
    </div>
  );
};

export default AppliedFilters;
