
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image, Newspaper, ExternalLink } from 'lucide-react';
import { Publisher } from '../types';

interface ContentPreviewGalleryProps {
  publisher: Publisher;
}

const ContentPreviewGallery: React.FC<ContentPreviewGalleryProps> = ({ publisher }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Sample content items - in a real implementation, these would come from the publisher data
  const contentItems = [
    {
      id: 1,
      type: 'article',
      title: 'Local Business Spotlight',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&auto=format&fit=crop',
      description: 'Featured article on small businesses in the community.'
    },
    {
      id: 2,
      type: 'ad',
      title: 'Premium Sidebar Ad',
      image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&auto=format&fit=crop',
      description: 'High-visibility placement with strong engagement rates.'
    },
    {
      id: 3,
      type: 'newsletter',
      title: 'Weekly Newsletter',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop',
      description: 'Sent to 25,000+ subscribers every Thursday.'
    },
  ];
  
  const goToPrevious = () => {
    setActiveIndex(prev => (prev === 0 ? contentItems.length - 1 : prev - 1));
  };
  
  const goToNext = () => {
    setActiveIndex(prev => (prev === contentItems.length - 1 ? 0 : prev + 1));
  };
  
  const currentItem = contentItems[activeIndex];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-500">Content & Ad Previews</h4>
        <div className="flex items-center gap-1">
          <button 
            onClick={goToPrevious}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <span className="text-xs text-gray-500">{activeIndex + 1} / {contentItems.length}</span>
          <button 
            onClick={goToNext}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 rounded-md text-xs font-medium flex items-center gap-1.5 shadow-sm">
          {currentItem.type === 'article' ? (
            <>
              <Newspaper className="h-3.5 w-3.5 text-gray-600" />
              Article Example
            </>
          ) : currentItem.type === 'ad' ? (
            <>
              <Image className="h-3.5 w-3.5 text-gray-600" />
              Ad Placement
            </>
          ) : (
            <>
              <Newspaper className="h-3.5 w-3.5 text-gray-600" />
              Newsletter
            </>
          )}
        </div>
        
        <img 
          src={currentItem.image} 
          alt={currentItem.title}
          className="w-full h-64 object-cover"
        />
        
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h5 className="font-medium text-gray-800">{currentItem.title}</h5>
            <a href="#" className="text-empowerlocal-blue text-sm flex items-center gap-1 hover:underline">
              <span>View</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <p className="mt-1 text-sm text-gray-600">{currentItem.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ContentPreviewGallery;
