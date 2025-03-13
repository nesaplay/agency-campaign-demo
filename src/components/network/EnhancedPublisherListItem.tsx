
import React from 'react';
import { MapPin, Users, BarChart2, DollarSign, Plus, CheckSquare, Square, ListPlus, Check } from 'lucide-react';
import { Publisher } from './types';
import { PublisherList } from '../lists/types';
import { cn } from '@/lib/utils';

interface EnhancedPublisherListItemProps {
  publisher: Publisher;
  onClick: () => void;
  isSelected: boolean;
  onToggleSelect: () => void;
  onSaveToList: () => void;
  inLists: PublisherList[];
}

const EnhancedPublisherListItem: React.FC<EnhancedPublisherListItemProps> = ({ 
  publisher, 
  onClick, 
  isSelected,
  onToggleSelect,
  onSaveToList,
  inLists
}) => {
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
    <div 
      className={cn(
        "bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow",
        isSelected && "border-empowerlocal-blue bg-empowerlocal-blue/5"
      )}
    >
      {/* Selection Checkbox */}
      <div 
        className="cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect();
        }}
      >
        {isSelected ? (
          <CheckSquare className="h-5 w-5 text-empowerlocal-blue" fill="currentColor" />
        ) : (
          <Square className="h-5 w-5 text-gray-400" />
        )}
      </div>
      
      {/* Logo */}
      <div 
        className="h-16 w-16 bg-gray-100 flex items-center justify-center rounded-md cursor-pointer"
        onClick={onClick}
      >
        <img
          src={publisher.logo}
          alt={`${publisher.name} logo`}
          className="max-h-full max-w-full object-contain p-2"
        />
      </div>
      
      {/* Content */}
      <div 
        className="flex-1 min-w-0 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-empowerlocal-navy">{publisher.name}</h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(publisher.performance)}`}>
            {publisher.performance}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{publisher.location}</span>
        </div>
        
        {/* Lists */}
        {inLists.length > 0 && (
          <div className="mt-1 text-xs text-gray-500 flex items-center">
            <span className="mr-1">In</span>
            {inLists.length === 1 ? (
              <span className="font-medium text-empowerlocal-blue">{inLists[0].name}</span>
            ) : (
              <span className="font-medium text-empowerlocal-blue">{inLists.length} lists</span>
            )}
          </div>
        )}
        
        {/* Categories */}
        <div className="mt-2 flex flex-wrap gap-1">
          {publisher.categories.slice(0, 4).map((category, index) => (
            <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
              {category}
            </span>
          ))}
          {publisher.categories.length > 4 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{publisher.categories.length - 4}
            </span>
          )}
        </div>
      </div>
      
      {/* Metrics */}
      <div className="flex gap-4 text-sm">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-gray-500">
            <Users className="h-3.5 w-3.5" />
            <span>Subscribers</span>
          </div>
          <span className="font-medium">{publisher.subscribers}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-gray-500">
            <BarChart2 className="h-3.5 w-3.5" />
            <span>Engagement</span>
          </div>
          <span className="font-medium">{publisher.engagement}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-gray-500">
            <DollarSign className="h-3.5 w-3.5" />
            <span>CPM</span>
          </div>
          <span className="font-medium">{publisher.cpm}</span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        <button 
          className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium flex items-center gap-1 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onSaveToList();
          }}
        >
          <ListPlus className="h-4 w-4" />
          Save
        </button>
        
        <button 
          className={cn(
            "py-2 px-3 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors",
            isSelected 
              ? "bg-empowerlocal-blue/10 text-empowerlocal-blue hover:bg-empowerlocal-blue/20" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
        >
          {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </div>
    </div>
  );
};

export default EnhancedPublisherListItem;
