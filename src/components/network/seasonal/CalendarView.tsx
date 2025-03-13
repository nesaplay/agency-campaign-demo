
import React from 'react';
import { SeasonalEvent } from '../types';
import SeasonalCalendar from '../seasonal-calendar';

interface CalendarViewProps {
  events: SeasonalEvent[];
  regions: string[];
  categories: string[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, regions, categories }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <SeasonalCalendar 
        events={events}
        regions={regions}
        categories={categories}
      />
    </div>
  );
};

export default CalendarView;
