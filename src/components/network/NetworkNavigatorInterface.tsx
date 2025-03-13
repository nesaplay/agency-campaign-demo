
import React, { useState, useEffect, useRef } from 'react';
import PublisherDetail from './PublisherDetail';
import PublisherCollections from './PublisherCollections';
import FilterModal from './FilterModal';
import ResultsHeader from './ResultsHeader';
import ResultsDisplay from './ResultsDisplay';
import SaveToListModal from '../lists/save-to-list-modal';
import SelectedPublishersBar from './SelectedPublishersBar';
import { useNetworkNavigator } from './hooks/useNetworkNavigator';
import { mockCollections } from './mockCollectionsData';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ListFilter, Grid3X3, MessageSquare } from 'lucide-react';
import ConversationInterface from '../conversations/ConversationInterface';
import { Publisher as NetworkPublisher } from './types';
import { Publisher as ConversationPublisher } from '../conversations/types';

// Adapter function to convert between Publisher types
const convertToNetworkPublisher = (publisher: ConversationPublisher): NetworkPublisher => {
  return {
    id: publisher.id,
    name: publisher.name,
    logo: publisher.image,
    location: publisher.location,
    coverage: publisher.location,
    subscribers: publisher.reach,
    engagement: "4.0%", // Default values for required fields
    cpm: "$15",
    categories: ["News"],
    performance: "Good",
    latitude: 0,
    longitude: 0,
    audienceSize: parseInt(publisher.reach.replace(/[^0-9]/g, '')) || 10000
  };
};

const NetworkNavigatorInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lassie' | 'publishers' | 'collections'>('lassie');
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  
  const {
    // Data
    filteredPublishers,
    selectedPublisher,
    selectedPublishers,
    lists,
    
    // UI state
    showFilters,
    searchQuery,
    viewMode,
    resultsDisplayMode,
    showSaveToListModal,
    publisherToSave,
    
    // Filter state
    selectedStates,
    selectedCategories,
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
  } = useNetworkNavigator();
  
  // Set up scroll event listener to detect when tabs should become sticky
  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const tabsPosition = tabsRef.current.getBoundingClientRect().top;
        setIsTabsSticky(tabsPosition <= 0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle publisher selection from conversation interface
  const handleConversationPublisherSelect = (publisher: ConversationPublisher) => {
    // Convert the conversation publisher to a network publisher
    const networkPublisher = convertToNetworkPublisher(publisher);
    // Then pass it to the regular publisher select handler
    handlePublisherSelect(networkPublisher);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filter modal */}
      <FilterModal 
        showFilters={showFilters}
        toggleFilters={toggleFilters}
        selectedStates={selectedStates}
        toggleState={toggleState}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        handleFilter={handleFilter}
        clearFilters={clearFilters}
        states={states}
        categories={categories}
      />
      
      {/* Save to List Modal */}
      {showSaveToListModal && (
        <SaveToListModal
          onClose={() => setShowSaveToListModal(false)}
          onSave={handleAddToList}
          publisherIds={publisherToSave ? [publisherToSave.id] : selectedPublishers}
          lists={lists}
        />
      )}
      
      {/* Main tabs for exploration modes */}
      <div 
        ref={tabsRef} 
        className={`bg-white border-b border-gray-200 ${isTabsSticky ? 'sticky top-0 z-30' : ''}`}
      >
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isTabsSticky ? 'shadow-md' : ''}`}>
          <Tabs 
            defaultValue="lassie" 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as 'lassie' | 'publishers' | 'collections')}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-2 mt-4 bg-gray-100">
              <TabsTrigger value="lassie" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Ask Lassie</span>
              </TabsTrigger>
              <TabsTrigger value="publishers" className="flex items-center gap-2">
                <ListFilter className="h-4 w-4" />
                <span>Explore All</span>
              </TabsTrigger>
              <TabsTrigger value="collections" className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                <span>Curated Collections</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="lassie" className="mt-0">
              <div className="py-4">
                <ConversationInterface 
                  onPublisherSelect={handleConversationPublisherSelect}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="publishers" className="mt-0">
              {/* Results header for publishers tab */}
              <ResultsHeader 
                activeBrowseMethod={getActiveBrowseMethod()} 
                resultsDisplayMode={resultsDisplayMode}
                setResultsDisplayMode={setResultsDisplayMode}
                publisherCount={filteredPublishers.length}
              />
              
              {/* Selected publishers action bar */}
              <SelectedPublishersBar 
                selectedPublishers={selectedPublishers}
                onShowSaveToListModal={() => setShowSaveToListModal(true)} 
                onClearSelection={() => setSelectedPublishers([])}
              />
              
              {/* Results display - Map or List */}
              <div className="flex-1">
                <ResultsDisplay 
                  resultsDisplayMode={resultsDisplayMode}
                  filteredPublishers={filteredPublishers}
                  selectedPublisher={selectedPublisher}
                  onPublisherSelect={handlePublisherSelect}
                  searchQuery={searchQuery}
                  onSearchChange={handleSearch}
                  publisherCount={filteredPublishers.length}
                  showFilters={showFilters}
                  toggleFilters={toggleFilters}
                  setResultsDisplayMode={setResultsDisplayMode}
                  togglePublisherSelection={togglePublisherSelection}
                  selectedPublishers={selectedPublishers}
                  handleSaveToList={handleSaveToList}
                  getPublisherLists={getPublisherLists}
                  selectedStates={selectedStates}
                  selectedCategories={selectedCategories}
                  toggleState={toggleState}
                  toggleCategory={toggleCategory}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="collections" className="mt-0 pb-8">
              <div className="py-4">
                <h2 className="text-xl font-medium text-empowerlocal-navy mb-4">Curated Publisher Collections</h2>
                <p className="text-gray-600 mb-6">
                  Discover groups of publishers organized by audience, content focus, and geographic coverage.
                </p>
                <PublisherCollections 
                  collections={mockCollections} 
                  onExploreCollection={handleExploreCollection}
                  displayMode="grid"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Publisher Detail Modal */}
      {selectedPublisher && (
        <PublisherDetail publisher={selectedPublisher} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default NetworkNavigatorInterface;
