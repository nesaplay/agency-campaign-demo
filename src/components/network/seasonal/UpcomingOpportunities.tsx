
import React from 'react';
import { SeasonalEvent } from '../types';
import OpportunityCard from './OpportunityCard';

interface UpcomingOpportunitiesProps {
  events: SeasonalEvent[];
}

const UpcomingOpportunities: React.FC<UpcomingOpportunitiesProps> = ({ events }) => {
  return (
    <div className="mt-8">
      <h3 className="font-medium text-lg mb-4">Upcoming Opportunities</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(event => (
          <OpportunityCard key={event.id} event={event} />
        ))}
      </div>
      
      <div className="mt-4 flex justify-center">
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
          View All Opportunities
        </button>
      </div>
    </div>
  );
};

export default UpcomingOpportunities;
