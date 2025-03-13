
import React from 'react';

interface AudienceDemographicsProps {
  // No specific props needed for now, but could be expanded later
}

const AudienceDemographics: React.FC<AudienceDemographicsProps> = () => {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-500 mb-2">Audience Demographics</h4>
      
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex justify-between text-sm mb-3">
          <span>Age Groups</span>
          <div className="flex items-center">
            <span className="h-3 w-3 bg-empowerlocal-blue rounded-sm mr-1"></span>
            <span className="text-xs">% of audience</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">18-24</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-empowerlocal-blue rounded-full" style={{ width: '15%' }}></div>
              </div>
              <span className="text-xs font-medium w-8 text-right">15%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">25-34</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-empowerlocal-blue rounded-full" style={{ width: '25%' }}></div>
              </div>
              <span className="text-xs font-medium w-8 text-right">25%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">35-44</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-empowerlocal-blue rounded-full" style={{ width: '30%' }}></div>
              </div>
              <span className="text-xs font-medium w-8 text-right">30%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">45-54</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-empowerlocal-blue rounded-full" style={{ width: '20%' }}></div>
              </div>
              <span className="text-xs font-medium w-8 text-right">20%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">55+</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-empowerlocal-blue rounded-full" style={{ width: '10%' }}></div>
              </div>
              <span className="text-xs font-medium w-8 text-right">10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceDemographics;
