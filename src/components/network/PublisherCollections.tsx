
import React from 'react';
import { ChevronRight, Heart, Flag, Utensils, TreeDeciduous, Map, Users, TrendingUp } from 'lucide-react';
import { PublisherCollection } from './types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PublisherCollectionsProps {
  collections: PublisherCollection[];
  onExploreCollection: (collection: PublisherCollection) => void;
  displayMode?: 'horizontal' | 'grid'; // New prop to control display mode
}

const PublisherCollections: React.FC<PublisherCollectionsProps> = ({ 
  collections, 
  onExploreCollection,
  displayMode = 'horizontal' // Default to horizontal for backward compatibility
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
      return <TreeDeciduous className="h-6 w-6 text-green-500" />;
    } else {
      return <Map className="h-6 w-6 text-blue-500" />;
    }
  };

  // Horizontal scrolling view (original)
  if (displayMode === 'horizontal') {
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
                <div className="relative h-32 bg-gray-100 rounded-t-lg overflow-hidden">
                  <img 
                    src={collection.coverageMapThumbnail} 
                    alt={`${collection.name} collection`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-60"></div>
                  <div className="absolute bottom-0 left-0 p-3 text-white">
                    <div className="font-medium">{collection.name}</div>
                    <div className="text-xs">{collection.publisherCount} publishers</div>
                  </div>
                  <div className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md">
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
  }

  // Grid view for the Collections tab
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {collections.map((collection) => (
        <Card key={collection.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative h-48">
            <img 
              src={collection.coverageMapThumbnail} 
              alt={`${collection.name} collection`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-70"></div>
            <div className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md">
              {getCollectionIcon(collection.name)}
            </div>
          </div>
          
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{collection.name}</CardTitle>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" /> 
                <span>{collection.publisherCount} publishers</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" /> 
                <span>High engagement</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pb-2">
            <CardDescription className="line-clamp-2">
              {collection.description}
            </CardDescription>
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={() => onExploreCollection(collection)} 
              variant="secondary" 
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700" 
              size="sm"
            >
              Explore Collection
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PublisherCollections;
