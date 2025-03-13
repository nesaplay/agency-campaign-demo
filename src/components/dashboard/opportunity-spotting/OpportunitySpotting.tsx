
import React from 'react';
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OpportunityCard from './OpportunityCard';
import { seasonalEvents } from '@/components/network/seasonal/data';
import { Link } from 'react-router-dom';

const OpportunitySpotting: React.FC = () => {
  // Get next 60 days of opportunities
  const today = new Date();
  const twoMonthsLater = new Date();
  twoMonthsLater.setDate(today.getDate() + 60);
  
  const upcomingOpportunities = seasonalEvents
    .filter(event => {
      const startDate = new Date(event.startDate);
      return startDate >= today && startDate <= twoMonthsLater;
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h2 id="opportunity-spotting-heading" className="text-xl font-semibold text-empowerlocal-navy flex items-center gap-2">
              <Calendar className="h-5 w-5 text-empowerlocal-blue" />
              Upcoming Opportunities
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Plan your campaigns around these seasonal events for maximum impact
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Badge className="mr-2 bg-empowerlocal-blue">4</Badge>
              Retail
            </Button>
            <Button variant="outline" size="sm">
              <Badge className="mr-2 bg-empowerlocal-green">3</Badge>
              Travel
            </Button>
            <Button variant="outline" size="sm">
              <MapPin className="h-4 w-4 mr-1" />
              All Regions
            </Button>
          </div>
        </div>
        
        {/* Timeline view */}
        <div className="relative mb-4">
          <div className="w-full h-1 bg-gray-200 absolute top-4 left-0 right-0"></div>
          <div className="flex justify-between relative">
            {[...Array(5)].map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i * 15);
              return (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full z-10 ${i === 0 ? 'bg-empowerlocal-blue' : 'bg-gray-300'}`}></div>
                  <p className="text-xs text-gray-500 mt-2">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Opportunities */}
        <div className="relative">
          <div className="flex overflow-x-auto pb-2 space-x-4 opportunity-cards-scroll">
            {upcomingOpportunities.map(opportunity => (
              <OpportunityCard 
                key={opportunity.id} 
                opportunity={opportunity}
              />
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 pointer-events-none bg-gradient-to-l from-white to-transparent w-16"></div>
        </div>
        
        <div className="mt-4 flex justify-center">
          <Button variant="outline" asChild>
            <Link to="/network-navigator">
              Explore All Opportunities <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OpportunitySpotting;
