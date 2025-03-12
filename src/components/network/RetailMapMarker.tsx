
import React from 'react';
import { Store } from 'lucide-react';
import { RetailLocation } from './types';

interface RetailMapMarkerProps {
  location: RetailLocation;
}

const RetailMapMarker: React.FC<RetailMapMarkerProps> = ({ location }) => {
  return (
    <div 
      key={location.id}
      className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
      style={{ 
        left: `${location.longitude}%`, 
        top: `${location.latitude}%` 
      }}
    >
      <div className="flex items-center justify-center h-5 w-5 rounded-full bg-pink-400 text-white">
        <Store className="h-3 w-3" />
      </div>
    </div>
  );
};

export default RetailMapMarker;
