
import React from 'react';
import { MapPin, Star } from 'lucide-react';
import { Publisher } from './types';

interface PublisherCardProps {
  publisher: Publisher;
}

const PublisherCard: React.FC<PublisherCardProps> = ({ publisher }) => {
  return (
    <div className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="h-24 bg-gray-100 flex items-center justify-center">
        <img
          src={publisher.image}
          alt={publisher.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-empowerlocal-navy">{publisher.name}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{publisher.location}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
            <span className="text-sm font-medium">{publisher.rating}</span>
          </div>
          <span className="text-sm text-gray-500">{publisher.reach} Reach</span>
        </div>
      </div>
    </div>
  );
};

export default PublisherCard;
