
import React, { useState } from 'react';
import { MapPin, Users, BarChart2, DollarSign, Plus, MoreVertical, Trash2, Eye } from 'lucide-react';
import { Publisher } from './types';
import { useToast } from "@/hooks/use-toast";

interface PublisherListItemProps {
  publisher: Publisher;
  onClick: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
}

const PublisherListItem: React.FC<PublisherListItemProps> = ({ publisher, onClick, onDelete, onViewDetails }) => {
  const [menuOpen, setMenuOpen] = useState(false);
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
  
  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer relative"
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
      <div className="h-16 w-16 bg-gray-100 flex items-center justify-center rounded-md">
        <img
          src={publisher.logo}
          alt={`${publisher.name} logo`}
          className="max-h-full max-w-full object-contain p-2"
        />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0" onClick={onClick}>
        <h3 className="font-medium text-empowerlocal-navy">{publisher.name}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{publisher.location}</span>
        </div>
        
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
      
      {/* Action Button */}
      <button 
        className="ml-4 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium flex items-center gap-1 transition-colors"
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
