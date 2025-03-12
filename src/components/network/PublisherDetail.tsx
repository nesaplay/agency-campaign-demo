
import React from 'react';
import { X, MapPin, Users, BarChart2, DollarSign, CheckCircle, Star, Plus, LineChart, Newspaper, Image } from 'lucide-react';
import { Publisher } from './types';

interface PublisherDetailProps {
  publisher: Publisher;
  onClose: () => void;
}

const PublisherDetail: React.FC<PublisherDetailProps> = ({ publisher, onClose }) => {
  // Helper function to get performance color
  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'Excellent':
        return 'bg-green-100 text-green-600';
      case 'Good':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-yellow-100 text-yellow-600';
    }
  };
  
  return (
    <div className="w-96 h-full border-l border-gray-200 bg-white overflow-auto flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-medium text-empowerlocal-navy">Publisher Details</h3>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        {/* Logo and Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-24 w-24 bg-gray-100 flex items-center justify-center rounded-lg">
            <img
              src={publisher.logo}
              alt={`${publisher.name} logo`}
              className="max-h-full max-w-full object-contain p-4"
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-empowerlocal-navy">{publisher.name}</h2>
            <div className="flex items-center text-gray-500 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{publisher.location}</span>
            </div>
            <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium inline-block ${getPerformanceColor(publisher.performance)}`}>
              {publisher.performance} Performance
            </div>
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="flex justify-center mb-1">
              <Users className="h-5 w-5 text-empowerlocal-blue" />
            </div>
            <div className="text-sm text-gray-500">Subscribers</div>
            <div className="font-semibold">{publisher.subscribers}</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="flex justify-center mb-1">
              <BarChart2 className="h-5 w-5 text-empowerlocal-green" />
            </div>
            <div className="text-sm text-gray-500">Engagement</div>
            <div className="font-semibold">{publisher.engagement}</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="flex justify-center mb-1">
              <DollarSign className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-sm text-gray-500">CPM</div>
            <div className="font-semibold">{publisher.cpm}</div>
          </div>
        </div>
        
        {/* Categories */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Content Categories</h4>
          <div className="flex flex-wrap gap-2">
            {publisher.categories.map((category, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                {category}
              </span>
            ))}
          </div>
        </div>
        
        {/* Performance Metrics */}
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
        
        {/* Audience Demographics */}
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
        
        {/* Available Inventory */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Available Inventory</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-empowerlocal-blue" />
                <div>
                  <div className="text-sm font-medium">Content Placement</div>
                  <div className="text-xs text-gray-500">Sponsored articles</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">$1,500</div>
                <div className="text-xs text-gray-500">per article</div>
              </div>
            </div>
            
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-empowerlocal-green" />
                <div>
                  <div className="text-sm font-medium">Banner Ads</div>
                  <div className="text-xs text-gray-500">300x250, 728x90</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">$12 CPM</div>
                <div className="text-xs text-gray-500">min 10,000 impr.</div>
              </div>
            </div>
            
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="text-sm font-medium">Newsletter Insertion</div>
                  <div className="text-xs text-gray-500">25,000 subscribers</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">$800</div>
                <div className="text-xs text-gray-500">per insertion</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full py-2 bg-gradient-to-r from-empowerlocal-green to-empowerlocal-blue text-white rounded-lg font-medium flex items-center justify-center gap-1">
          <Plus className="h-4 w-4" />
          Add to Campaign
        </button>
      </div>
    </div>
  );
};

export default PublisherDetail;
