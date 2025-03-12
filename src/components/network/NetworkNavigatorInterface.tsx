
import React, { useState } from 'react';
import MapView from './MapView';
import FilterSidebar from './FilterSidebar';
import PublisherResults from './PublisherResults';
import PublisherDetail from './PublisherDetail';
import PublisherCollections from './PublisherCollections';
import SeasonalCalendar from './SeasonalCalendar';
import { Publisher, PublisherCollection, ViewMode } from './types';
import { ChevronLeft, Search, Map, Calendar, Filter, X } from 'lucide-react';
import { mockPublishers } from './mockData';
import { mockCollections, mockSeasonalEvents, eventCategories, eventRegions } from './mockCollectionsData';

const NetworkNavigatorInterface: React.FC = () => {
  const [publishers] = useState<Publisher[]>(mockPublishers);
  const [filteredPublishers, setFilteredPublishers] = useState<Publisher[]>(mockPublishers);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<PublisherCollection | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [displayMode, setDisplayMode] = useState<ViewMode>('map');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const states = ['Arizona', 'California', 'Nevada', 'Oregon', 'Washington'];
  const categories = ['News', 'Sports', 'Lifestyle', 'Food', 'Entertainment', 'Business'];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredPublishers(publishers);
      return;
    }
    
    const filtered = publishers.filter(pub => 
      pub.name.toLowerCase().includes(query.toLowerCase()) ||
      pub.location.toLowerCase().includes(query.toLowerCase()) ||
      pub.categories.some(cat => cat.toLowerCase().includes(query.toLowerCase()))
    );
    
    setFilteredPublishers(filtered);
  };

  const toggleState = (state: string) => {
    setSelectedStates(prev => 
      prev.includes(state) 
        ? prev.filter(s => s !== state) 
        : [...prev, state]
    );
  };
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handleFilter = () => {
    let filtered = publishers;
    
    if (selectedStates.length > 0) {
      filtered = filtered.filter(pub => selectedStates.includes(pub.state));
    }
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(pub => 
        pub.categories.some(cat => selectedCategories.includes(cat))
      );
    }
    
    setFilteredPublishers(filtered);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSelectedStates([]);
    setSelectedCategories([]);
    setFilteredPublishers(publishers);
  };

  const handlePublisherSelect = (publisher: Publisher) => {
    setSelectedPublisher(publisher);
  };

  const handleCloseDetail = () => {
    setSelectedPublisher(null);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleExploreCollection = (collection: PublisherCollection) => {
    setSelectedCollection(collection);
    console.log("Exploring collection:", collection.name);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-4 sticky top-0 z-10">
        <div className="relative flex-1 max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search publishers by name, location, or category..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-empowerlocal-blue focus:border-empowerlocal-blue"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="text-sm font-medium text-gray-500">
          {filteredPublishers.length} publishers found
        </div>
        
        <div className="flex bg-gray-100 rounded-lg">
          <button
            onClick={() => setDisplayMode('map')}
            className={`p-2 flex items-center gap-1 ${displayMode === 'map' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'} rounded-l-lg`}
          >
            <Map className="h-4 w-4" />
            <span className="text-sm">Map</span>
          </button>
          <button
            onClick={() => setDisplayMode('calendar')}
            className={`p-2 flex items-center gap-1 ${displayMode === 'calendar' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'} rounded-r-lg`}
          >
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Calendar</span>
          </button>
        </div>
        
        <button 
          onClick={toggleFilters}
          className={`p-2 rounded-lg flex items-center gap-1 ${showFilters ? 'bg-empowerlocal-blue text-white' : 'hover:bg-gray-100'}`}
        >
          <Filter className="h-4 w-4" />
          <span className="text-sm">Filters</span>
        </button>
      </div>
      
      {showFilters && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-empowerlocal-navy">Filters</h3>
            </div>
            
            <button 
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear All
            </button>
          </div>
          
          {/* Applied Filters */}
          {(selectedStates.length > 0 || selectedCategories.length > 0) && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Applied Filters</h4>
              <div className="flex flex-wrap gap-2">
                {selectedStates.map(state => (
                  <div 
                    key={state}
                    className="px-2 py-1 bg-blue-50 text-empowerlocal-blue rounded-full text-xs flex items-center gap-1"
                  >
                    {state}
                    <button onClick={() => toggleState(state)}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                {selectedCategories.map(category => (
                  <div 
                    key={category}
                    className="px-2 py-1 bg-green-50 text-empowerlocal-green rounded-full text-xs flex items-center gap-1"
                  >
                    {category}
                    <button onClick={() => toggleCategory(category)}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Geographic Filters */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Location</h4>
              
              <div className="space-y-2">
                {states.map(state => (
                  <label 
                    key={state}
                    className="flex items-center gap-2 cursor-pointer"
                  >
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
            
            {/* Content Category Filters */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Content Categories</h4>
              
              <div className="space-y-2">
                {categories.map(category => (
                  <label 
                    key={category}
                    className="flex items-center gap-2 cursor-pointer"
                  >
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
            
            {/* Audience Filters */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Audience Size</h4>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="audience"
                    className="text-empowerlocal-blue focus:ring-empowerlocal-blue"
                  />
                  <span className="text-sm">Small (Under 10k)</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="audience"
                    className="text-empowerlocal-blue focus:ring-empowerlocal-blue"
                  />
                  <span className="text-sm">Medium (10k-50k)</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="audience"
                    className="text-empowerlocal-blue focus:ring-empowerlocal-blue"
                  />
                  <span className="text-sm">Large (50k+)</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleFilter}
              className="py-2 px-4 bg-gradient-to-r from-empowerlocal-green to-empowerlocal-blue text-white rounded-lg font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-empowerlocal-navy">Featured Collections</h3>
            <button className="text-sm text-empowerlocal-blue hover:underline">
              View All Collections
            </button>
          </div>
          <PublisherCollections 
            collections={mockCollections}
            onExploreCollection={handleExploreCollection}
          />
        </div>
        
        {displayMode === 'map' ? (
          <>
            <div className="h-[60vh] border-b border-gray-200">
              <MapView 
                publishers={filteredPublishers} 
                onPublisherSelect={handlePublisherSelect}
                selectedPublisher={selectedPublisher}
              />
            </div>
            
            <div className="h-[40vh] overflow-hidden">
              <PublisherResults 
                publishers={filteredPublishers}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onPublisherSelect={handlePublisherSelect}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-auto">
            <SeasonalCalendar 
              events={mockSeasonalEvents}
              regions={eventRegions}
              categories={eventCategories}
            />
          </div>
        )}
      </div>
      
      {selectedPublisher && (
        <PublisherDetail 
          publisher={selectedPublisher} 
          onClose={handleCloseDetail} 
        />
      )}
    </div>
  );
};

export default NetworkNavigatorInterface;
