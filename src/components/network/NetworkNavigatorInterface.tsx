import React, { useState } from 'react';
import MapView from './MapView';
import FilterSidebar from './FilterSidebar';
import PublisherResults from './PublisherResults';
import PublisherDetail from './PublisherDetail';
import PublisherCollections from './PublisherCollections';
import SeasonalCalendar from './SeasonalCalendar';
import { Publisher, PublisherCollection, ViewMode } from './types';
import { ChevronLeft, Search, Map, Calendar } from 'lucide-react';
import { mockPublishers } from './mockData';
import { mockCollections, mockSeasonalEvents, eventCategories, eventRegions } from './mockCollectionsData';

const NetworkNavigatorInterface: React.FC = () => {
  const [publishers] = useState<Publisher[]>(mockPublishers);
  const [filteredPublishers, setFilteredPublishers] = useState<Publisher[]>(mockPublishers);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<PublisherCollection | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [displayMode, setDisplayMode] = useState<ViewMode>('map');

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

  const handleFilter = (filters: any) => {
    console.log("Applied filters:", filters);
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
        <button 
          onClick={toggleFilters}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ChevronLeft className={`h-5 w-5 text-gray-500 transition-transform ${!showFilters ? 'rotate-180' : ''}`} />
        </button>
        
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
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {showFilters && (
          <FilterSidebar onApplyFilters={handleFilter} />
        )}
        
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
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
    </div>
  );
};

export default NetworkNavigatorInterface;
