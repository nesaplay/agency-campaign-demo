
import React from 'react';
import { format } from 'date-fns';
import { SeasonalEvent } from '../types';

interface CalendarGridProps {
  currentMonth: Date;
  filteredEvents: SeasonalEvent[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentMonth, filteredEvents }) => {
  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 for Sunday, 1 for Monday, etc.
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-100 bg-gray-50"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = format(date, 'yyyy-MM-dd');
      
      // Find events for this day
      const dayEvents = filteredEvents.filter(event => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        return date >= eventStart && date <= eventEnd;
      });
      
      days.push(
        <div key={day} className="h-24 border border-gray-100 p-1 relative">
          <div className="text-xs font-medium mb-1">{day}</div>
          {dayEvents.map((event, index) => (
            <div 
              key={`${event.id}-${index}`}
              className={`text-xs p-1 mb-1 rounded truncate ${event.color}`}
              title={event.title}
            >
              {event.title}
            </div>
          ))}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div>
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs font-medium text-gray-500 py-1 text-center">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Days */}
      <div className="grid grid-cols-7">
        {generateCalendarDays()}
      </div>
    </div>
  );
};

export default CalendarGrid;
