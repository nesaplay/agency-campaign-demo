import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, ListIcon, MapPin, Users, Search } from 'lucide-react';
import { Publisher } from '@/components/network/types';
import PublisherCard from '@/components/network/PublisherCard';
import PublisherListItem from '@/components/network/PublisherListItem';
import { Input } from '@/components/ui/input';

interface ListDetailContentProps {
  publishers: Publisher[];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  handleViewPublisherDetails: (publisher: Publisher) => void;
  handleRemovePublisher: (publisherId: string) => void;
  searchQuery: string;
  searchResults: Publisher[];
  showSearchResults: boolean;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddPublisherToList: (publisher: Publisher) => void;
  setShowSearchResults: (show: boolean) => void;
  handleSearchFocus: () => void;
}

const ListDetailContent: React.FC<ListDetailContentProps> = ({
  publishers,
  viewMode,
  setViewMode,
  handleViewPublisherDetails,
  handleRemovePublisher,
  searchQuery,
  searchResults,
  showSearchResults,
  handleSearchChange,
  handleAddPublisherToList,
  setShowSearchResults,
  handleSearchFocus
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between sticky top-0 z-[99999] gap-4">
        <h2 className="font-medium text-empowerlocal-navy whitespace-nowrap">Publishers ({publishers.length})</h2>
        
        <div className="flex items-center gap-4 flex-grow justify-end">
          <div className="relative flex-grow max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input 
              type="text"
              placeholder="Add publishers..."
              className="pl-9 pr-3 py-2 h-9 text-sm w-full"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 150)}
            />
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-[99999] max-h-60 overflow-y-auto">
                {searchResults.map(pub => (
                  <button 
                    key={pub.id}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => handleAddPublisherToList(pub)}
                  >
                    <img src={pub.logo} alt={pub.name} className="h-6 w-6 object-contain flex-shrink-0 rounded-sm bg-gray-100"/>
                    <span className="truncate flex-1">{pub.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex bg-gray-100 rounded-lg p-0.5 flex-shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
              title="List View"
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {publishers.length > 0 ? (
        <div className="p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {publishers.map(publisher => (
                <div key={publisher.id}>
                  <PublisherCard 
                    publisher={publisher}
                    onClick={() => handleViewPublisherDetails(publisher)}
                    onDelete={() => handleRemovePublisher(publisher.id)}
                    onViewDetails={() => handleViewPublisherDetails(publisher)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {publishers.map(publisher => (
                <div key={publisher.id}>
                  <PublisherListItem 
                    publisher={publisher}
                    onClick={() => handleViewPublisherDetails(publisher)}
                    onDelete={() => handleRemovePublisher(publisher.id)}
                    onViewDetails={() => handleViewPublisherDetails(publisher)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <EmptyListState navigate={navigate} />
      )}
    </div>
  );
};

interface EmptyListStateProps {
  navigate: (path: string) => void;
}

const EmptyListState: React.FC<EmptyListStateProps> = ({ navigate }) => {
  return (
    <div className="h-64 flex flex-col items-center justify-center text-gray-500 p-6">
      <div className="bg-gray-100 p-6 rounded-full">
        <Users className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="mt-4 text-lg font-medium">No publishers in this list</h3>
      <p className="mt-2 text-sm">Browse the Network Navigator to add publishers</p>
      <button 
        className="mt-6 flex items-center gap-2 bg-empowerlocal-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-empowerlocal-navy transition-colors"
        onClick={() => navigate('/network-navigator')}
      >
        <MapPin className="h-4 w-4" />
        Explore Media
      </button>
    </div>
  );
};

export default ListDetailContent;

