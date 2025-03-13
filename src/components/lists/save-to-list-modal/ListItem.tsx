
import React from 'react';
import { Check } from 'lucide-react';
import { PublisherList } from '../types';

interface ListItemProps {
  list: PublisherList;
  isSelected: boolean;
  onSelect: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ list, isSelected, onSelect }) => {
  return (
    <div 
      className={`p-3 border rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
        isSelected 
          ? 'border-empowerlocal-blue bg-empowerlocal-blue/5' 
          : 'border-gray-200 hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <div className="bg-gray-100 h-10 w-10 rounded-md flex items-center justify-center">
        {isSelected ? (
          <Check className="h-5 w-5 text-empowerlocal-blue" />
        ) : (
          <span className="text-xs font-medium text-gray-500">{list.publisherCount}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{list.name}</div>
        <div className="text-xs text-gray-500 truncate">
          {list.publisherCount} publishers • {list.lastUpdated.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ListItem;
