
import React from 'react';

interface PerformanceMetricsProps {
  // No specific props needed for now, but could be expanded later
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = () => {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-500 mb-2">Performance Metrics</h4>
      
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">Average Click-Through Rate</span>
            <span className="text-sm font-medium">2.3%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full">
            <div className="h-2 bg-empowerlocal-blue rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">Content Engagement</span>
            <span className="text-sm font-medium">4.7/5</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full">
            <div className="h-2 bg-empowerlocal-green rounded-full" style={{ width: '90%' }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">Advertiser Satisfaction</span>
            <span className="text-sm font-medium">4.2/5</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full">
            <div className="h-2 bg-purple-500 rounded-full" style={{ width: '80%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
