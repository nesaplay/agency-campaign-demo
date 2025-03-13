
import React, { useState } from 'react';
import { Filter, X, Map, Search, ChevronDown, ChevronUp, Save, BookmarkPlus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FilterPanelProps {
  selectedStates: string[];
  toggleState: (state: string) => void;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  handleFilter: () => void;
  clearFilters: () => void;
  states: string[];
  categories: string[];
  closeFilters: () => void;
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

// Channel types
const CHANNEL_TYPES = [
  'Digital Display',
  'Email Newsletter',
  'Social Media',
  'Events',
  'Podcast',
  'Print',
  'Video'
];

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

// Audience demographics
const AUDIENCE_DEMOGRAPHICS = {
  age: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
  gender: ['Male-dominant', 'Female-dominant', 'Balanced'],
  income: ['Budget', 'Mid-tier', 'Affluent', 'Luxury']
};

// Seasonal periods
const SEASONAL_PERIODS = [
  'Winter Holidays',
  'Spring Break',
  'Summer Travel',
  'Back to School',
  'Fall Harvest',
  'Black Friday/Cyber Monday'
];

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedStates,
  toggleState,
  selectedCategories,
  toggleCategory,
  handleFilter,
  clearFilters,
  states,
  categories,
  closeFilters
}) => {
  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    channels: true,
    content: true,
    audience: false,
    performance: false,
    seasonal: false
  });
  
  // State for selected filters beyond the basic ones
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedMetros, setSelectedMetros] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [citySearch, setCitySearch] = useState('');
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [selectedGenderGroups, setSelectedGenderGroups] = useState<string[]>([]);
  const [selectedIncomeGroups, setSelectedIncomeGroups] = useState<string[]>([]);
  const [selectedEngagementRanges, setSelectedEngagementRanges] = useState<string[]>([]);
  const [selectedCpmRanges, setSelectedCpmRanges] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  
  // Toggle expanded sections
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Toggle region selection
  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region) 
        : [...prev, region]
    );
  };
  
  // Toggle metro area selection
  const toggleMetro = (metro: string) => {
    setSelectedMetros(prev => 
      prev.includes(metro) 
        ? prev.filter(m => m !== metro) 
        : [...prev, metro]
    );
  };
  
  // Toggle channel type selection
  const toggleChannel = (channel: string) => {
    setSelectedChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel) 
        : [...prev, channel]
    );
  };
  
  // Toggle demographics selections
  const toggleAgeGroup = (age: string) => {
    setSelectedAgeGroups(prev => 
      prev.includes(age) 
        ? prev.filter(a => a !== age) 
        : [...prev, age]
    );
  };
  
  const toggleGenderGroup = (gender: string) => {
    setSelectedGenderGroups(prev => 
      prev.includes(gender) 
        ? prev.filter(g => g !== gender) 
        : [...prev, gender]
    );
  };
  
  const toggleIncomeGroup = (income: string) => {
    setSelectedIncomeGroups(prev => 
      prev.includes(income) 
        ? prev.filter(i => i !== income) 
        : [...prev, income]
    );
  };
  
  // Toggle performance metrics
  const toggleEngagementRange = (range: string) => {
    setSelectedEngagementRanges(prev => 
      prev.includes(range) 
        ? prev.filter(r => r !== range) 
        : [...prev, range]
    );
  };
  
  const toggleCpmRange = (range: string) => {
    setSelectedCpmRanges(prev => 
      prev.includes(range) 
        ? prev.filter(r => r !== range) 
        : [...prev, range]
    );
  };
  
  // Toggle seasonal periods
  const toggleSeason = (season: string) => {
    setSelectedSeasons(prev => 
      prev.includes(season) 
        ? prev.filter(s => s !== season) 
        : [...prev, season]
    );
  };
  
  // Calculate total active filters
  const getTotalActiveFilters = () => {
    return (
      selectedStates.length + 
      selectedCategories.length + 
      selectedRegions.length + 
      selectedMetros.length +
      selectedChannels.length +
      selectedAgeGroups.length +
      selectedGenderGroups.length +
      selectedIncomeGroups.length +
      selectedEngagementRanges.length +
      selectedCpmRanges.length +
      selectedSeasons.length
    );
  };
  
  // Filter cities by search term
  const filteredCities = states.filter(city => 
    city.toLowerCase().includes(citySearch.toLowerCase())
  );
  
  // Mock function to save filter set
  const saveFilterSet = () => {
    alert('Filter set saved! (This would save the current filter configuration in a real app)');
  };
  
  // Mock function to load a preset filter
  const loadPresetFilter = (presetName: string) => {
    alert(`Loading "${presetName}" preset (This would load a predefined filter set in a real app)`);
  };
  
  return (
    <div className="fixed inset-y-0 left-0 z-30 w-80 bg-white shadow-xl transform transition-transform ease-in-out duration-300 overflow-y-auto">
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-empowerlocal-navy" />
            <h3 className="font-medium text-empowerlocal-navy">Filters</h3>
            
            {getTotalActiveFilters() > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 ml-2 text-xs font-medium text-white bg-empowerlocal-blue rounded-full">
                {getTotalActiveFilters()}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700">
              Clear All
            </button>
            <button 
              onClick={closeFilters}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Preset filter sets */}
        <div className="px-4 pb-2 overflow-x-auto">
          <p className="text-xs text-gray-500 mb-2">Preset Filters</p>
          <div className="flex space-x-2 pb-2">
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
      </div>
      
      {/* Applied filters section */}
      {getTotalActiveFilters() > 0 && (
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
              <div key={state} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs flex items-center gap-1">
                {state}
                <button onClick={() => toggleState(state)}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {selectedRegions.map(region => (
              <div key={region} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs flex items-center gap-1">
                {region}
                <button onClick={() => toggleRegion(region)}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {selectedMetros.map(metro => (
              <div key={metro} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs flex items-center gap-1">
                {metro}
                <button onClick={() => toggleMetro(metro)}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {selectedCategories.map(category => (
              <div key={category} className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs flex items-center gap-1">
                {category}
                <button onClick={() => toggleCategory(category)}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {selectedChannels.map(channel => (
              <div key={channel} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs flex items-center gap-1">
                {channel}
                <button onClick={() => toggleChannel(channel)}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {selectedAgeGroups.map(age => (
              <div key={age} className="px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs flex items-center gap-1">
                Age: {age}
                <button onClick={() => toggleAgeGroup(age)}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {selectedGenderGroups.map(gender => (
              <div key={gender} className="px-2 py-1 bg-pink-50 text-pink-700 rounded-full text-xs flex items-center gap-1">
                {gender}
                <button onClick={() => toggleGenderGroup(gender)}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {selectedIncomeGroups.map(income => (
              <div key={income} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs flex items-center gap-1">
                {income}
                <button onClick={() => toggleIncomeGroup(income)}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {selectedEngagementRanges.map(range => (
              <div key={range} className="px-2 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs flex items-center gap-1">
                Engagement: {range}
                <button onClick={() => toggleEngagementRange(range)}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {selectedCpmRanges.map(range => (
              <div key={range} className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-xs flex items-center gap-1">
                CPM: {range}
                <button onClick={() => toggleCpmRange(range)}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {selectedSeasons.map(season => (
              <div key={season} className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs flex items-center gap-1">
                {season}
                <button onClick={() => toggleSeason(season)}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="p-4">
        {/* Location Section */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('location')} 
            className="flex justify-between items-center w-full text-left mb-2"
          >
            <h4 className="text-sm font-medium text-gray-700">Location</h4>
            {expandedSections.location ? 
              <ChevronUp className="h-4 w-4 text-gray-500" /> : 
              <ChevronDown className="h-4 w-4 text-gray-500" />
            }
          </button>
          
          {expandedSections.location && (
            <div className="space-y-4">
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
            </div>
          )}
        </div>
        
        {/* Channel Types Section */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('channels')} 
            className="flex justify-between items-center w-full text-left mb-2"
          >
            <h4 className="text-sm font-medium text-gray-700">Available Channels</h4>
            {expandedSections.channels ? 
              <ChevronUp className="h-4 w-4 text-gray-500" /> : 
              <ChevronDown className="h-4 w-4 text-gray-500" />
            }
          </button>
          
          {expandedSections.channels && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {CHANNEL_TYPES.map(channel => (
                  <label key={channel} className="flex items-center gap-2 cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input 
                      type="checkbox" 
                      className="rounded text-empowerlocal-green focus:ring-empowerlocal-green" 
                      checked={selectedChannels.includes(channel)} 
                      onChange={() => toggleChannel(channel)} 
                    />
                    <span className="text-sm">{channel}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Content Categories Section */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('content')} 
            className="flex justify-between items-center w-full text-left mb-2"
          >
            <h4 className="text-sm font-medium text-gray-700">Content Categories</h4>
            {expandedSections.content ? 
              <ChevronUp className="h-4 w-4 text-gray-500" /> : 
              <ChevronDown className="h-4 w-4 text-gray-500" />
            }
          </button>
          
          {expandedSections.content && (
            <div className="space-y-2">
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
            </div>
          )}
        </div>
        
        {/* Performance Metrics Section */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('performance')} 
            className="flex justify-between items-center w-full text-left mb-2"
          >
            <h4 className="text-sm font-medium text-gray-700">Performance Metrics</h4>
            {expandedSections.performance ? 
              <ChevronUp className="h-4 w-4 text-gray-500" /> : 
              <ChevronDown className="h-4 w-4 text-gray-500" />
            }
          </button>
          
          {expandedSections.performance && (
            <div className="space-y-4">
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
            </div>
          )}
        </div>
        
        {/* Audience Demographics Section */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('audience')} 
            className="flex justify-between items-center w-full text-left mb-2"
          >
            <h4 className="text-sm font-medium text-gray-700">Audience Demographics</h4>
            {expandedSections.audience ? 
              <ChevronUp className="h-4 w-4 text-gray-500" /> : 
              <ChevronDown className="h-4 w-4 text-gray-500" />
            }
          </button>
          
          {expandedSections.audience && (
            <div className="space-y-4">
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
            </div>
          )}
        </div>
        
        {/* Seasonal Relevance Section */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('seasonal')} 
            className="flex justify-between items-center w-full text-left mb-2"
          >
            <h4 className="text-sm font-medium text-gray-700">Seasonal Relevance</h4>
            {expandedSections.seasonal ? 
              <ChevronUp className="h-4 w-4 text-gray-500" /> : 
              <ChevronDown className="h-4 w-4 text-gray-500" />
            }
          </button>
          
          {expandedSections.seasonal && (
            <div className="space-y-2">
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
            </div>
          )}
        </div>
      </div>
      
      <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 flex justify-end">
        <button 
          onClick={handleFilter} 
          className="py-2 px-4 bg-gradient-to-r from-empowerlocal-green to-empowerlocal-blue text-white rounded-lg font-medium"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
