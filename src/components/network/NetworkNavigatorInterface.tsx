
import React, { useState } from 'react';
import PublisherDetail from './PublisherDetail';
import PublisherCollections from './PublisherCollections';
import { Publisher, PublisherCollection } from './types';
import { mockPublishers } from './mockData';
import { mockCollections } from './mockCollectionsData';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import ResultsHeader from './ResultsHeader';
import ResultsDisplay from './ResultsDisplay';

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
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        publisherCount={filteredPublishers.length}
        showFilters={showFilters}
        toggleFilters={toggleFilters}
        resultsDisplayMode={resultsDisplayMode}
        setResultsDisplayMode={setResultsDisplayMode}
      />
      
      {/* Filter panel */}
      {showFilters && (
        <FilterPanel 
          selectedStates={selectedStates}
          toggleState={toggleState}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          handleFilter={handleFilter}
          clearFilters={clearFilters}
          states={states}
          categories={categories}
        />
      )}
      
      {/* Collections */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <PublisherCollections 
          collections={mockCollections} 
          onExploreCollection={handleExploreCollection} 
        />
      </div>
      
      {/* Results area with active tab title */}
      <ResultsHeader activeBrowseMethod={getActiveBrowseMethod()} />
      
      {/* Results display - Map or List */}
      <ResultsDisplay 
        resultsDisplayMode={resultsDisplayMode}
        filteredPublishers={filteredPublishers}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedPublisher={selectedPublisher}
        onPublisherSelect={handlePublisherSelect}
      />
      
      {/* Detail view overlay */}
      {selectedPublisher && (
        <PublisherDetail publisher={selectedPublisher} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default NetworkNavigatorInterface;
