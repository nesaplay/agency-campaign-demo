
import React, { useState, useEffect, useRef } from 'react';
import { useNetworkNavigator } from '../hooks/useNetworkNavigator';
import NavigatorTabs from './NavigatorTabs';
import PublisherDetailModal from './PublisherDetailModal';
import SaveToListModalWrapper from './SaveToListModalWrapper';
import FilterModalWrapper from './FilterModalWrapper';
import { Publisher as NetworkPublisher } from '../types';
import { Publisher as ConversationPublisher } from '@/components/conversations/types';
import { adaptConversationPublisher } from './utils/publisherAdapter';

const NetworkNavigatorInterface: React.FC = () => {
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  
  const {
    // Data and UI state
    filteredPublishers,
    selectedPublisher,
    selectedPublishers,
    lists,
    showFilters,
    searchQuery,
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
    const networkPublisher = adaptConversationPublisher(publisher);
    // Then pass it to the regular publisher select handler
    handlePublisherSelect(networkPublisher);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filter modal and Save to List Modal */}
      <FilterModalWrapper
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
      
      <SaveToListModalWrapper
        showSaveToListModal={showSaveToListModal}
        setShowSaveToListModal={setShowSaveToListModal}
        handleAddToList={handleAddToList}
        publisherToSave={publisherToSave}
        selectedPublishers={selectedPublishers}
        lists={lists}
      />
      
      {/* Main navigation tabs */}
      <NavigatorTabs
        ref={tabsRef}
        isTabsSticky={isTabsSticky}
        onConversationPublisherSelect={handleConversationPublisherSelect}
        filteredPublishers={filteredPublishers}
        selectedPublisher={selectedPublisher}
        selectedPublishers={selectedPublishers}
        getActiveBrowseMethod={getActiveBrowseMethod}
        resultsDisplayMode={resultsDisplayMode}
        setResultsDisplayMode={setResultsDisplayMode}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        showFilters={showFilters}
        toggleFilters={toggleFilters}
        togglePublisherSelection={togglePublisherSelection}
        handleSaveToList={handleSaveToList}
        getPublisherLists={getPublisherLists}
        handlePublisherSelect={handlePublisherSelect}
        selectedStates={selectedStates}
        selectedCategories={selectedCategories}
        toggleState={toggleState}
        toggleCategory={toggleCategory}
        handleExploreCollection={handleExploreCollection}
        setShowSaveToListModal={setShowSaveToListModal}
        setSelectedPublishers={setSelectedPublishers}
      />
      
      {/* Publisher Detail Modal */}
      <PublisherDetailModal 
        selectedPublisher={selectedPublisher}
        onClose={handleCloseDetail}
      />
    </div>
  );
};

export default NetworkNavigatorInterface;
