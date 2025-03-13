
import React, { useState } from 'react';
import { Search, Map } from 'lucide-react';
import FilterSection from './FilterSection';

interface LocationFilterProps {
  selectedStates: string[];
  toggleState: (state: string) => void;
  selectedRegions: string[];
  toggleRegion: (region: string) => void;
  selectedMetros: string[];
  toggleMetro: (metro: string) => void;
  states: string[];
  expandedSections: { [key: string]: boolean };
  toggleSection: (section: string) => void;
}

// Region groupings
const REGION_GROUPS = {
  'West Coast': ['California', 'Oregon', 'Washington'],
  'Southwest': ['Arizona', 'Nevada', 'New Mexico'],
  'Midwest': ['Illinois', 'Michigan', 'Ohio', 'Wisconsin'],
  'Northeast': ['New York', 'Massachusetts', 'Connecticut', 'Pennsylvania'],
  'Southeast': ['Florida', 'Georgia', 'North Carolina', 'South Carolina']
};

// Metro areas
const METRO_AREAS = [
  'Phoenix Metro',
  'Greater Los Angeles',
  'Bay Area',
  'Portland-Vancouver-Hillsboro',
  'Seattle-Tacoma',
  'Las Vegas-Henderson'
];

const LocationFilter: React.FC<LocationFilterProps> = ({
  selectedStates,
  toggleState,
  selectedRegions,
  toggleRegion,
  selectedMetros,
  toggleMetro,
  states,
  expandedSections,
  toggleSection
}) => {
  const [citySearch, setCitySearch] = useState('');
  
  // Filter cities by search term
  const filteredCities = states.filter(city => 
    city.toLowerCase().includes(citySearch.toLowerCase())
  );
  
  return (
    <FilterSection 
      title="Location" 
      isExpanded={expandedSections.location} 
      toggleSection={() => toggleSection('location')}
    >
      {/* City/State search */}
      <div>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search cities or states" 
            className="pl-10 w-full p-2 border border-gray-200 rounded-lg text-sm"
            value={citySearch}
            onChange={e => setCitySearch(e.target.value)}
          />
        </div>
        
        {citySearch && (
          <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredCities.length > 0 ? (
              filteredCities.map(city => (
                <label key={city} className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded text-empowerlocal-blue focus:ring-empowerlocal-blue" 
                    checked={selectedStates.includes(city)} 
                    onChange={() => toggleState(city)} 
                  />
                  <span className="text-sm">{city}</span>
                </label>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-500">No results found</div>
            )}
          </div>
        )}
      </div>
      
      {/* Map-based selection placeholder */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button className="w-full bg-gray-50 p-3 text-sm text-gray-700 flex items-center justify-center">
          <Map className="h-4 w-4 mr-2 text-gray-500" />
          Open Map Selection Tool
        </button>
      </div>
      
      {/* Region groups */}
      <div>
        <h5 className="text-xs font-medium text-gray-500 mb-2">Regions</h5>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(REGION_GROUPS).map(region => (
            <label key={region} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded text-empowerlocal-blue focus:ring-empowerlocal-blue" 
                checked={selectedRegions.includes(region)} 
                onChange={() => toggleRegion(region)} 
              />
              <span className="text-sm">{region}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Metro areas */}
      <div>
        <h5 className="text-xs font-medium text-gray-500 mb-2">Metro Areas</h5>
        <div className="grid grid-cols-2 gap-2">
          {METRO_AREAS.map(metro => (
            <label key={metro} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded text-empowerlocal-blue focus:ring-empowerlocal-blue" 
                checked={selectedMetros.includes(metro)} 
                onChange={() => toggleMetro(metro)} 
              />
              <span className="text-sm truncate">{metro}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* States */}
      <div>
        <h5 className="text-xs font-medium text-gray-500 mb-2">States</h5>
        <div className="grid grid-cols-2 gap-2">
          {states.map(state => (
            <label key={state} className="flex items-center gap-2 cursor-pointer">
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
    </FilterSection>
  );
};

export default LocationFilter;
