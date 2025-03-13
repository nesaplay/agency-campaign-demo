import React, { useState } from 'react';
import PublisherDetail from './PublisherDetail';
import PublisherCollections from './PublisherCollections';
import { Publisher, PublisherCollection } from './types';
import { mockPublishers } from './mockData';
import { mockCollections } from './mockCollectionsData';
import FilterPanel from './FilterPanel';
import ResultsHeader from './ResultsHeader';
import ResultsDisplay from './ResultsDisplay';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ListPlus, 
  Search, 
  PlusCircle,
  Check
} from 'lucide-react';
import { mockLists } from '../lists/mockListsData';
import { PublisherList } from '../lists/types';
import SaveToListModal from '../lists/save-to-list-modal';

const NetworkNavigatorInterface: React.FC = () => {
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
  
  return (
    <div className="flex flex-col">
      {/* Filter panel as modal/dialog */}
      {showFilters && (
        <>
          {/* Semi-transparent overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowFilters(false)}
          ></div>
          
          {/* Central filter dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <FilterPanel 
                selectedStates={selectedStates}
                toggleState={toggleState}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                handleFilter={handleFilter}
                clearFilters={clearFilters}
                states={states}
                categories={categories}
                closeFilters={() => setShowFilters(false)}
              />
            </div>
          </div>
        </>
      )}
      
      {/* Save to List Modal */}
      {showSaveToListModal && (
        <SaveToListModal
          onClose={() => setShowSaveToListModal(false)}
          onSave={handleAddToList}
          publisherIds={publisherToSave ? [publisherToSave.id] : selectedPublishers}
          lists={lists}
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
      
      {/* Selected publishers action bar */}
      {selectedPublishers.length > 0 && (
        <div className="bg-empowerlocal-blue text-white py-2 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>{selectedPublishers.length} publishers selected</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              className="flex items-center gap-2 px-3 py-1.5 bg-white text-empowerlocal-blue rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              onClick={() => setShowSaveToListModal(true)}
            >
              <ListPlus className="h-4 w-4" />
              Add to List
            </button>
            <button 
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              onClick={() => setSelectedPublishers([])}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
      
      {/* Results display - Map or List */}
      <div className="flex-1">
        <ResultsDisplay 
          resultsDisplayMode={resultsDisplayMode}
          filteredPublishers={filteredPublishers}
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedPublisher={selectedPublisher}
          onPublisherSelect={handlePublisherSelect}
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          publisherCount={filteredPublishers.length}
          showFilters={showFilters}
          toggleFilters={toggleFilters}
          setResultsDisplayMode={setResultsDisplayMode}
          // New props for list functionality
          togglePublisherSelection={togglePublisherSelection}
          selectedPublishers={selectedPublishers}
          handleSaveToList={handleSaveToList}
          getPublisherLists={getPublisherLists}
        />
      </div>
      
      {/* Publisher Detail Modal */}
      {selectedPublisher && (
        <PublisherDetail publisher={selectedPublisher} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default NetworkNavigatorInterface;
