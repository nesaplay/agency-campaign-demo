
import React from 'react';
import { MapPin } from 'lucide-react';
import { Publisher } from '../types';

interface PublisherHeaderProps {
  publisher: Publisher;
  getPerformanceColor: (performance: string) => string;
}

const PublisherHeader: React.FC<PublisherHeaderProps> = ({ 
  publisher, 
  getPerformanceColor 
}) => {
  return (
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
  );
};

export default PublisherHeader;
