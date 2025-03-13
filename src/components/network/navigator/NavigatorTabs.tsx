
import React, { forwardRef } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ListFilter, Grid3X3, MessageSquare } from 'lucide-react';
import ConversationInterface from '@/components/conversations/interface';
import PublisherCollections from '../PublisherCollections';
import ResultsHeader from '../ResultsHeader';
import SelectedPublishersBar from '../SelectedPublishersBar';
import ResultsDisplay from '../ResultsDisplay';
import { Publisher } from '../types';
import { Publisher as ConversationPublisher } from '@/components/conversations/types';
import { PublisherList } from '@/components/lists/types';
import { mockCollections } from '../mockCollectionsData';

interface NavigatorTabsProps {
  isTabsSticky: boolean;
  onConversationPublisherSelect: (publisher: ConversationPublisher) => void;
  filteredPublishers: Publisher[];
  selectedPublisher: Publisher | null;
  selectedPublishers: string[];
  getActiveBrowseMethod: () => string;
  resultsDisplayMode: 'list' | 'grid' | 'map';
  setResultsDisplayMode: (mode: 'list' | 'grid' | 'map') => void;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showFilters: boolean;
  toggleFilters: () => void;
  togglePublisherSelection: (publisherId: string) => void;
  handleSaveToList: (publisher: Publisher) => void;
  getPublisherLists: (publisherId: string) => PublisherList[];
  handlePublisherSelect: (publisher: Publisher) => void;
  selectedStates: string[];
  selectedCategories: string[];
  toggleState: (state: string) => void;
  toggleCategory: (category: string) => void;
  handleExploreCollection: (collection: any) => void;
  setShowSaveToListModal: (show: boolean) => void;
  setSelectedPublishers: (publishers: string[]) => void;
}

const NavigatorTabs = forwardRef<HTMLDivElement, NavigatorTabsProps>(({
  isTabsSticky,
  onConversationPublisherSelect,
  filteredPublishers,
  selectedPublisher,
  selectedPublishers,
  getActiveBrowseMethod,
  resultsDisplayMode,
  setResultsDisplayMode,
  searchQuery,
  onSearchChange,
  showFilters,
  toggleFilters,
  togglePublisherSelection,
  handleSaveToList,
  getPublisherLists,
  handlePublisherSelect,
  selectedStates,
  selectedCategories,
  toggleState,
  toggleCategory,
  handleExploreCollection,
  setShowSaveToListModal,
  setSelectedPublishers
}, ref) => {
  const [activeTab, setActiveTab] = React.useState<'lassie' | 'publishers' | 'collections'>('lassie');

  return (
    <div 
      ref={ref} 
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
                onPublisherSelect={onConversationPublisherSelect}
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
                onSearchChange={onSearchChange}
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
  );
});

NavigatorTabs.displayName = "NavigatorTabs";

export default NavigatorTabs;
