
import React from 'react';
import { ChevronRight, Heart, Flag, Utensils, Tree, Map } from 'lucide-react';
import { PublisherCollection } from './types';

interface PublisherCollectionsProps {
  collections: PublisherCollection[];
  onExploreCollection: (collection: PublisherCollection) => void;
}

const PublisherCollections: React.FC<PublisherCollectionsProps> = ({ 
  collections, 
  onExploreCollection 
}) => {
  // Function to get the appropriate icon based on collection name
  const getCollectionIcon = (name: string) => {
    if (name.includes('Family') || name.includes('Female')) {
      return <Heart className="h-6 w-6 text-pink-500" />;
    } else if (name.includes('SEC') || name.includes('Sports')) {
      return <Flag className="h-6 w-6 text-orange-500" />;
    } else if (name.includes('Foodie') || name.includes('Food')) {
      return <Utensils className="h-6 w-6 text-yellow-500" />;
    } else if (name.includes('Outdoor')) {
      return <Tree className="h-6 w-6 text-green-500" />;
    } else {
      return <Map className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-empowerlocal-navy">Featured Collections</h3>
        <button className="text-sm text-empowerlocal-blue hover:underline flex items-center">
          View All Collections
          <ChevronRight className="ml-1 h-4 w-4" />
        </button>
      </div>
      
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
          {collections.map((collection) => (
            <div 
              key={collection.id}
              className="w-64 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onExploreCollection(collection)}
            >
              <div className="relative h-28 bg-gray-100 rounded-t-lg overflow-hidden">
                <img 
                  src={collection.coverageMapThumbnail} 
                  alt={`${collection.name} coverage map`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800 opacity-60"></div>
                <div className="absolute bottom-0 left-0 p-3 text-white">
                  <div className="font-medium">{collection.name}</div>
                  <div className="text-xs">{collection.publisherCount} publishers</div>
                </div>
                <div className="absolute top-3 right-3 p-2 bg-white rounded-full">
                  {getCollectionIcon(collection.name)}
                </div>
              </div>
              
              <div className="p-3">
                <p className="text-sm text-gray-600 mb-3">
                  {collection.description}
                </p>
                <button 
                  className="w-full py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 flex items-center justify-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExploreCollection(collection);
                  }}
                >
                  Explore Collection
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublisherCollections;
