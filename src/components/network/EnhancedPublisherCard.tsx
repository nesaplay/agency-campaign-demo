
import React from 'react';
import { MapPin, Users, BarChart2, DollarSign, Plus, CheckSquare, Square, ListPlus, Check } from 'lucide-react';
import { Publisher } from './types';
import { cn } from '@/lib/utils';
import { PublisherList } from '../lists/types';

interface EnhancedPublisherCardProps {
  publisher: Publisher;
  onClick: () => void;
  isSelected: boolean;
  onToggleSelect: () => void;
  onSaveToList: () => void;
  inLists: PublisherList[];
}

const EnhancedPublisherCard: React.FC<EnhancedPublisherCardProps> = ({ 
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
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
    >
      {/* Selection Checkbox */}
      <div 
        className="absolute top-2 left-2 z-10 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect();
        }}
      >
        {isSelected ? (
          <CheckSquare className="h-5 w-5 text-empowerlocal-blue bg-white rounded-sm" fill="currentColor" />
        ) : (
          <Square className="h-5 w-5 text-gray-400 bg-white/80 rounded-sm" />
        )}
      </div>
      
      {/* Logo */}
      <div 
        className="h-32 bg-gray-100 flex items-center justify-center relative"
        onClick={onClick}
      >
        <img
          src={publisher.logo}
          alt={`${publisher.name} logo`}
          className="max-h-full max-w-full object-contain p-4"
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(publisher.performance)}`}>
          {publisher.performance}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 
          className="font-medium text-empowerlocal-navy cursor-pointer"
          onClick={onClick}
        >
          {publisher.name}
        </h3>
        
        <div 
          className="flex items-center text-sm text-gray-500 mt-1 cursor-pointer"
          onClick={onClick}
        >
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{publisher.location}</span>
        </div>
        
        {/* Metrics */}
        <div 
          className="grid grid-cols-3 gap-2 mt-3 cursor-pointer"
          onClick={onClick}
        >
          <div className="flex flex-col items-center p-1 rounded-md bg-gray-50">
            <Users className="h-3.5 w-3.5 text-gray-400 mb-1" />
            <span className="text-xs font-medium">{publisher.subscribers}</span>
          </div>
          
          <div className="flex flex-col items-center p-1 rounded-md bg-gray-50">
            <BarChart2 className="h-3.5 w-3.5 text-gray-400 mb-1" />
            <span className="text-xs font-medium">{publisher.engagement}</span>
          </div>
          
          <div className="flex flex-col items-center p-1 rounded-md bg-gray-50">
            <DollarSign className="h-3.5 w-3.5 text-gray-400 mb-1" />
            <span className="text-xs font-medium">{publisher.cpm}</span>
          </div>
        </div>
        
        {/* Lists */}
        {inLists.length > 0 && (
          <div className="mt-2 text-xs text-gray-500 flex items-center">
            <span className="mr-1">In</span>
            {inLists.length === 1 ? (
              <span className="font-medium text-empowerlocal-blue">{inLists[0].name}</span>
            ) : (
              <span className="font-medium text-empowerlocal-blue">{inLists.length} lists</span>
            )}
          </div>
        )}
        
        {/* Categories */}
        <div 
          className="mt-2 flex flex-wrap gap-1 cursor-pointer"
          onClick={onClick}
        >
          {publisher.categories.slice(0, 3).map((category, index) => (
            <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
              {category}
            </span>
          ))}
          {publisher.categories.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{publisher.categories.length - 3}
            </span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button 
            className="py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium flex items-center justify-center gap-1 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onSaveToList();
            }}
          >
            <ListPlus className="h-4 w-4" />
            Save to List
          </button>
          
          <button 
            className={cn(
              "py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors",
              isSelected 
                ? "bg-empowerlocal-blue/10 text-empowerlocal-blue hover:bg-empowerlocal-blue/20" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect();
            }}
          >
            {isSelected ? (
              <>
                <Check className="h-4 w-4" />
                Selected
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Select
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPublisherCard;
