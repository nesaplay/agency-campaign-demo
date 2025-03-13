
import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import MapView from '../MapView';
import SeasonalCalendar from '../SeasonalCalendar';
import { mockPublishers } from '../mockData';
import { SeasonalEvent } from '../types';

// Sample data for seasonal events
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

// Available region and category filters
const regions = ['National', 'Northeast', 'Southeast', 'Midwest', 'Southwest', 'West Coast', 'Mountain Regions', 'Coastal', 'Urban Centers', 'Rural', 'Suburban'];
const categories = ['Retail', 'Entertainment', 'Travel', 'Food & Beverage', 'Finance', 'Business', 'Education', 'Technology', 'Outdoor Recreation'];

const SeasonalOpportunities: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'map'>('calendar');
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="py-4">
      <div className="mb-6">
        <h2 className="text-xl font-medium text-empowerlocal-navy mb-3">Seasonal Opportunities</h2>
        <p className="text-gray-600">
          Discover perfect timing opportunities across local markets. Plan campaigns around seasonal moments, 
          regional events, and cultural celebrations that resonate in specific communities.
        </p>
      </div>
      
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-empowerlocal-blue" />
          <h3 className="font-medium">Planning Calendar & Map</h3>
        </div>
        
        <div className="flex items-center">
          <Tabs defaultValue="calendar" value={viewMode} onValueChange={(value) => setViewMode(value as 'calendar' | 'map')}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="calendar" className="text-sm">Calendar View</TabsTrigger>
              <TabsTrigger value="map" className="text-sm">Map View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {viewMode === 'calendar' ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <SeasonalCalendar 
            events={seasonalEvents}
            regions={regions}
            categories={categories}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium mb-2">Opportunity Impact Map</h4>
            <p className="text-sm text-gray-600 mb-3">
              Visualize the geographical impact of seasonal opportunities across regions.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {/* Event Type Filters */}
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
          
          <MapView 
            publishers={mockPublishers}
            selectedPublisher={selectedPublisher}
            onPublisherSelect={() => {}}
          />
        </div>
      )}
      
      <div className="mt-8">
        <h3 className="font-medium text-lg mb-4">Upcoming Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {seasonalEvents.slice(0, 3).map(event => (
            <div 
              key={event.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className={`p-3 ${event.color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-20')} border-b border-gray-100`}>
                <h4 className={`font-medium ${event.color}`}>{event.title}</h4>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm">
                    <div className="text-gray-500 mb-1">Timing:</div>
                    <div className="font-medium">
                      {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                      {new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="text-sm text-right">
                    <div className="text-gray-500 mb-1">Relevance:</div>
                    <div className="font-medium">{event.relevanceScore}/10</div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">Regions:</div>
                  <div className="flex flex-wrap gap-1">
                    {event.regions.map((region, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                        {region}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Categories:</div>
                  <div className="flex flex-wrap gap-1">
                    {event.categories.map((category, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button className="px-3 py-1.5 bg-empowerlocal-blue text-white text-sm rounded-md hover:bg-blue-600 transition-colors">
                    View Publishers
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors">
                    Save
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-center">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            View All Opportunities
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeasonalOpportunities;
