
import React, { useState } from 'react';
import MapView from './MapView';
import PublisherResults from './PublisherResults';
import PublisherDetail from './PublisherDetail';
import PublisherCollections from './PublisherCollections';
import SeasonalCalendar from './SeasonalCalendar';
import { Publisher, PublisherCollection } from './types';
import { ChevronLeft, Search, Map, List, Filter, X } from 'lucide-react';
import { mockPublishers } from './mockData';
import { mockCollections, mockSeasonalEvents, eventCategories, eventRegions } from './mockCollectionsData';

const NetworkNavigatorInterface: React.FC = () => {
  // Data state
  const [publishers] = useState<Publisher[]>(mockPublishers);
  const [filteredPublishers, setFilteredPublishers] = useState<Publisher[]>(mockPublishers);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<PublisherCollection | null>(null);
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [resultsDisplayMode, setResultsDisplayMode] = useState<'list' | 'map'>('list');
  
  // Filter states
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeSource, setActiveSource] = useState<'search' | 'filters' | 'collection'>('search');
  
  // Filter options
  const states = ['Arizona', 'California', 'Nevada', 'Oregon', 'Washington'];
  const categories = ['News', 'Sports', 'Lifestyle', 'Food', 'Entertainment', 'Business'];
  
  // Search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setActiveSource('search');
    
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
  
  // Filter handlers
  const toggleState = (state: string) => {
    setSelectedStates(prev => prev.includes(state) ? prev.filter(s => s !== state) : [...prev, state]);
  };
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
  };
  
  const handleFilter = () => {
    setActiveSource('filters');
    let filtered = publishers;
    
    if (selectedStates.length > 0) {
      filtered = filtered.filter(pub => {
        const statePart = pub.location.split(', ')[1];
        return selectedStates.includes(statePart);
      });
    }
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(pub => pub.categories.some(cat => selectedCategories.includes(cat)));
    }
    
    setFilteredPublishers(filtered);
    setShowFilters(false);
  };
  
  const clearFilters = () => {
    setSelectedStates([]);
    setSelectedCategories([]);
    setFilteredPublishers(publishers);
  };
  
  // Publisher detail handlers
  const handlePublisherSelect = (publisher: Publisher) => {
    setSelectedPublisher(publisher);
  };
  
  const handleCloseDetail = () => {
    setSelectedPublisher(null);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Collection handler
  const handleExploreCollection = (collection: PublisherCollection) => {
    setActiveSource('collection');
    setSelectedCollection(collection);
    
    // In a real app, you would filter publishers based on the collection
    // For now, we'll just simulate it with a basic filter
    const collectionPublishers = publishers.filter(
      (_, index) => collection.publishers.includes(_.id)
    );
    
    setFilteredPublishers(collectionPublishers);
  };
  
  // Active browsing tab name
  const getActiveBrowseMethod = () => {
    if (activeSource === 'collection' && selectedCollection) {
      return selectedCollection.name;
    } else if (activeSource === 'filters' && (selectedStates.length > 0 || selectedCategories.length > 0)) {
      return 'Filtered Results';
    } else if (activeSource === 'search' && searchQuery) {
      return `Search: "${searchQuery}"`;
    }
    return 'All Publishers';
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Top search and filters bar */}
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
        
        <button 
          onClick={toggleFilters} 
          className={`p-2 rounded-lg flex items-center gap-1 ${showFilters ? 'bg-empowerlocal-blue text-white' : 'hover:bg-gray-100'}`}
        >
          <Filter className="h-4 w-4" />
          <span className="text-sm">Filters</span>
        </button>
        
        <div className="flex bg-gray-100 rounded-lg">
          <button
            onClick={() => setResultsDisplayMode('list')}
            className={`p-2 flex items-center gap-1 ${resultsDisplayMode === 'list' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'} rounded-l-lg`}
          >
            <List className="h-4 w-4" />
            <span className="text-sm">List</span>
          </button>
          <button
            onClick={() => setResultsDisplayMode('map')}
            className={`p-2 flex items-center gap-1 ${resultsDisplayMode === 'map' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'} rounded-r-lg`}
          >
            <Map className="h-4 w-4" />
            <span className="text-sm">Map</span>
          </button>
        </div>
      </div>
      
      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-empowerlocal-navy">Filters</h3>
            </div>
            
            <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700">
              Clear All
            </button>
          </div>
          
          {(selectedStates.length > 0 || selectedCategories.length > 0) && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Applied Filters</h4>
              <div className="flex flex-wrap gap-2">
                {selectedStates.map(state => (
                  <div key={state} className="px-2 py-1 bg-blue-50 text-empowerlocal-blue rounded-full text-xs flex items-center gap-1">
                    {state}
                    <button onClick={() => toggleState(state)}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                {selectedCategories.map(category => (
                  <div key={category} className="px-2 py-1 bg-green-50 text-empowerlocal-green rounded-full text-xs flex items-center gap-1">
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
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Location</h4>
              
              <div className="space-y-2">
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
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Content Categories</h4>
              
              <div className="space-y-2">
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
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Audience Size</h4>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="audience" className="text-empowerlocal-blue focus:ring-empowerlocal-blue" />
                  <span className="text-sm">Small (Under 10k)</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="audience" className="text-empowerlocal-blue focus:ring-empowerlocal-blue" />
                  <span className="text-sm">Medium (10k-50k)</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="audience" className="text-empowerlocal-blue focus:ring-empowerlocal-blue" />
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
      
      {/* Collections */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <PublisherCollections 
          collections={mockCollections} 
          onExploreCollection={handleExploreCollection} 
        />
      </div>
      
      {/* Results area with active tab title */}
      <div className="p-4 bg-white border-b border-gray-200">
        <h2 className="text-lg font-medium text-empowerlocal-navy">
          {getActiveBrowseMethod()}
        </h2>
      </div>
      
      {/* Results display - Map or List */}
      <div className="flex-1 flex flex-col">
        {resultsDisplayMode === 'list' ? (
          <div className="flex-1">
            <PublisherResults 
              publishers={filteredPublishers} 
              viewMode={viewMode} 
              setViewMode={setViewMode} 
              onPublisherSelect={handlePublisherSelect} 
            />
          </div>
        ) : (
          <div className="flex-1">
            <MapView 
              publishers={filteredPublishers} 
              selectedPublisher={selectedPublisher} 
              onPublisherSelect={handlePublisherSelect} 
            />
          </div>
        )}
      </div>
      
      {/* Detail view overlay */}
      {selectedPublisher && (
        <PublisherDetail publisher={selectedPublisher} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default NetworkNavigatorInterface;
