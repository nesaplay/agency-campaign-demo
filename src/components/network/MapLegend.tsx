import React from "react";
import { MapPin, Store } from "lucide-react";
import { Brand } from "../brands/types";

interface MapLegendProps {
  activeBrand: Brand;
}

const MapLegend: React.FC<MapLegendProps> = ({ activeBrand }) => {
  return (
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
        <span>{activeBrand.name} Retail Location</span>
      </div>
    </div>
  );
};

export default MapLegend;
