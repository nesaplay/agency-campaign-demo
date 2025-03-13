
import React from 'react';
import { Clock } from 'lucide-react';
import { PublisherList } from '../types';
import ListItem from './ListItem';

interface RecentListsProps {
  recentLists: PublisherList[];
  selectedListId: string | null;
  setSelectedListId: (id: string) => void;
}

const RecentLists: React.FC<RecentListsProps> = ({ recentLists, selectedListId, setSelectedListId }) => {
  if (recentLists.length === 0) return null;
  
  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
        <Clock className="h-4 w-4" />
        <span>Recent Lists</span>
      </div>
      
      <div className="space-y-2">
        {recentLists.map(list => (
          <ListItem 
            key={list.id}
            list={list}
            isSelected={selectedListId === list.id}
            onSelect={() => setSelectedListId(list.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentLists;
