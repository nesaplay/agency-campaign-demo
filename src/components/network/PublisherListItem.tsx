import React, { useState } from 'react';
import { MapPin, Users, BarChart2, DollarSign, Plus, MoreVertical, Trash2, Eye, ExternalLink, Star, ChevronRight, Newspaper } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Publisher } from './types';

interface PublisherListItemProps {
  publisher: Publisher;
  onClick: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
}

const PublisherListItem: React.FC<PublisherListItemProps> = ({ publisher, onClick, onDelete, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
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
  
  // Function to derive publisher brand color
  const getPublisherBrandColor = () => {
    // This is a simplified approach - in production, you'd have actual brand colors stored
    const nameHash = publisher.name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Generate vibrant but not too bright colors
    const hue = Math.abs(nameHash) % 360;
    // Make it slightly lighter/less saturated for background
    return `hsl(${hue}, 60%, 85%)`; 
  };
  
  const brandColor = getPublisherBrandColor();
  const isPremium = publisher.performance === 'Excellent';
  
  return (
    <div 
      className={cn(
        "relative h-[110px] bg-white rounded-lg transition-all duration-150 cursor-pointer group flex items-center w-full gap-4",
        isHovered ? "shadow-md translate-x-0.5" : "shadow-sm border border-gray-200",
        isPremium && "ring-1 ring-amber-200"
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Publisher brand color strip */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 rounded-t-lg" 
        style={{ backgroundColor: `hsl(${Math.abs(publisher.name.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0)) % 360}, 70%, 60%)` }}
      />
      
      <div className="flex items-center w-full h-full px-4 py-3">
        {/* SECTION: Identity & Information */}
        <div className="flex items-center gap-4 w-[35%] flex-1">
          <div 
            className="h-16 w-16 flex-shrink-0 flex items-center justify-center rounded-md shadow-sm overflow-hidden"
            style={{ backgroundColor: brandColor }}
          >
            <img
              src={publisher.logo}
              alt={`${publisher.name} logo`}
              className="max-h-12 max-w-12 object-contain" 
            />
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-medium text-empowerlocal-navy text-lg truncate">{publisher.name}</h3>
              {isPremium && <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />}
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span className="truncate">{publisher.location}</span>
            </div>
            
            {/* Content preview */}
            <div className="mt-1 flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
                <Newspaper className="h-3.5 w-3.5" />
              </div>
              <p className="text-xs text-gray-600 line-clamp-1">Latest: "Local businesses thrive despite economic challenges."</p>
            </div>
          </div>
        </div>
        
        {/* SECTION: Categories & performance */}
        <div className="flex flex-col gap-4 w-[25%]">
          <div className={`self-start px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${getPerformanceBadgeStyle(publisher.performance)}`}>
            {publisher.performance === 'Excellent' && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 inline fill-current" />
                {publisher.performance}
              </span>
            ) || publisher.performance}
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-1 mt-1">
            {publisher.categories.slice(0, 2).map((category, index) => (
              <span 
                key={index} 
                className={`px-2 py-0.5 border rounded-full text-xs ${getCategoryColor(category)}`}
              >
                {category}
              </span>
            ))}
            {publisher.categories.length > 2 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{publisher.categories.length - 2}
              </span>
            )}
          </div>
        </div>
        
        {/* SECTION: Metrics */}
        <div className="flex gap-5 w-[25%]">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <Users className="h-3.5 w-3.5" />
              <span>Subscribers</span>
            </div>
            <span className="font-semibold text-empowerlocal-navy">{publisher.subscribers}</span>
          </div>
          
          <Separator orientation="vertical" className="h-10 bg-gray-200" />
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <BarChart2 className="h-3.5 w-3.5" />
              <span>Engagement</span>
            </div>
            <span className="font-semibold text-empowerlocal-navy">{publisher.engagement}</span>
          </div>
          
          <Separator orientation="vertical" className="h-10 bg-gray-200" />
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <DollarSign className="h-3.5 w-3.5" />
              <span>CPM</span>
            </div>
            <span className="font-semibold text-empowerlocal-navy">{publisher.cpm}</span>
          </div>
        </div>
        
        {/* SECTION: Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-9 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleViewDetails}
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            className="bg-gradient-to-r from-empowerlocal-blue to-empowerlocal-green text-white"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublisherListItem;
