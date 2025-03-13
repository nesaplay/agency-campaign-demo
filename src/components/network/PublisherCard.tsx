
import React, { useState } from 'react';
import { MapPin, Users, BarChart2, DollarSign, Plus, MoreVertical, Trash2, Eye, MessageCircleQuestion, Star, ExternalLink } from 'lucide-react';
import { Publisher } from './types';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface PublisherCardProps {
  publisher: Publisher;
  onClick: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
}

const PublisherCard: React.FC<PublisherCardProps> = ({ publisher, onClick, onDelete, onViewDetails }) => {
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
  
  const handleAskLassie = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Lassie activated",
      description: `Now chatting about ${publisher.name}`,
    });
    // In a real implementation, this would trigger the Lassie chat panel
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
        "bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 relative cursor-pointer",
        isHovered && "transform scale-[1.01] shadow-md",
        isPremium && "ring-1 ring-amber-200"
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium indicator */}
      {isPremium && (
        <div className="absolute top-3 right-3 z-20 bg-amber-50 border border-amber-200 rounded-full p-1">
          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
        </div>
      )}
      
      {/* Options Menu */}
      <div className="absolute top-2 left-2 z-10">
        <button 
          onClick={handleMenuToggle}
          className="p-1.5 bg-white/90 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
        >
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </button>
        
        {menuOpen && (
          <div className="absolute left-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-20">
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
      
      {/* Website Preview */}
      <div className="h-40 bg-gradient-to-b from-gray-200 to-gray-100 flex items-center justify-center relative overflow-hidden">
        {/* Website screenshot background */}
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
        <div className={`absolute bottom-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full z-10 shadow-sm ${getPerformanceBadgeStyle(publisher.performance)}`}>
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
          Visit Site
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-empowerlocal-navy">{publisher.name}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{publisher.location}</span>
        </div>
        
        {/* Content preview */}
        <div className="mt-3 pb-3 border-b border-gray-100">
          <p className="text-xs text-gray-600 line-clamp-2">
            Latest content: "Local businesses thrive despite economic challenges. City council announces new development plans."
          </p>
        </div>
        
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="flex flex-col items-center p-2 rounded-md bg-gray-50 border border-gray-100">
            <Users className="h-3.5 w-3.5 text-gray-400 mb-1" />
            <span className="text-xs font-semibold">{publisher.subscribers}</span>
            <span className="text-[10px] text-gray-400">Subscribers</span>
          </div>
          
          <div className="flex flex-col items-center p-2 rounded-md bg-gray-50 border border-gray-100">
            <BarChart2 className="h-3.5 w-3.5 text-gray-400 mb-1" />
            <span className="text-xs font-semibold">{publisher.engagement}</span>
            <span className="text-[10px] text-gray-400">Engagement</span>
          </div>
          
          <div className="flex flex-col items-center p-2 rounded-md bg-gray-50 border border-gray-100">
            <DollarSign className="h-3.5 w-3.5 text-gray-400 mb-1" />
            <span className="text-xs font-semibold">{publisher.cpm}</span>
            <span className="text-[10px] text-gray-400">CPM</span>
          </div>
        </div>
        
        {/* Categories */}
        <div className="mt-3 flex flex-wrap gap-1">
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
            className="py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:to-gray-200 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium flex items-center justify-center gap-1 transition-colors shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Plus className="h-4 w-4" />
            Add to Campaign
          </button>
          
          <button 
            className="py-2 bg-gradient-to-r from-empowerlocal-blue/5 to-empowerlocal-blue/10 border border-empowerlocal-blue/30 text-empowerlocal-blue hover:bg-empowerlocal-blue/15 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors shadow-sm"
            onClick={handleAskLassie}
          >
            <MessageCircleQuestion className="h-4 w-4" />
            Ask Lassie
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublisherCard;
