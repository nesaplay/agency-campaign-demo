
import React, { useState } from 'react';
import { MapPin, Users, BarChart2, DollarSign, Plus, MoreVertical, Trash2, Eye, ExternalLink, Star } from 'lucide-react';
import { Publisher } from './types';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface PublisherListItemProps {
  publisher: Publisher;
  onClick: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
}

const PublisherListItem: React.FC<PublisherListItemProps> = ({ publisher, onClick, onDelete, onViewDetails }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  
  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    
    if (onDelete) {
      onDelete();
      toast({
        title: "Publisher removed",
        description: `${publisher.name} has been removed from this list`,
      });
    }
  };
  
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    
    if (onViewDetails) {
      onViewDetails();
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
  
  // Get performance badge style
  const getPerformanceBadgeStyle = (performance: string) => {
    switch (performance) {
      case 'Excellent':
        return 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200';
      case 'Good':
        return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200';
      default:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border border-yellow-200';
    }
  };
  
  const isPremium = publisher.performance === 'Excellent';
  
  return (
    <div 
      className={cn(
        "bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 transition-all duration-200 cursor-pointer relative",
        isHovered ? "shadow-md transform translate-x-0.5" : "shadow-sm",
        isPremium && "ring-1 ring-amber-200"
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Options Menu */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={handleMenuToggle}
          className="p-1.5 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm"
        >
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </button>
        
        {menuOpen && (
          <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-20">
            <button 
              className="w-full text-left py-2 px-3 hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
              onClick={handleViewDetails}
            >
              <Eye className="h-4 w-4 text-gray-500" />
              View Details
            </button>
            <button 
              className="w-full text-left py-2 px-3 hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm text-red-500"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
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
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg text-empowerlocal-navy">{publisher.name}</h3>
          {isPremium && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
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
        <div className="mt-2 text-xs text-gray-600">
          <p className="line-clamp-1">Latest: "Local businesses thrive despite economic challenges."</p>
        </div>
        
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
      
      {/* Performance badge */}
      <div className={`px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${getPerformanceBadgeStyle(publisher.performance)}`}>
        {publisher.performance === 'Excellent' && (
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 inline fill-current" />
            {publisher.performance}
          </span>
        ) || publisher.performance}
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
      
      {/* Action Button */}
      <button 
        className="ml-4 py-2 px-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:to-gray-200 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium flex items-center gap-1 transition-colors shadow-sm"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <Plus className="h-4 w-4" />
        Add
      </button>
    </div>
  );
};

export default PublisherListItem;
