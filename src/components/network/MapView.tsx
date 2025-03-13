
import React from 'react';
import { Publisher } from './types';
import { retailLocations } from './mockData';
import MapBackground from './MapBackground';
import MapControls from './MapControls';
import MapLegend from './MapLegend';
import PublisherMapMarker from './PublisherMapMarker';
import RetailMapMarker from './RetailMapMarker';

interface MapViewProps {
  publishers: Publisher[];
  selectedPublisher: Publisher | null;
  onPublisherSelect: (publisher: Publisher) => void;
}

const MapView: React.FC<MapViewProps> = ({ 
  publishers, 
  selectedPublisher, 
  onPublisherSelect 
}) => {
  return (
    <div className="relative h-[calc(100vh-300px)] bg-[#f2f7fd] overflow-auto">
      {/* Map Placeholder */}
      <div className="absolute inset-0 z-0">
        <MapBackground />
        
        {/* Publisher Markers */}
        {publishers.map(publisher => (
          <PublisherMapMarker 
            key={publisher.id}
            publisher={publisher}
            isSelected={selectedPublisher?.id === publisher.id}
            onClick={() => onPublisherSelect(publisher)}
          />
        ))}
        
        {/* Retail Location Markers */}
        {retailLocations.map(location => (
          <RetailMapMarker key={location.id} location={location} />
        ))}
      </div>
      
      {/* Map Controls */}
      <MapControls />
      
      {/* Map Legend */}
      <MapLegend />
    </div>
  );
};

export default MapView;
