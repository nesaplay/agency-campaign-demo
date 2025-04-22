
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
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-all duration-200"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h3 className="font-bold text-xl tracking-[-0.2px]">{list.name}</h3>
        </div>
        
        {/* Visibility Badge */}
        <div className={cn(
          "absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1",
          list.visibility === 'public' ? "bg-success/15 text-success" :
          list.visibility === 'team' ? "bg-info/15 text-info" :
          "bg-gray-100 text-gray-600"
        )}>
          {list.isShared && <Share2 className="h-3 w-3" />}
          <span>{list.visibility === 'public' ? 'Public' : list.visibility === 'team' ? 'Team' : 'Private'}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-600 leading-5 line-clamp-2">{list.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-1 text-gray-500" />
            <span className="font-medium">{list.publisherCount} publishers</span>
          </div>
          
          <div className="text-xs text-gray-500">
            Updated {format(list.lastUpdated, 'MMM d, yyyy')}
          </div>
        </div>
        
        {/* View Button */}
        <button 
          className="mt-4 w-full py-2.5 bg-gradient-to-r from-empowerlocal-blue to-empowerlocal-blue/90 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-all duration-200 hover:from-empowerlocal-navy hover:to-empowerlocal-navy/90 shadow-sm"
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
