
import React from 'react';
import { Star, Award, Zap } from 'lucide-react';
import { Publisher } from '../types';

interface PublisherSpotlightProps {
  publisher: Publisher;
}

const PublisherSpotlight: React.FC<PublisherSpotlightProps> = ({ publisher }) => {
  // Sample spotlight attributes - in a real implementation, these would come from publisher data
  const spotlightAttributes = [
    {
      id: 1,
      icon: Star,
      color: 'text-amber-500',
      title: 'Award-Winning Editorial',
      description: 'Recognized for excellence in community journalism'
    },
    {
      id: 2,
      icon: Zap,
      color: 'text-purple-500',
      title: 'High Email Open Rates',
      description: '42% average open rate (15% above industry standard)'
    },
    {
      id: 3,
      icon: Award,
      color: 'text-teal-500',
      title: 'Premium Audience',
      description: '65% of readers have household income >$100K'
    }
  ];

  return (
    <div className="mb-8">
      <h4 className="text-sm font-medium text-gray-500 mb-2">Publisher Spotlight</h4>
      
      <div className="bg-gradient-to-r from-empowerlocal-navy/5 to-empowerlocal-blue/5 rounded-lg border border-empowerlocal-blue/10 p-4">
        <div className="grid grid-cols-3 gap-4">
          {spotlightAttributes.map(attribute => (
            <div key={attribute.id} className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1 rounded-md ${attribute.color} bg-gray-50`}>
                  <attribute.icon className="h-4 w-4" />
                </div>
                <h5 className="font-medium text-sm text-gray-800">{attribute.title}</h5>
              </div>
              <p className="text-xs text-gray-600">{attribute.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublisherSpotlight;
