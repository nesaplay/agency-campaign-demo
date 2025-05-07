import React from "react";
import { Users, Target, BarChart2 } from "lucide-react";
import { PerformanceMetricProps } from "./types";
import { Brand } from "../types";

interface MetricsSectionProps {
  brand: Brand | null;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ brand }) => {
  if (!brand?.metrics) {
    return <div className="px-4 pb-4 text-center text-gray-500">Metrics data not available.</div>;
  }

  const { targetAudience, objectives, performance } = brand.metrics;

  return (
    <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Audience Demographics */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Users className="h-4 w-4 mr-1.5 text-gray-500" />
          Target Audience
        </h3>
        <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-600 space-y-1.5">
          <div>
            <span className="font-medium">Primary:</span> {targetAudience.primary}
          </div>
          <div>
            <span className="font-medium">Interests:</span> {targetAudience.interests.join(", ")}
          </div>
          <div>
            <span className="font-medium">Locations:</span> {targetAudience.locations.join(", ")}
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
            {objectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MetricsSection;
