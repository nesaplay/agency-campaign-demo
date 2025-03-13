
import React from 'react';
import { Users, Activity, DollarSign, BookOpen, Clock } from 'lucide-react';

interface AudienceDemographicsProps {
  // No specific props needed for now, but could be expanded later
}

const AudienceDemographics: React.FC<AudienceDemographicsProps> = () => {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-500 mb-2">Audience Demographics</h4>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          {/* Age Distribution Chart */}
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-empowerlocal-blue" />
              <h5 className="text-sm font-medium">Age Distribution</h5>
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
          
          {/* Audience Interests Chart */}
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-purple-500" />
              <h5 className="text-sm font-medium">Audience Interests</h5>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Local News</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-xs font-medium w-8 text-right">85%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Food & Dining</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-500 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <span className="text-xs font-medium w-8 text-right">72%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Local Events</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-500 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <span className="text-xs font-medium w-8 text-right">68%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Business</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-500 rounded-full" style={{ width: '54%' }}></div>
                  </div>
                  <span className="text-xs font-medium w-8 text-right">54%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Sports</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-500 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                  <span className="text-xs font-medium w-8 text-right">42%</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Demographic Data */}
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-4 w-4 text-green-500" />
              <h5 className="text-sm font-medium">Income & Education</h5>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-md p-2">
                <span className="text-xs text-gray-500">Avg. Income</span>
                <div className="text-base font-medium">$85,000</div>
              </div>
              
              <div className="bg-gray-50 rounded-md p-2">
                <span className="text-xs text-gray-500">Bachelor+</span>
                <div className="text-base font-medium">68%</div>
              </div>
              
              <div className="bg-gray-50 rounded-md p-2">
                <span className="text-xs text-gray-500">Homeowners</span>
                <div className="text-base font-medium">72%</div>
              </div>
              
              <div className="bg-gray-50 rounded-md p-2">
                <span className="text-xs text-gray-500">Parents</span>
                <div className="text-base font-medium">45%</div>
              </div>
            </div>
          </div>
          
          {/* Engagement Patterns */}
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-amber-500" />
              <h5 className="text-sm font-medium">Engagement Patterns</h5>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500">Peak Reading Times</span>
                <div className="mt-1 flex items-center h-6">
                  {[...Array(24)].map((_, i) => {
                    const height = 
                      (i >= 6 && i <= 9) ? '100%' : 
                      (i >= 17 && i <= 21) ? '100%' : 
                      (i >= 11 && i <= 13) ? '75%' : 
                      (i >= 4 && i < 6) || (i > 9 && i < 11) || (i > 13 && i < 17) || (i > 21 && i < 23) ? '40%' : '20%';
                    
                    return (
                      <div 
                        key={i}
                        className="flex-1 bg-amber-400 mx-0.5 rounded-sm"
                        style={{ height }}
                      ></div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>12am</span>
                  <span>6am</span>
                  <span>12pm</span>
                  <span>6pm</span>
                  <span>12am</span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="text-sm font-medium">85%</div>
                  <span className="text-xs text-gray-500">Mobile</span>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">12%</div>
                  <span className="text-xs text-gray-500">Desktop</span>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">3%</div>
                  <span className="text-xs text-gray-500">Tablet</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceDemographics;
