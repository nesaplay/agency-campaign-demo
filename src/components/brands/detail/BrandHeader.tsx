
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Brand } from '@/components/brands/types';
import { useBrand } from '@/components/brands/BrandContext';

interface BrandHeaderProps {
  brand: Brand;
}

const BrandHeader: React.FC<BrandHeaderProps> = ({ brand }) => {
  const { setActiveBrand } = useBrand();
  
  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-center gap-4 mb-5">
        <Link 
          to="/brands" 
          className="flex items-center gap-1 text-gray-500 hover:text-empowerlocal-navy transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to My Brands</span>
        </Link>
      </div>
      
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="h-16 w-16 rounded-lg flex items-center justify-center text-white text-2xl font-semibold shadow-sm"
            style={{ backgroundColor: brand.color }}
          >
            {brand.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-empowerlocal-navy">{brand.name}</h1>
            <p className="text-gray-500 mt-1">{brand.description}</p>
            <div className="flex items-center gap-6 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-600">
                  {brand.campaignCount} Campaigns
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-600">
                  23 Publishers
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {!brand.isActive && (
          <button 
            className="px-4 py-2 bg-empowerlocal-blue text-white rounded-lg hover:bg-empowerlocal-navy transition-colors"
            onClick={() => setActiveBrand(brand)}
          >
            Set as Active Brand
          </button>
        )}
      </div>
    </div>
  );
};

export default BrandHeader;
