
import React from 'react';
import { SeasonalEvent } from '../types';

interface OpportunityCardProps {
  event: SeasonalEvent;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ event }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
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
  );
};

export default OpportunityCard;
