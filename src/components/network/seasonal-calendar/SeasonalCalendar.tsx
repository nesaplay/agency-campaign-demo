
import React, { useState } from 'react';
import { SeasonalEvent } from '../types';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import EventsSidebar from './EventsSidebar';

interface SeasonalCalendarProps {
  events: SeasonalEvent[];
  regions: string[];
  categories: string[];
}

const SeasonalCalendar: React.FC<SeasonalCalendarProps> = ({ events, regions, categories }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  
  // Filter events based on selected filters
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    const isInCurrentMonth = eventDate.getMonth() === currentMonth.getMonth() && 
                             eventDate.getFullYear() === currentMonth.getFullYear();
    
    const matchesRegion = selectedRegion === 'All Regions' || event.regions.includes(selectedRegion);
    const matchesCategory = selectedCategory === 'All Categories' || event.categories.includes(selectedCategory);
    
    return isInCurrentMonth && matchesRegion && matchesCategory;
  });
  
  // Navigate to previous or next month
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };
  
  // Get upcoming events (next 30 days)
  const getUpcomingEvents = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      return eventStart >= today && eventStart <= thirtyDaysFromNow;
    });
  };
  
  const upcomingEvents = getUpcomingEvents();
  
  return (
    <div className="flex flex-col h-full">
      {/* Calendar Header */}
      <CalendarHeader 
        currentMonth={currentMonth}
        navigateMonth={navigateMonth}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        regions={regions}
        categories={categories}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar View */}
        <div className="flex-1 overflow-auto p-4 border-r border-gray-200">
          <CalendarGrid 
            currentMonth={currentMonth}
            filteredEvents={filteredEvents}
          />
        </div>
        
        {/* Seasonal Highlights Sidebar */}
        <EventsSidebar upcomingEvents={upcomingEvents} />
      </div>
    </div>
  );
};

export default SeasonalCalendar;
