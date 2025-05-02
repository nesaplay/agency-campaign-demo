import React from 'react';
import { Brand } from '@/components/brands/types';
import { Users, Target, ListChecks } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BrandInfoSectionProps {
  brand: Brand;
}

const BrandInfoSection: React.FC<BrandInfoSectionProps> = ({ brand }) => {
  const { metrics } = brand;

  // Return null or a placeholder if no metrics data
  if (!metrics) {
    return (
      <div className="px-6 pb-4 text-sm text-gray-500 italic">
        Detailed audience and objectives information not available.
      </div>
    );
  }

  const { targetAudience, objectives } = metrics;

  return (
    <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Target Audience Card */}
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-empowerlocal-blue" />
            Target Audience
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-2">
          <div>
            <strong className="text-gray-800">Primary:</strong> {targetAudience.primary || 'N/A'}
          </div>
          {targetAudience.interests?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <strong className="text-gray-800 mr-1">Interests:</strong>
              {targetAudience.interests.map((interest, idx) => (
                <Badge key={idx} variant="outline" className="font-normal bg-blue-50 text-blue-700 border-blue-200">
                  {interest}
                </Badge>
              ))}
            </div>
          )}
          {targetAudience.locations?.length > 0 && (
             <div className="flex flex-wrap items-center gap-1">
              <strong className="text-gray-800 mr-1">Locations:</strong>
              {targetAudience.locations.map((location, idx) => (
                <Badge key={idx} variant="outline" className="font-normal bg-green-50 text-green-700 border-green-200">
                  {location}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Brand Objectives Card */}
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-empowerlocal-blue" />
            Brand Objectives
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700">
          {objectives?.length > 0 ? (
            <ul className="space-y-1.5">
              {objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ListChecks className="h-4 w-4 mt-0.5 text-empowerlocal-blue flex-shrink-0" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-gray-500">No specific objectives defined.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandInfoSection; 