
import React from 'react';
import { Sun, Thermometer, Cloud, Award } from 'lucide-react';
import { format } from 'date-fns';
import { SeasonalEvent } from '../types';

interface EventsSidebarProps {
  upcomingEvents: SeasonalEvent[];
}

const EventsSidebar: React.FC<EventsSidebarProps> = ({ upcomingEvents }) => {
  return (
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
  );
};

export default EventsSidebar;
