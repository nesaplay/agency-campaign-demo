
import React, { useState } from 'react';
import { SeasonalEvent } from '../types';
import SeasonalHeader from './SeasonalHeader';
import ViewModeSelector from './ViewModeSelector';
import CalendarView from './CalendarView';
import MapView from './MapView';
import UpcomingOpportunities from './UpcomingOpportunities';
import { seasonalEvents, regions, categories } from './data';

const SeasonalOpportunities: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'map'>('calendar');
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="py-4">
      {/* Header section with title and description */}
      <SeasonalHeader />
      
      {/* View mode selector (calendar/map toggle) */}
      <ViewModeSelector 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
      />
      
      {/* Calendar or Map view based on selected mode */}
      {viewMode === 'calendar' ? (
        <CalendarView 
          events={seasonalEvents}
          regions={regions}
          categories={categories}
        />
      ) : (
        <MapView 
          selectedPublisher={selectedPublisher}
        />
      )}
      
      {/* Upcoming opportunities section */}
      <UpcomingOpportunities events={seasonalEvents.slice(0, 3)} />
    </div>
  );
};

export default SeasonalOpportunities;
