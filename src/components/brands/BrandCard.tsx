
import React from 'react';
import { Briefcase, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Brand } from './types';

interface BrandCardProps {
  brand: Brand;
  onSetActive: (brand: Brand) => void;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, onSetActive }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Brand Header */}
      <div 
        className="h-3 w-full" 
        style={{ backgroundColor: brand.color }}
      ></div>
      
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="h-12 w-12 rounded-lg flex items-center justify-center text-white text-xl font-semibold"
            style={{ backgroundColor: brand.color }}
          >
            {brand.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-medium text-lg text-gray-900">{brand.name}</h3>
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
              ? "bg-gray-100 text-gray-500 cursor-default"
              : "bg-empowerlocal-blue text-white hover:bg-empowerlocal-navy"
          )}
          onClick={() => !brand.isActive && onSetActive(brand)}
          disabled={brand.isActive}
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
