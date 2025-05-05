
import React, { useState, useEffect, useRef } from 'react';
import { useNetworkNavigator } from '../hooks/useNetworkNavigator';
import NavigatorTabs from './NavigatorTabs';
import PublisherDetailModal from './PublisherDetailModal';
import SaveToListModalWrapper from './SaveToListModalWrapper';
import FilterModalWrapper from './FilterModalWrapper';
import { Publisher } from '../types';

const NetworkNavigatorInterface: React.FC = () => {
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  
  const {
    filteredPublishers,
    selectedPublisher,
    selectedPublishers,
    lists,
    showFilters,
    searchQuery,
    resultsDisplayMode,
    showSaveToListModal,
    publisherToSave,
    
    selectedStates,
    selectedCategories,
    states,
    categories,
    
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

  const handleConversationPublisherSelect = (publisher: Publisher) => {
    handlePublisherSelect(publisher);
  };

  console.log("NetworkNavigatorInterface rendering", { filteredPublishers: filteredPublishers.length });

  return (
    <div className="flex flex-col min-h-full h-full">
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
      
      <PublisherDetailModal 
        selectedPublisher={selectedPublisher}
        onClose={handleCloseDetail}
      />
    </div>
  );
};

export default NetworkNavigatorInterface;
