
import React from 'react';
import { MapPin, MessageCircleQuestion } from 'lucide-react';
import { Publisher } from '../types';

interface PublisherHeaderProps {
  publisher: Publisher;
  getPerformanceColor: (performance: string) => string;
  onAskLassie: () => void;
}

const PublisherHeader: React.FC<PublisherHeaderProps> = ({ 
  publisher, 
  getPerformanceColor,
  onAskLassie
}) => {
  return (
    <div className="relative mb-8 bg-gradient-to-r from-gray-100 to-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-start gap-6">
        <div className="h-28 w-28 bg-white flex items-center justify-center rounded-lg shadow-sm border border-gray-200">
          <img
            src={publisher.logo}
            alt={`${publisher.name} logo`}
            className="max-h-full max-w-full object-contain p-3"
          />
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-empowerlocal-navy">{publisher.name}</h2>
          <div className="flex items-center text-gray-500 mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{publisher.location}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${getPerformanceColor(publisher.performance)}`}>
              {publisher.performance} Performance
            </div>
            <span className="text-sm text-gray-500">•</span>
            <div className="text-sm text-gray-500">{publisher.subscribers} Subscribers</div>
            <span className="text-sm text-gray-500">•</span>
            <div className="text-sm text-gray-500">{publisher.engagement} Engagement</div>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            A trusted local news source providing in-depth coverage of community events, local government, and regional interests since 1998.
          </p>
        </div>
        
        <button 
          onClick={onAskLassie}
          className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-white text-empowerlocal-blue border border-empowerlocal-blue/30 rounded-full text-sm font-medium shadow-sm hover:bg-empowerlocal-blue/5 transition-colors"
        >
          <MessageCircleQuestion className="h-4 w-4" />
          Ask Lassie
        </button>
      </div>
      
      {/* Website preview thumbnail/banner */}
      <div className="mt-4 h-24 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop" 
          alt="Website preview" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default PublisherHeader;
