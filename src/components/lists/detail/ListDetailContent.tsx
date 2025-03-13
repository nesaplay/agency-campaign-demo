
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, ListIcon, MapPin, Users } from 'lucide-react';
import { Publisher } from '@/components/network/types';
import PublisherCard from '@/components/network/PublisherCard';
import PublisherListItem from '@/components/network/PublisherListItem';

interface ListDetailContentProps {
  publishers: Publisher[];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  handleViewPublisherDetails: (publisher: Publisher) => void;
  handleRemovePublisher: (publisherId: string) => void;
}

const ListDetailContent: React.FC<ListDetailContentProps> = ({
  publishers,
  viewMode,
  setViewMode,
  handleViewPublisherDetails,
  handleRemovePublisher
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between sticky top-0 z-10">
        <h2 className="font-medium text-empowerlocal-navy">Publishers in this list</h2>
        
        <div className="flex bg-gray-100 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            <ListIcon className="h-4 w-4" />
          </button>
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

