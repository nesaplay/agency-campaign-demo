
import { useState } from 'react';
import { Publisher, PublisherCollection } from '../types';
import { mockPublishers } from '../mockData';
import { mockCollections } from '../mockCollectionsData';
import { PublisherList } from '@/components/lists/types';
import { mockLists } from '@/components/lists/mockListsData';

export const useNetworkNavigator = () => {
  // Data state
  const [publishers] = useState<Publisher[]>(mockPublishers);
  const [filteredPublishers, setFilteredPublishers] = useState<Publisher[]>(mockPublishers);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<PublisherCollection | null>(null);
  const [lists] = useState<PublisherList[]>(mockLists);
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [resultsDisplayMode, setResultsDisplayMode] = useState<'list' | 'map'>('list');
  const [showSaveToListModal, setShowSaveToListModal] = useState(false);
  const [publisherToSave, setPublisherToSave] = useState<Publisher | null>(null);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  
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
    
    const collectionPublishers = publishers.filter(
      pub => collection.publishers.includes(pub.id)
    );
    
    setFilteredPublishers(collectionPublishers);
  };
  
  // List handlers
  const handleSaveToList = (publisher: Publisher) => {
    setPublisherToSave(publisher);
    setShowSaveToListModal(true);
  };
  
  const handleAddToList = (listId: string, publisherIds: string[]) => {
    console.log(`Adding publishers ${publisherIds.join(', ')} to list ${listId}`);
    // In a real app, this would update the list in the database
    
    // Clear selection after adding
    setSelectedPublishers([]);
    setShowSaveToListModal(false);
  };
  
  const togglePublisherSelection = (publisherId: string) => {
    setSelectedPublishers(prev => 
      prev.includes(publisherId) 
        ? prev.filter(id => id !== publisherId) 
        : [...prev, publisherId]
    );
  };
  
  // Check if a publisher is in any list
  const getPublisherLists = (publisherId: string): PublisherList[] => {
    return lists.filter(list => list.publishers.includes(publisherId));
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

  return {
    // Data
    publishers,
    filteredPublishers,
    selectedPublisher,
    selectedCollection,
    lists,
    
    // UI state
    showFilters,
    searchQuery,
    viewMode,
    resultsDisplayMode,
    showSaveToListModal,
    publisherToSave,
    selectedPublishers,
    
    // Filter state
    selectedStates,
    selectedCategories,
    activeSource,
    states,
    categories,
    
    // Handlers
    handleSearch,
    toggleState,
    toggleCategory,
    handleFilter,
    clearFilters,
    handlePublisherSelect,
    handleCloseDetail,
    toggleFilters,
    handleExploreCollection,
    handleSaveToList,
    handleAddToList,
    togglePublisherSelection,
    getPublisherLists,
    getActiveBrowseMethod,
    setViewMode,
    setResultsDisplayMode,
    setShowSaveToListModal,
    setSelectedPublishers
  };
};
