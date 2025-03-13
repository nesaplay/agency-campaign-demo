
import React, { useState } from 'react';
import { MapPin, Users, BarChart2, DollarSign, Plus, CheckSquare, Square, ListPlus, Check, Star, ExternalLink } from 'lucide-react';
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
        "bg-white border rounded-lg overflow-hidden transition-all duration-200 relative cursor-pointer",
        isSelected 
          ? "border-empowerlocal-blue ring-2 ring-empowerlocal-blue/20 shadow-md" 
          : "border-gray-200 shadow-sm hover:shadow-md",
        isHovered && !isSelected && "transform scale-[1.01]",
        isPremium && !isSelected && "ring-1 ring-amber-200"
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
          <div className="p-1 bg-empowerlocal-blue rounded-md shadow-sm">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
        ) : (
          <div className="p-1 bg-white/90 rounded-md shadow-sm border border-gray-200">
            <Square className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      
      {/* Premium indicator */}
      {isPremium && (
        <div className="absolute top-2 right-2 z-10 bg-amber-50 border border-amber-200 rounded-full p-1 shadow-sm">
          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
        </div>
      )}
      
      {/* Logo and Website Preview */}
      <div className="h-36 bg-gradient-to-b from-gray-200 to-gray-100 flex items-center justify-center relative overflow-hidden">
        {/* Website background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop" 
            alt="Website preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/40"></div>
        </div>
        
        {/* Logo overlay */}
        <div className="z-10 bg-white/90 p-3 rounded-lg shadow-md">
          <img
            src={publisher.logo}
            alt={`${publisher.name} logo`}
            className="h-16 w-16 object-contain"
          />
        </div>
        
        {/* Performance badge */}
        <div className={`absolute bottom-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full z-10 ${getPerformanceColor(publisher.performance)}`}>
          {publisher.performance === 'Excellent' && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 inline fill-current" />
              {publisher.performance}
            </span>
          ) || publisher.performance}
        </div>
        
        {/* Visit website button */}
        <button
          className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-empowerlocal-blue text-xs font-medium py-1 px-2.5 rounded-full flex items-center gap-1 shadow-sm transition-colors z-10"
          onClick={(e) => {
            e.stopPropagation();
            window.open('#', '_blank');
          }}
        >
          <ExternalLink className="h-3 w-3" />
          Visit
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-empowerlocal-navy">
          {publisher.name}
        </h3>
        
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{publisher.location}</span>
        </div>
        
        {/* Content preview */}
        <div className="mt-2 pb-2 border-b border-gray-100">
          <p className="text-xs text-gray-600 line-clamp-1">
            Latest: "Local businesses thrive despite challenges"
          </p>
        </div>
        
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="flex flex-col items-center p-2 rounded-md bg-gray-50 border border-gray-100">
            <Users className="h-3.5 w-3.5 text-gray-400 mb-1" />
            <span className="text-xs font-semibold text-empowerlocal-navy">{publisher.subscribers}</span>
            <span className="text-[10px] text-gray-400">Subscribers</span>
          </div>
          
          <div className="flex flex-col items-center p-2 rounded-md bg-gray-50 border border-gray-100">
            <BarChart2 className="h-3.5 w-3.5 text-gray-400 mb-1" />
            <span className="text-xs font-semibold text-empowerlocal-navy">{publisher.engagement}</span>
            <span className="text-[10px] text-gray-400">Engagement</span>
          </div>
          
          <div className="flex flex-col items-center p-2 rounded-md bg-gray-50 border border-gray-100">
            <DollarSign className="h-3.5 w-3.5 text-gray-400 mb-1" />
            <span className="text-xs font-semibold text-empowerlocal-navy">{publisher.cpm}</span>
            <span className="text-[10px] text-gray-400">CPM</span>
          </div>
        </div>
        
        {/* Lists */}
        {inLists.length > 0 && (
          <div className="mt-2 px-2.5 py-1 bg-empowerlocal-blue/5 border border-empowerlocal-blue/20 rounded-md text-xs text-empowerlocal-blue flex items-center">
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
          {publisher.categories.slice(0, 3).map((category, index) => (
            <span 
              key={index} 
              className={`px-2 py-0.5 border rounded-full text-xs ${getCategoryColor(category)}`}
            >
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
            className="py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:to-gray-200 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium flex items-center justify-center gap-1 transition-all duration-150 shadow-sm hover:shadow"
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
              "py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-all duration-150 shadow-sm hover:shadow",
              isSelected 
                ? "bg-gradient-to-r from-empowerlocal-blue/30 to-empowerlocal-blue/20 text-empowerlocal-blue border border-empowerlocal-blue/30 hover:bg-empowerlocal-blue/30" 
                : "bg-gradient-to-r from-gray-50 to-gray-100 hover:to-gray-200 text-gray-700 border border-gray-200"
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
