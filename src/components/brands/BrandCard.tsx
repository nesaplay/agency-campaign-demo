
import React, { useState } from 'react';
import { Briefcase, CheckCircle, MoreVertical, Edit, Eye, Archive } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Brand } from './types';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface BrandCardProps {
  brand: Brand;
  onSetActive: (brand: Brand) => void;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, onSetActive }) => {
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/brands/${brand.id}`);
  };

  return (
    <div 
      className={cn(
        "bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer",
        isHovering ? "translate-y-[-2px] brightness-[1.02]" : "",
        brand.isActive ? `border-2 border-[${brand.color}]` : "border-gray-200"
      )}
      onClick={handleViewDetails}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ borderColor: brand.isActive ? brand.color : '' }}
    >
      {/* Brand Header */}
      <div 
        className="h-3 w-full" 
        style={{ backgroundColor: brand.color }}
      ></div>
      
      <div className="p-4 relative">
        {/* Three-dot menu */}
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle edit brand
                }}
              >
                <Edit className="h-4 w-4" />
                <span>Edit Brand</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/campaigns?brandId=${brand.id}`);
                }}
              >
                <Eye className="h-4 w-4" />
                <span>View Campaigns</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle archive brand
                }}
              >
                <Archive className="h-4 w-4" />
                <span>Archive</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div 
            className="h-12 w-12 rounded-lg flex items-center justify-center text-white text-xl font-semibold shadow-sm"
            style={{ backgroundColor: brand.color }}
          >
            {brand.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{brand.name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Briefcase className="h-3.5 w-3.5 mr-1" />
              <span>{brand.campaignCount} campaigns</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{brand.description}</p>
        
        <button 
          className={cn(
            "w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors",
            brand.isActive
              ? "text-white"
              : "bg-empowerlocal-blue text-white hover:bg-empowerlocal-navy"
          )}
          onClick={(e) => {
            e.stopPropagation();
            !brand.isActive && onSetActive(brand);
          }}
          disabled={brand.isActive}
          style={{ backgroundColor: brand.isActive ? brand.color : '' }}
        >
          {brand.isActive ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Active Brand</span>
            </>
          ) : (
            <span>Set as Active</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default BrandCard;
