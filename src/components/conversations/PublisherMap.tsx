
import React, { useState } from 'react';
import { MapPin, Filter, ArrowUpRight } from 'lucide-react';

interface MapMarker {
  id: string;
  name: string;
  position: { top: string; left: string };
  size: 'sm' | 'md' | 'lg';
  color: string;
  count: number;
}

const PublisherMap: React.FC = () => {
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Define map markers
  const markers: MapMarker[] = [
    {
      id: 'la',
      name: 'Los Angeles',
      position: { top: '45%', left: '20%' },
      size: 'lg',
      color: 'text-empowerlocal-blue',
      count: 8
    },
    {
      id: 'phoenix',
      name: 'Phoenix',
      position: { top: '55%', left: '38%' },
      size: 'md',
      color: 'text-empowerlocal-green',
      count: 5
    },
    {
      id: 'sandiego',
      name: 'San Diego',
      position: { top: '58%', left: '22%' },
      size: 'sm',
      color: 'text-purple-500',
      count: 3
    }
  ];
  
  const handleMarkerClick = (id: string) => {
    setActiveMarker(activeMarker === id ? null : id);
  };
  
  const getSizeClass = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'lg': return 'h-8 w-8';
      case 'md': return 'h-7 w-7';
      case 'sm': return 'h-6 w-6';
    }
  };
  
  return (
    <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
      <div className="bg-gray-100 h-64 relative">
        {/* Map controls */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <button 
            className="bg-white p-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter className="h-4 w-4 text-gray-600" />
          </button>
          
          {filterOpen && (
            <div className="absolute top-10 right-0 bg-white rounded-md shadow-md p-3 border border-gray-200 w-48">
              <h4 className="text-xs font-medium text-gray-700 mb-2">Filter Publishers</h4>
              <div className="space-y-2">
                <label className="flex items-center text-sm gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-empowerlocal-blue" />
                  <span>News</span>
                </label>
                <label className="flex items-center text-sm gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-empowerlocal-blue" />
                  <span>Entertainment</span>
                </label>
                <label className="flex items-center text-sm gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-empowerlocal-blue" />
                  <span>Lifestyle</span>
                </label>
              </div>
            </div>
          )}
        </div>
      
        {/* This is a placeholder for the actual map */}
        <div className="absolute inset-0 bg-[#e6f0ff]">
          <div className="absolute w-full h-full opacity-20"
               style={{
                 backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
               }}
          ></div>
          
          {/* Map markers */}
          {markers.map(marker => (
            <div 
              key={marker.id}
              className="absolute cursor-pointer" 
              style={{ top: marker.position.top, left: marker.position.left }}
              onClick={() => handleMarkerClick(marker.id)}
            >
              <div className="relative">
                <MapPin className={`${getSizeClass(marker.size)} ${marker.color} ${activeMarker === marker.id ? 'animate-bounce' : ''}`} />
                
                {(activeMarker === marker.id || marker.size === 'lg') && (
                  <div className={`absolute -top-12 -left-24 bg-white px-3 py-2 rounded-lg shadow-md text-xs w-48 transition-all duration-200 ${activeMarker === marker.id ? 'scale-100 opacity-100' : 'scale-95 opacity-90'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{marker.name}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${marker.color.replace('text-', 'bg-').replace('blue', 'blue/20').replace('green', 'green/20').replace('purple', 'purple/20')} ${marker.color}`}>
                        {marker.count} publishers
                      </span>
                    </div>
                    
                    {activeMarker === marker.id && (
                      <div className="mt-1 flex justify-between items-center">
                        <span className="text-[10px] text-gray-500">Avg. CPM: $12.40</span>
                        <button className="flex items-center gap-0.5 text-[10px] text-empowerlocal-blue">
                          <span>View</span>
                          <ArrowUpRight className="h-2 w-2" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          <div className="absolute bottom-3 left-3 bg-white p-2 rounded shadow-sm text-xs">
            Publisher coverage in Western markets
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublisherMap;
