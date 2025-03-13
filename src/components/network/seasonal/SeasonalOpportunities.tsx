import React, { useState } from 'react';
import { SeasonalEvent } from '../types';
import SeasonalHeader from './SeasonalHeader';
import ViewModeSelector from './ViewModeSelector';
import CalendarView from './CalendarView';
import MapView from './MapView';
import UpcomingOpportunities from './UpcomingOpportunities';

// Data (could be moved to a separate file later if needed)
const seasonalEvents: SeasonalEvent[] = [
  {
    id: '1',
    title: 'Winter Holiday Shopping',
    description: 'Peak retail season with high consumer spending across multiple categories.',
    startDate: '2023-11-15',
    endDate: '2023-12-31',
    regions: ['National', 'Northeast', 'Midwest'],
    categories: ['Retail', 'Entertainment'],
    relevanceScore: 9,
    color: 'text-blue-500',
    icon: 'thermometer'
  },
  {
    id: '2',
    title: 'Spring Break Tourism',
    description: 'Travel surge in vacation destinations with family-focused activities.',
    startDate: '2024-03-01',
    endDate: '2024-04-15',
    regions: ['Southeast', 'Southwest', 'West Coast'],
    categories: ['Travel', 'Entertainment'],
    relevanceScore: 8,
    color: 'text-green-500',
    icon: 'sun'
  },
  {
    id: '3',
    title: 'Back to School',
    description: 'Education-focused spending period with supplies, technology, and apparel purchases.',
    startDate: '2024-07-15',
    endDate: '2024-09-15',
    regions: ['National', 'Urban Centers'],
    categories: ['Retail', 'Education'],
    relevanceScore: 9,
    color: 'text-orange-500'
  },
  {
    id: '4',
    title: 'Local Festival Season',
    description: 'Community events with high foot traffic and local business engagement.',
    startDate: '2024-05-01',
    endDate: '2024-09-30',
    regions: ['Midwest', 'Southeast', 'West Coast'],
    categories: ['Entertainment', 'Food & Beverage'],
    relevanceScore: 7,
    color: 'text-purple-500'
  },
  {
    id: '5',
    title: 'Tax Season',
    description: 'Financial services focus with consumer financial planning and tax preparation.',
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    regions: ['National'],
    categories: ['Finance', 'Business'],
    relevanceScore: 8,
    color: 'text-emerald-500',
    icon: 'cloud'
  },
  {
    id: '6',
    title: 'Summer Travel Peak',
    description: 'Highest tourism period with family vacations and outdoor activities.',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    regions: ['National', 'Coastal', 'Mountain Regions'],
    categories: ['Travel', 'Outdoor Recreation'],
    relevanceScore: 9,
    color: 'text-yellow-500',
    icon: 'sun'
  },
  {
    id: '7',
    title: 'Black Friday/Cyber Monday',
    description: 'Highest retail volume period with significant consumer spending.',
    startDate: '2024-11-20',
    endDate: '2024-12-05',
    regions: ['National', 'Urban Centers'],
    categories: ['Retail', 'Technology'],
    relevanceScore: 10,
    color: 'text-red-500'
  },
  {
    id: '8',
    title: 'Farmers Market Season',
    description: 'Local agriculture and artisan focus with community engagement.',
    startDate: '2024-05-01',
    endDate: '2024-10-15',
    regions: ['Rural', 'Suburban'],
    categories: ['Food & Beverage', 'Retail'],
    relevanceScore: 6,
    color: 'text-green-600',
    icon: 'sun'
  }
];

const regions = ['National', 'Northeast', 'Southeast', 'Midwest', 'Southwest', 'West Coast', 'Mountain Regions', 'Coastal', 'Urban Centers', 'Rural', 'Suburban'];

const categories = ['Retail', 'Entertainment', 'Travel', 'Food & Beverage', 'Finance', 'Business', 'Education', 'Technology', 'Outdoor Recreation'];

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
