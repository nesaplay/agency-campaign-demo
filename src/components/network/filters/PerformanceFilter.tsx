
import React from 'react';
import FilterSection from './FilterSection';

interface PerformanceFilterProps {
  selectedEngagementRanges: string[];
  toggleEngagementRange: (range: string) => void;
  selectedCpmRanges: string[];
  toggleCpmRange: (range: string) => void;
  expandedSections: { [key: string]: boolean };
  toggleSection: (section: string) => void;
}

// Performance metrics ranges
const PERFORMANCE_METRICS = {
  engagement: [
    { label: 'Low (0-2%)', value: [0, 2] },
    { label: 'Medium (2-5%)', value: [2, 5] },
    { label: 'High (5-10%)', value: [5, 10] },
    { label: 'Very High (10%+)', value: [10, 100] }
  ],
  cpm: [
    { label: 'Economy ($1-5)', value: [1, 5] },
    { label: 'Standard ($5-15)', value: [5, 15] },
    { label: 'Premium ($15-30)', value: [15, 30] },
    { label: 'Luxury ($30+)', value: [30, 1000] }
  ]
};

const PerformanceFilter: React.FC<PerformanceFilterProps> = ({
  selectedEngagementRanges,
  toggleEngagementRange,
  selectedCpmRanges,
  toggleCpmRange,
  expandedSections,
  toggleSection
}) => {
  return (
    <FilterSection 
      title="Performance Metrics" 
      isExpanded={expandedSections.performance} 
      toggleSection={() => toggleSection('performance')}
    >
      {/* Engagement rate */}
      <div>
        <h5 className="text-xs font-medium text-gray-500 mb-2">Engagement Rate</h5>
        <div className="space-y-2">
          {PERFORMANCE_METRICS.engagement.map(option => (
            <label key={option.label} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded text-empowerlocal-blue focus:ring-empowerlocal-blue" 
                checked={selectedEngagementRanges.includes(option.label)} 
                onChange={() => toggleEngagementRange(option.label)} 
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* CPM range */}
      <div>
        <h5 className="text-xs font-medium text-gray-500 mb-2">CPM Range</h5>
        <div className="space-y-2">
          {PERFORMANCE_METRICS.cpm.map(option => (
            <label key={option.label} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded text-empowerlocal-blue focus:ring-empowerlocal-blue" 
                checked={selectedCpmRanges.includes(option.label)} 
                onChange={() => toggleCpmRange(option.label)} 
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </FilterSection>
  );
};

export default PerformanceFilter;
