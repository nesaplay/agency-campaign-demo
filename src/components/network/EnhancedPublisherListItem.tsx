import React, { useState } from 'react';
import { MapPin, Users, BarChart2, DollarSign, Plus, CheckSquare, Square, ListPlus, Check, Star, ExternalLink, Eye } from 'lucide-react';
import { Publisher } from './types';
import { PublisherList } from '../lists/types';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
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

  // Function to derive publisher brand color
  const getPublisherBrandColor = () => {
    // This is a simplified approach - in production, you'd have actual brand colors stored
    const nameHash = publisher.name.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    // Generate vibrant but not too bright colors
    const hue = Math.abs(nameHash) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };
  const brandColor = getPublisherBrandColor();
  const isPremium = publisher.performance === 'Excellent';
  return <div className={cn("relative h-[110px] rounded-lg transition-all duration-150 cursor-pointer group", isSelected ? "bg-empowerlocal-blue/5 border border-empowerlocal-blue shadow-md" : "bg-white border border-gray-200 shadow-sm hover:shadow-md", isHovered && !isSelected && "translate-x-0.5", isPremium && !isSelected && "ring-1 ring-amber-200")} onClick={onClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Publisher brand color strip */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg" style={{
      backgroundColor: brandColor
    }} />
      
      <div className="flex items-center h-full px-4 py-3">
        {/* Selection Checkbox */}
        <div className="cursor-pointer mr-3" onClick={e => {
        e.stopPropagation();
        onToggleSelect();
      }}>
          {isSelected ? <div className="p-1 bg-empowerlocal-blue rounded-md shadow-sm">
              <CheckSquare className="h-5 w-5 text-white" />
            </div> : <div className="p-1 bg-white rounded-md shadow-sm border border-gray-200">
              <Square className="h-5 w-5 text-gray-400" />
            </div>}
        </div>
        
        {/* SECTION: Identity & Information */}
        <div className="flex items-center gap-4 w-[30%]">
          {/* Logo */}
          <div className="h-16 w-16 flex-shrink-0 bg-white flex items-center justify-center rounded-md shadow-sm border border-gray-100 overflow-hidden">
            <img src={publisher.logo} alt={`${publisher.name} logo`} className="max-h-full max-w-full object-contain p-2" />
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
            
            {/* Content preview and lists */}
            
          </div>
        </div>
        
        {/* SECTION: Categories, performance, lists */}
        <div className="flex flex-col gap-1 w-[25%]">
          
          
          {/* Categories */}
          <div className="flex flex-wrap gap-1 mt-1">
            {publisher.categories.slice(0, 3).map((category, index) => <span key={index} className={`px-2 py-0.5 border rounded-full text-xs ${getCategoryColor(category)}`}>
                {category}
              </span>)}
            {publisher.categories.length > 3 && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{publisher.categories.length - 3}
              </span>}
          </div>
          
          {/* Lists */}
          {inLists.length > 0}
          
          
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
          <Button variant="outline" size="sm" className="h-9 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => {
          e.stopPropagation();
          onClick();
        }}>
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="sm" className="bg-white border-gray-200" onClick={e => {
          e.stopPropagation();
          onSaveToList();
        }}>
            <ListPlus className="h-4 w-4 mr-1" />
            Save
          </Button>
          
          <Button size="sm" className={cn("transition-colors", isSelected ? "bg-empowerlocal-blue/20 text-empowerlocal-blue border border-empowerlocal-blue/30 hover:bg-empowerlocal-blue/30" : "bg-gradient-to-r from-empowerlocal-blue to-empowerlocal-green text-white")} onClick={e => {
          e.stopPropagation();
          onToggleSelect();
        }}>
            {isSelected ? <Check className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        </div>
      </div>
    </div>;
};
export default EnhancedPublisherListItem;