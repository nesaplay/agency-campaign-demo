
import React from 'react';
import { Users, BarChart2, DollarSign } from 'lucide-react';
import { Publisher } from '../types';

interface KeyMetricsProps {
  publisher: Publisher;
}

const KeyMetrics: React.FC<KeyMetricsProps> = ({ publisher }) => {
  return (
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
  );
};

export default KeyMetrics;
