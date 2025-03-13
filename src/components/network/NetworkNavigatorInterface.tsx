
import React, { useState } from 'react';
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
import { ListFilter, Grid3X3 } from 'lucide-react';

const NetworkNavigatorInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'publishers' | 'collections'>('publishers');
  
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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs 
            defaultValue="publishers" 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as 'publishers' | 'collections')}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-2 mt-4 bg-gray-100">
              <TabsTrigger value="publishers" className="flex items-center gap-2">
                <ListFilter className="h-4 w-4" />
                <span>All Publishers</span>
              </TabsTrigger>
              <TabsTrigger value="collections" className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                <span>Curated Collections</span>
              </TabsTrigger>
            </TabsList>
            
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
