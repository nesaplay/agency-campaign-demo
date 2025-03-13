
import React from 'react';
import { Users, Target, BarChart2 } from 'lucide-react';
import { PerformanceMetricProps } from './types';

const MetricsSection: React.FC = () => {
  return (
    <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Audience Demographics */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Users className="h-4 w-4 mr-1.5 text-gray-500" />
          Target Audience
        </h3>
        <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-600">
          <div className="mb-2">
            <span className="font-medium">Primary:</span> Adults 25-45
          </div>
          <div className="mb-2">
            <span className="font-medium">Interests:</span> Outdoor activities, Local events
          </div>
          <div>
            <span className="font-medium">Locations:</span> Urban/Suburban areas
          </div>
        </div>
      </div>

      {/* Brand Objectives */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Target className="h-4 w-4 mr-1.5 text-gray-500" />
          Brand Objectives
        </h3>
        <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-600">
          <ul className="list-disc list-inside space-y-1">
            <li>Increase local market awareness</li>
            <li>Drive in-store traffic and engagement</li>
            <li>Build community presence and loyalty</li>
          </ul>
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <BarChart2 className="h-4 w-4 mr-1.5 text-gray-500" />
          Performance Metrics
        </h3>
        <div className="bg-gray-50 rounded-md p-3 text-sm">
          <PerformanceMetric label="Awareness" value={64} color="bg-blue-500" />
          <PerformanceMetric label="Engagement" value={72} color="bg-green-500" />
          <PerformanceMetric label="Conversion" value={41} color="bg-amber-500" />
        </div>
      </div>
    </div>
  );
};

const PerformanceMetric: React.FC<PerformanceMetricProps> = ({ label, value, color }) => {
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex justify-between mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
};

export default MetricsSection;
