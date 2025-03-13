
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Plus, Search } from 'lucide-react';
import BrandCard from '@/components/brands/BrandCard';
import { useBrand } from '@/components/brands/BrandContext';

const Brands: React.FC = () => {
  const { brands, setActiveBrand } = useBrand();

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-empowerlocal-navy">My Brands</h1>
            <button 
              className="flex items-center gap-2 bg-empowerlocal-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-empowerlocal-navy transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add New Brand
            </button>
          </div>
          <p className="mt-2 text-gray-500">Manage your client brands and set the active context</p>
        </div>
        
        {/* Filters */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-end">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search brands..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-empowerlocal-blue focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        {/* Brands Grid */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {brands.map(brand => (
              <BrandCard 
                key={brand.id} 
                brand={brand} 
                onSetActive={setActiveBrand}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Brands;
