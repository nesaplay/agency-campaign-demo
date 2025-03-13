
import React from 'react';
import { Calendar, HelpCircle } from 'lucide-react';

interface PublisherSeasonalityProps {
  publisher: any; // Will be expanded in a real implementation
}

const PublisherSeasonality: React.FC<PublisherSeasonalityProps> = ({ publisher }) => {
  // Sample seasonality data - in a real implementation, this would come from publisher data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const engagement = [65, 70, 75, 85, 90, 70, 65, 75, 85, 95, 90, 80];
  const availability = [80, 75, 60, 40, 30, 50, 70, 60, 40, 30, 50, 70];
  
  // Find peak months
  const peakEngagementMonths = months.filter((_, i) => engagement[i] >= 85);
  const bestAvailabilityMonths = months.filter((_, i) => availability[i] >= 70);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-500">Seasonality & Availability</h4>
        <button className="p-1 rounded-full hover:bg-gray-100">
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </button>
      </div>
      
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-5 w-5 text-empowerlocal-blue" />
          <h5 className="font-medium">Optimal Campaign Timing</h5>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Audience Engagement</span>
            <span className="text-xs text-gray-500 font-medium">Peak: {peakEngagementMonths.join(', ')}</span>
          </div>
          <div className="h-8 w-full bg-gray-200 rounded-md overflow-hidden flex">
            {months.map((month, i) => (
              <div
                key={month}
                className="flex-1 flex items-center justify-center"
                style={{ 
                  backgroundColor: engagement[i] >= 85 ? '#8B5CF6' : 
                                  engagement[i] >= 75 ? '#A78BFA' : 
                                  engagement[i] >= 65 ? '#C4B5FD' : '#DDD6FE',
                  height: '100%'
                }}
              >
                <span className="text-xs font-medium text-white">{month}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Inventory Availability</span>
            <span className="text-xs text-gray-500 font-medium">Best: {bestAvailabilityMonths.join(', ')}</span>
          </div>
          <div className="h-8 w-full bg-gray-200 rounded-md overflow-hidden flex">
            {months.map((month, i) => (
              <div
                key={month}
                className="flex-1 flex items-center justify-center"
                style={{ 
                  backgroundColor: availability[i] >= 70 ? '#10B981' : 
                                  availability[i] >= 60 ? '#34D399' : 
                                  availability[i] >= 50 ? '#6EE7B7' : '#A7F3D0',
                  height: '100%'
                }}
              >
                <span className="text-xs font-medium text-white">{month}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>For this publisher, campaigns scheduled during <span className="font-medium">Oct-Nov</span> typically see the highest engagement rates with good inventory availability.</p>
        </div>
      </div>
    </div>
  );
};

export default PublisherSeasonality;
