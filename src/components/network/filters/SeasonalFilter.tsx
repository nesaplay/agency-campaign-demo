
import React from 'react';
import FilterSection from './FilterSection';

interface SeasonalFilterProps {
  selectedSeasons: string[];
  toggleSeason: (season: string) => void;
  expandedSections: { [key: string]: boolean };
  toggleSection: (section: string) => void;
}

// Seasonal periods
const SEASONAL_PERIODS = [
  'Winter Holidays',
  'Spring Break',
  'Summer Travel',
  'Back to School',
  'Fall Harvest',
  'Black Friday/Cyber Monday'
];

const SeasonalFilter: React.FC<SeasonalFilterProps> = ({
  selectedSeasons,
  toggleSeason,
  expandedSections,
  toggleSection
}) => {
  return (
    <FilterSection 
      title="Seasonal Relevance" 
      isExpanded={expandedSections.seasonal} 
      toggleSection={() => toggleSection('seasonal')}
    >
      <div className="grid grid-cols-2 gap-2">
        {SEASONAL_PERIODS.map(season => (
          <label key={season} className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded text-empowerlocal-blue focus:ring-empowerlocal-blue" 
              checked={selectedSeasons.includes(season)} 
              onChange={() => toggleSeason(season)} 
            />
            <span className="text-sm">{season}</span>
          </label>
        ))}
      </div>
    </FilterSection>
  );
};

export default SeasonalFilter;
