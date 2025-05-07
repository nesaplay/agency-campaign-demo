import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Filter, Users, BarChart2, DollarSign, PlusCircle } from "lucide-react";
import { Publisher } from "@/components/network/types";
import L from "leaflet";
import { Button } from "@/components/ui/button";

// State center coordinates mapping
const STATE_CENTERS: { [key: string]: LatLngExpression } = {
  'CA': [36.78, -119.42], // California
  'NY': [42.9538, -75.5268], // New York
  'TX': [31.4757, -99.3312], // Texas
  'FL': [27.6648, -81.5158], // Florida
  'IL': [40.3363, -89.1965], // Illinois
  'PA': [40.8781, -77.7996], // Pennsylvania
  'OH': [40.4173, -82.9071], // Ohio
  'GA': [32.6415, -83.4426], // Georgia
  'NC': [35.6301, -79.8431], // North Carolina
  'MI': [44.3148, -85.6024], // Michigan
  // Add more states as needed
};

interface MapMarkerData {
  id: string;
  name: string;
  position: LatLngExpression;
  publisherData: Publisher;
}

interface PublisherMapProps {
  publishers: Publisher[];
  onPublisherSelect: (publisherId: string) => void;
  onAddPublisherToCampaign: (publisherId: string) => void;
  state?: string;
}

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const PublisherMap: React.FC<PublisherMapProps> = ({ publishers, onPublisherSelect, onAddPublisherToCampaign, state }) => {
  // Process publishers prop into MapMarkerData
  const markers: MapMarkerData[] = publishers
    .filter((p) => p.latitude != null && p.longitude != null) // Ensure coordinates exist
    .map((p) => ({
      id: p.id,
      name: p.name,
      position: [p.latitude, p.longitude],
      publisherData: p, // Store the full publisher object
    }));


  // Use const for map center and zoom
  const zoomLevel = state ? 7 : 6; // Zoom in more when state is selected
  const mapCenter: LatLngExpression = state ? STATE_CENTERS[state] || [36.78, -119.42] : [36.78, -119.42];

  // Filter state (can be kept if needed)
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 h-80">
      {" "}
      {/* Adjust height as needed */}
      <MapContainer
        key={`${state}-${markers.map((m) => m.id).join("-")}`}
        center={mapCenter}
        zoom={zoomLevel}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Map markers from processed publishers data */}
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position} icon={defaultIcon}>
            <Popup minWidth={200}>
              <div className="space-y-2 text-xs">
                <div className="cursor-pointer" onClick={() => onPublisherSelect(marker.publisherData.id)}>
                  <div className="font-semibold text-sm mb-1 truncate">{marker.name}</div>
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{marker.publisherData.location}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-center mb-2">
                    <div title="Audience Size">
                      <Users className="h-3 w-3 mx-auto text-gray-400 mb-0.5" />
                      <span className="font-medium">
                        {marker.publisherData.audienceSize?.toLocaleString() || "N/A"}
                      </span>
                    </div>
                    <div title="Engagement">
                      <BarChart2 className="h-3 w-3 mx-auto text-gray-400 mb-0.5" />
                      <span className="font-medium">{marker.publisherData.engagement || "N/A"}</span>
                    </div>
                    <div title="CPM">
                      <DollarSign className="h-3 w-3 mx-auto text-gray-400 mb-0.5" />
                      <span className="font-medium">{marker.publisherData.cpm || "N/A"}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full text-xs py-1 h-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddPublisherToCampaign(marker.publisherData.id);
                  }}
                >
                  <PlusCircle className="h-3 w-3 mr-1" />
                  Add to Campaign
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Optional: Filter controls could be overlaid */}
        <div className="absolute top-3 right-3 z-[1000] flex gap-2 leaflet-control">
          {" "}
          {/* Use z-index and leaflet-control */}
          <button
            className="bg-white p-1.5 rounded shadow-md hover:shadow-lg transition-shadow border"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter className="h-4 w-4 text-gray-600" />
          </button>
          {filterOpen && (
            <div className="absolute top-10 right-0 bg-white rounded-md shadow-lg p-3 border border-gray-200 w-48">
              <h4 className="text-xs font-medium text-gray-700 mb-2">Filter Publishers</h4>
              <div className="space-y-2">
                <label className="flex items-center text-sm gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded text-empowerlocal-blue focus:ring-empowerlocal-blue"
                  />
                  <span>News</span>
                </label>
                <label className="flex items-center text-sm gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded text-empowerlocal-blue focus:ring-empowerlocal-blue"
                  />
                  <span>Entertainment</span>
                </label>
                <label className="flex items-center text-sm gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded text-empowerlocal-blue focus:ring-empowerlocal-blue"
                  />
                  <span>Lifestyle</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </MapContainer>
    </div>
  );
};

export default PublisherMap;
