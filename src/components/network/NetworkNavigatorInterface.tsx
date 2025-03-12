
import React, { useState } from 'react';
import MapView from './MapView';
import FilterSidebar from './FilterSidebar';
import PublisherResults from './PublisherResults';
import PublisherDetail from './PublisherDetail';
import { Publisher } from './types';
import { ChevronLeft, Search } from 'lucide-react';
import { mockPublishers } from './mockData';

const NetworkNavigatorInterface: React.FC = () => {
  const [publishers] = useState<Publisher[]>(mockPublishers);
  const [filteredPublishers, setFilteredPublishers] = useState<Publisher[]>(mockPublishers);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    // This would be more sophisticated in a real app
    console.log("Applied filters:", filters);
    // For demo, just use the original data
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

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-4">
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
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Filter Sidebar */}
        {showFilters && (
          <FilterSidebar onApplyFilters={handleFilter} />
        )}
        
        {/* Map and Results */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Map View (60% height) */}
          <div className="h-3/5 border-b border-gray-200">
            <MapView 
              publishers={filteredPublishers} 
              onPublisherSelect={handlePublisherSelect}
              selectedPublisher={selectedPublisher}
            />
          </div>
          
          {/* Results View (40% height) */}
          <div className="h-2/5 overflow-hidden">
            <PublisherResults 
              publishers={filteredPublishers}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onPublisherSelect={handlePublisherSelect}
            />
          </div>
        </div>
        
        {/* Publisher Detail Slide-in */}
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
