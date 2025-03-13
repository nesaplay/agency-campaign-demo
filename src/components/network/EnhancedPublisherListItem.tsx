
import React, { useState } from 'react';
import { MapPin, Users, BarChart2, DollarSign, Plus, CheckSquare, Square, ListPlus, Check, Star, ExternalLink } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);
  
  // Helper function to get performance color
  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'Excellent':
        return 'bg-gradient-to-r from-green-50 to-green-100 text-green-600 border border-green-200';
      case 'Good':
        return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 border border-blue-200';
      default:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-600 border border-yellow-200';
    }
  };
  
  // Get category-specific colors
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'News': 'bg-blue-100 text-blue-700 border-blue-200',
      'Sports': 'bg-green-100 text-green-700 border-green-200',
      'Entertainment': 'bg-purple-100 text-purple-700 border-purple-200',
      'Politics': 'bg-red-100 text-red-700 border-red-200',
      'Business': 'bg-amber-100 text-amber-700 border-amber-200',
      'Technology': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Lifestyle': 'bg-pink-100 text-pink-700 border-pink-200',
      'Health': 'bg-teal-100 text-teal-700 border-teal-200',
      'Education': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'Food': 'bg-orange-100 text-orange-700 border-orange-200'
    };
    
    return colorMap[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };
  
  const isPremium = publisher.performance === 'Excellent';
  
  return (
    <div 
      className={cn(
        "border rounded-lg p-4 flex items-center gap-4 transition-all duration-200 cursor-pointer relative",
        isSelected 
          ? "bg-empowerlocal-blue/5 border-empowerlocal-blue shadow-md" 
          : "bg-white border-gray-200 shadow-sm hover:shadow-md",
        isHovered && !isSelected && "transform translate-x-0.5",
        isPremium && !isSelected && "ring-1 ring-amber-200"
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
          <div className="p-1 bg-empowerlocal-blue rounded-md shadow-sm">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
        ) : (
          <div className="p-1 bg-white rounded-md shadow-sm border border-gray-200">
            <Square className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      
      {/* Logo */}
      <div className="h-20 w-20 bg-white flex items-center justify-center rounded-md shadow-sm border border-gray-100 overflow-hidden">
        <img
          src={publisher.logo}
          alt={`${publisher.name} logo`}
          className="max-h-full max-w-full object-contain p-2"
        />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-empowerlocal-navy">{publisher.name}</h3>
            {isPremium && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPerformanceColor(publisher.performance)}`}>
            {publisher.performance === 'Excellent' && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 inline fill-current" />
                {publisher.performance}
              </span>
            ) || publisher.performance}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{publisher.location}</span>
          
          <a 
            href="#" 
            className="ml-2 text-empowerlocal-blue text-xs flex items-center gap-0.5 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3" />
            Visit Site
          </a>
        </div>
        
        {/* Content preview */}
        <div className="mt-1 text-xs text-gray-600">
          <p className="line-clamp-1">Latest: "Local businesses thrive despite economic challenges."</p>
        </div>
        
        {/* Lists */}
        {inLists.length > 0 && (
          <div className="mt-1 text-xs inline-flex items-center px-2 py-0.5 bg-empowerlocal-blue/5 border border-empowerlocal-blue/20 rounded-md text-empowerlocal-blue">
            <span className="mr-1">In</span>
            {inLists.length === 1 ? (
              <span className="font-medium">{inLists[0].name}</span>
            ) : (
              <span className="font-medium">{inLists.length} lists</span>
            )}
          </div>
        )}
        
        {/* Categories */}
        <div className="mt-2 flex flex-wrap gap-1">
          {publisher.categories.slice(0, 4).map((category, index) => (
            <span 
              key={index} 
              className={`px-2 py-0.5 border rounded-full text-xs ${getCategoryColor(category)}`}
            >
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
      <div className="flex gap-6 text-sm">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Users className="h-3.5 w-3.5" />
            <span>Subscribers</span>
          </div>
          <span className="font-semibold text-empowerlocal-navy">{publisher.subscribers}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <BarChart2 className="h-3.5 w-3.5" />
            <span>Engagement</span>
          </div>
          <span className="font-semibold text-empowerlocal-navy">{publisher.engagement}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <DollarSign className="h-3.5 w-3.5" />
            <span>CPM</span>
          </div>
          <span className="font-semibold text-empowerlocal-navy">{publisher.cpm}</span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        <button 
          className="py-2 px-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:to-gray-200 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium flex items-center gap-1 transition-all duration-150 shadow-sm hover:shadow"
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
            "py-2 px-3 rounded-lg text-sm font-medium flex items-center gap-1 transition-all duration-150 shadow-sm hover:shadow",
            isSelected 
              ? "bg-gradient-to-r from-empowerlocal-blue/30 to-empowerlocal-blue/20 text-empowerlocal-blue border border-empowerlocal-blue/30 hover:bg-empowerlocal-blue/30" 
              : "bg-gradient-to-r from-gray-50 to-gray-100 hover:to-gray-200 text-gray-700 border border-gray-200"
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
