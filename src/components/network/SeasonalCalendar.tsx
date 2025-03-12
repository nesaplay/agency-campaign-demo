
import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Filter, Sun, Thermometer, Cloud, Award } from 'lucide-react';
import { format } from 'date-fns';
import { SeasonalEvent } from './types';

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
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-empowerlocal-blue mr-2" />
          <h3 className="font-medium text-empowerlocal-navy">Seasonal Opportunity Calendar</h3>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigateMonth('prev')}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
            <span className="font-medium min-w-24 text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button 
              onClick={() => navigateMonth('next')}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-400 mr-1" />
              <select 
                className="text-sm border-0 focus:ring-0 py-1"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option>All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <select 
                className="text-sm border-0 focus:ring-0 py-1"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar View */}
        <div className="flex-1 overflow-auto p-4 border-r border-gray-200">
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
        
        {/* Seasonal Highlights Sidebar */}
        <div className="w-64 overflow-auto bg-gray-50 p-4">
          <h4 className="font-medium text-empowerlocal-navy mb-3">Seasonal Highlights</h4>
          
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <div 
                  key={event.id}
                  className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex items-start gap-2">
                    <div className={`p-2 rounded-lg ${event.color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-20')}`}>
                      {event.icon === 'sun' && <Sun className={`h-4 w-4 ${event.color}`} />}
                      {event.icon === 'thermometer' && <Thermometer className={`h-4 w-4 ${event.color}`} />}
                      {event.icon === 'cloud' && <Cloud className={`h-4 w-4 ${event.color}`} />}
                      {!event.icon && <Award className={`h-4 w-4 ${event.color}`} />}
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">{event.title}</h5>
                      <div className="text-xs text-gray-500 mb-1">
                        {format(new Date(event.startDate), 'MMM d')} - {format(new Date(event.endDate), 'MMM d')}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {event.regions.map((region, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                            {region}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Award className="h-3 w-3" />
                        <span>Relevance Score: {event.relevanceScore}/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 italic">No upcoming events for the selected filters.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalCalendar;
