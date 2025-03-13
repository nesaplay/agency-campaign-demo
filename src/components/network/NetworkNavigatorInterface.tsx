
import React from 'react';
import PublisherDetail from './PublisherDetail';
import PublisherCollections from './PublisherCollections';
import FilterModal from './FilterModal';
import ResultsHeader from './ResultsHeader';
import ResultsDisplay from './ResultsDisplay';
import SaveToListModal from '../lists/save-to-list-modal';
import SelectedPublishersBar from './SelectedPublishersBar';
import { useNetworkNavigator } from './hooks/useNetworkNavigator';
import { mockCollections } from './mockCollectionsData';

const NetworkNavigatorInterface: React.FC = () => {
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
    <div className="flex flex-col">
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
      
      {/* Publisher Detail Modal */}
      {selectedPublisher && (
        <PublisherDetail publisher={selectedPublisher} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default NetworkNavigatorInterface;
