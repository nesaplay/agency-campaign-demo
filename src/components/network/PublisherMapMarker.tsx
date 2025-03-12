
import React from 'react';
import { MapPin } from 'lucide-react';
import { Publisher } from './types';

interface PublisherMapMarkerProps {
  publisher: Publisher;
  isSelected: boolean;
  onClick: () => void;
}

const PublisherMapMarker: React.FC<PublisherMapMarkerProps> = ({ publisher, isSelected, onClick }) => {
  const size = publisher.audienceSize > 50000 ? 'large' : 
               publisher.audienceSize > 20000 ? 'medium' : 'small';
  
  return (
    <div 
      className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
      style={{ 
        left: `${publisher.longitude}%`, 
        top: `${publisher.latitude}%` 
      }}
      onClick={onClick}
    >
      <div className={`
        relative
        ${isSelected ? 'scale-125 z-10' : ''}
      `}>
        <div className={`
          flex items-center justify-center rounded-full bg-empowerlocal-blue text-white
          ${size === 'large' ? 'h-8 w-8' : size === 'medium' ? 'h-6 w-6' : 'h-4 w-4'}
          ${isSelected ? 'ring-4 ring-blue-200' : ''}
        `}>
          <MapPin className={`
            ${size === 'large' ? 'h-5 w-5' : size === 'medium' ? 'h-4 w-4' : 'h-3 w-3'}
          `} />
        </div>
        
        {isSelected && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap">
            {publisher.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublisherMapMarker;
