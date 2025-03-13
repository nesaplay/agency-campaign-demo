
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ViewModeSelectorProps {
  viewMode: 'calendar' | 'map';
  setViewMode: (mode: 'calendar' | 'map') => void;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({ viewMode, setViewMode }) => {
  return (
    <div className="mb-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-5 w-5 text-empowerlocal-blue" />
        <h3 className="font-medium">Planning Calendar & Map</h3>
      </div>
      
      <div className="flex items-center">
        <Tabs 
          defaultValue="calendar" 
          value={viewMode} 
          onValueChange={(value) => setViewMode(value as 'calendar' | 'map')}
        >
          <TabsList className="bg-gray-100">
            <TabsTrigger value="calendar" className="text-sm">Calendar View</TabsTrigger>
            <TabsTrigger value="map" className="text-sm">Map View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default ViewModeSelector;
