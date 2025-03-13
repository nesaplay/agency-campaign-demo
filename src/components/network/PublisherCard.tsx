
import React, { useState } from 'react';
import { MapPin, Users, BarChart2, DollarSign, Plus, MoreVertical, Trash2, Eye } from 'lucide-react';
import { Publisher } from './types';
import { useToast } from "@/hooks/use-toast";

interface PublisherCardProps {
  publisher: Publisher;
  onClick: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
}

const PublisherCard: React.FC<PublisherCardProps> = ({ publisher, onClick, onDelete, onViewDetails }) => {
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
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
    >
      {/* Options Menu */}
      <div className="absolute top-2 right-2 z-10">
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
      <div 
        className="h-32 bg-gray-100 flex items-center justify-center"
        onClick={onClick}
      >
        <img
          src={publisher.logo}
          alt={`${publisher.name} logo`}
          className="max-h-full max-w-full object-contain p-4"
        />
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-empowerlocal-navy">{publisher.name}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{publisher.location}</span>
        </div>
        
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-3">
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
        
        {/* Categories */}
        <div className="mt-3 flex flex-wrap gap-1">
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
        
        {/* Action Button */}
        <button 
          className="mt-3 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium flex items-center justify-center gap-1 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <Plus className="h-4 w-4" />
          Add to Campaign
        </button>
      </div>
    </div>
  );
};

export default PublisherCard;
