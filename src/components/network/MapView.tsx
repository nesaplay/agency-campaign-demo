
import React from 'react';
import { MapPin, Store } from 'lucide-react';
import { Publisher } from './types';
import { retailLocations } from './mockData';

interface MapViewProps {
  publishers: Publisher[];
  selectedPublisher: Publisher | null;
  onPublisherSelect: (publisher: Publisher) => void;
}

const MapView: React.FC<MapViewProps> = ({ publishers, selectedPublisher, onPublisherSelect }) => {
  // In a real app, this would use an actual map library like MapBox or Google Maps
  
  return (
    <div className="relative h-full bg-[#f2f7fd] overflow-hidden">
      {/* Map Placeholder */}
      <div className="absolute inset-0">
        {/* Background pattern for "map" */}
        <div className="absolute w-full h-full opacity-20"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
          }}
        ></div>
        
        {/* Map Outline */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
          {/* Simplified US West Coast Outline */}
          <path 
            d="M100,200 L150,150 L200,100 L250,80 L300,100 L320,150 L350,200 L370,250 L400,300 L450,350 L500,370 L550,350 L580,300 L600,250 L580,200 L550,150 L500,120 L450,100 L400,120 L350,150 L320,200 L300,250 L250,300 L200,320 L150,300 L120,250 Z" 
            fill="none" 
            stroke="#c1d9f0" 
            strokeWidth="2"
          />
          
          {/* State lines */}
          <path 
            d="M200,100 L400,300 M300,100 L500,350" 
            stroke="#c1d9f0" 
            strokeWidth="1" 
            strokeDasharray="5,5"
          />
        </svg>
        
        {/* Publisher Markers */}
        {publishers.map(publisher => {
          // Calculate position based on latitude and longitude
          // In a real app, these would be mapped to actual coordinates
          const x = `${publisher.longitude}%`;
          const y = `${publisher.latitude}%`;
          
          const isSelected = selectedPublisher?.id === publisher.id;
          const size = publisher.audienceSize > 50000 ? 'large' : 
                     publisher.audienceSize > 20000 ? 'medium' : 'small';
          
          return (
            <div 
              key={publisher.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
              style={{ left: x, top: y }}
              onClick={() => onPublisherSelect(publisher)}
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
        })}
        
        {/* Retail Location Markers */}
        {retailLocations.map(location => {
          // Calculate position based on latitude and longitude
          const x = `${location.longitude}%`;
          const y = `${location.latitude}%`;
          
          return (
            <div 
              key={location.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: x, top: y }}
            >
              <div className="flex items-center justify-center h-5 w-5 rounded-full bg-pink-400 text-white">
                <Store className="h-3 w-3" />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md flex flex-col">
        <button className="p-2 hover:bg-gray-100 rounded-t-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>
        </button>
        <button className="p-2 hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-b-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 12-7 7-7-7"></path><path d="M12 5v14"></path></svg>
        </button>
      </div>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md text-sm">
        <h4 className="font-medium text-empowerlocal-navy mb-2">Map Legend</h4>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-4 w-4 rounded-full bg-empowerlocal-blue flex items-center justify-center">
            <MapPin className="h-3 w-3 text-white" />
          </div>
          <span>Publisher Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-pink-400 flex items-center justify-center">
            <Store className="h-3 w-3 text-white" />
          </div>
          <span>Dr. Bombay Retail Location</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
