
import React, { useState } from 'react';
import { MapPin, Users, BarChart2, DollarSign, Plus, MoreVertical, Trash2, Eye, MessageCircleQuestion } from 'lucide-react';
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
  
  const handleAskLassie = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Lassie activated",
      description: `Now chatting about ${publisher.name}`,
    });
    // In a real implementation, this would trigger the Lassie chat panel
  };
  
  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative cursor-pointer"
      onClick={onClick}
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
      
      {/* Logo & Website Preview */}
      <div className="h-40 bg-gray-100 flex items-center justify-center relative">
        <img
          src={publisher.logo}
          alt={`${publisher.name} logo`}
          className="max-h-full max-w-full object-contain p-4 z-10 relative"
        />
        
        {/* Website preview background */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop" 
            alt="Website preview" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Performance badge */}
        <div className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded-full z-10 ${
          publisher.performance === 'Excellent' ? 'bg-green-100 text-green-700' :
          publisher.performance === 'Good' ? 'bg-blue-100 text-blue-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {publisher.performance}
        </div>
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
        
        {/* Action Buttons */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button 
            className="py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium flex items-center justify-center gap-1 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Plus className="h-4 w-4" />
            Add to Campaign
          </button>
          
          <button 
            className="py-2 bg-white border border-empowerlocal-blue/30 text-empowerlocal-blue hover:bg-empowerlocal-blue/5 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors"
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
