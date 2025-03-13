
import React, { useState } from 'react';
import { Filter, X, Save } from 'lucide-react';
import PresetFilters from './filters/PresetFilters';
import AppliedFilters from './filters/AppliedFilters';
import LocationFilter from './filters/LocationFilter';
import ChannelFilter from './filters/ChannelFilter';
import ContentFilter from './filters/ContentFilter';
import PerformanceFilter from './filters/PerformanceFilter';
import AudienceFilter from './filters/AudienceFilter';
import SeasonalFilter from './filters/SeasonalFilter';

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
  
  // Mock function to save filter set
  const saveFilterSet = () => {
    alert('Filter set saved! (This would save the current filter configuration in a real app)');
  };
  
  // Mock function to load a preset filter
  const loadPresetFilter = (presetName: string) => {
    alert(`Loading "${presetName}" preset (This would load a predefined filter set in a real app)`);
  };
  
  return (
    <div className="w-full max-h-[90vh] overflow-y-auto rounded-lg">
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
        <PresetFilters loadPresetFilter={loadPresetFilter} />
      </div>
      
      {/* Applied filters section */}
      <AppliedFilters 
        selectedStates={selectedStates}
        toggleState={toggleState}
        selectedRegions={selectedRegions}
        toggleRegion={toggleRegion}
        selectedMetros={selectedMetros}
        toggleMetro={toggleMetro}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        selectedChannels={selectedChannels}
        toggleChannel={toggleChannel}
        selectedAgeGroups={selectedAgeGroups}
        toggleAgeGroup={toggleAgeGroup}
        selectedGenderGroups={selectedGenderGroups}
        toggleGenderGroup={toggleGenderGroup}
        selectedIncomeGroups={selectedIncomeGroups}
        toggleIncomeGroup={toggleIncomeGroup}
        selectedEngagementRanges={selectedEngagementRanges}
        toggleEngagementRange={toggleEngagementRange}
        selectedCpmRanges={selectedCpmRanges}
        toggleCpmRange={toggleCpmRange}
        selectedSeasons={selectedSeasons}
        toggleSeason={toggleSeason}
        saveFilterSet={saveFilterSet}
        totalActiveFilters={getTotalActiveFilters()}
      />
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location Section */}
        <LocationFilter
          selectedStates={selectedStates}
          toggleState={toggleState}
          selectedRegions={selectedRegions}
          toggleRegion={toggleRegion}
          selectedMetros={selectedMetros}
          toggleMetro={toggleMetro}
          states={states}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />
        
        {/* Channel Types Section */}
        <ChannelFilter
          selectedChannels={selectedChannels}
          toggleChannel={toggleChannel}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />
        
        {/* Content Categories Section */}
        <ContentFilter
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          categories={categories}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />
        
        {/* Performance Metrics Section */}
        <PerformanceFilter
          selectedEngagementRanges={selectedEngagementRanges}
          toggleEngagementRange={toggleEngagementRange}
          selectedCpmRanges={selectedCpmRanges}
          toggleCpmRange={toggleCpmRange}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />
        
        {/* Audience Demographics Section */}
        <AudienceFilter
          selectedAgeGroups={selectedAgeGroups}
          toggleAgeGroup={toggleAgeGroup}
          selectedGenderGroups={selectedGenderGroups}
          setSelectedGenderGroups={setSelectedGenderGroups}
          selectedIncomeGroups={selectedIncomeGroups}
          toggleIncomeGroup={toggleIncomeGroup}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />
        
        {/* Seasonal Relevance Section */}
        <SeasonalFilter
          selectedSeasons={selectedSeasons}
          toggleSeason={toggleSeason}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />
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
