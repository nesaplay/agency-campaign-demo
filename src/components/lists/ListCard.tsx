
import React from 'react';
import { Eye, Share2, Users } from 'lucide-react';
import { format } from 'date-fns';
import { PublisherList } from './types';
import { cn } from '@/lib/utils';

interface ListCardProps {
  list: PublisherList;
  onClick: () => void;
}

const ListCard: React.FC<ListCardProps> = ({ list, onClick }) => {
  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      {/* Cover Image */}
      <div 
        className="h-40 bg-gray-100 relative" 
        style={{ 
          backgroundImage: `url(${list.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-3 text-white">
          <h3 className="font-medium text-xl">{list.name}</h3>
        </div>
        
        {/* Visibility Badge */}
        <div className={cn(
          "absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium flex items-center",
          list.visibility === 'public' ? "bg-green-100 text-green-600" :
          list.visibility === 'team' ? "bg-blue-100 text-blue-600" :
          "bg-gray-100 text-gray-600"
        )}>
          {list.isShared && <Share2 className="h-3 w-3 mr-1" />}
          <span>{list.visibility === 'public' ? 'Public' : list.visibility === 'team' ? 'Team' : 'Private'}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-500 line-clamp-2">{list.description}</p>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-1 text-gray-400" />
            <span>{list.publisherCount} publishers</span>
          </div>
          
          <div className="text-xs text-gray-400">
            Updated {format(list.lastUpdated, 'MMM d, yyyy')}
          </div>
        </div>
        
        {/* View Button */}
        <button 
          className="mt-3 w-full py-2 bg-empowerlocal-blue text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors hover:bg-empowerlocal-navy"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <Eye className="h-4 w-4" />
          View List
        </button>
      </div>
    </div>
  );
};

export default ListCard;
