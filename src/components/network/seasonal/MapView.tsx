
import React from 'react';
import OriginalMapView from '../MapView';
import { mockPublishers } from '../mockData';

interface MapViewProps {
  selectedPublisher: any;
}

const MapView: React.FC<MapViewProps> = ({ selectedPublisher }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h4 className="font-medium mb-2">Opportunity Impact Map</h4>
        <p className="text-sm text-gray-600 mb-3">
          Visualize the geographical impact of seasonal opportunities across regions.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Retail Events
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Tourism
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
            Festivals
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
            Sports
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            Weather
          </span>
        </div>
      </div>
      
      <OriginalMapView 
        publishers={mockPublishers}
        selectedPublisher={selectedPublisher}
        onPublisherSelect={() => {}}
      />
    </div>
  );
};

export default MapView;
