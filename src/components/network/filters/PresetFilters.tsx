
import React from 'react';
import { cn } from '@/lib/utils';

interface PresetFiltersProps {
  loadPresetFilter: (presetName: string) => void;
}

// Add pre-configured filter sets
const PRESET_FILTER_SETS = [
  { 
    name: 'High Engagement Email', 
    icon: 'mail',
    color: 'bg-blue-100 text-blue-700'
  },
  { 
    name: 'Family-Focused Content', 
    icon: 'users',
    color: 'bg-green-100 text-green-700'
  },
  { 
    name: 'Local News Outlets', 
    icon: 'newspaper',
    color: 'bg-yellow-100 text-yellow-700'
  },
  { 
    name: 'Seasonal Holiday', 
    icon: 'calendar',
    color: 'bg-purple-100 text-purple-700'
  },
  { 
    name: 'High-Value Metro Areas', 
    icon: 'map-pin',
    color: 'bg-red-100 text-red-700'
  }
];

const PresetFilters: React.FC<PresetFiltersProps> = ({ loadPresetFilter }) => {
  return (
    <div className="px-4 pb-2 overflow-x-auto">
      <p className="text-xs text-gray-500 mb-2">Preset Filters</p>
      <div className="flex space-x-2 pb-2 overflow-x-auto">
        {PRESET_FILTER_SETS.map(preset => (
          <button
            key={preset.name}
            onClick={() => loadPresetFilter(preset.name)}
            className={cn(
              "flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium",
              preset.color
            )}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetFilters;
