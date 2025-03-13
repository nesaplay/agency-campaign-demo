
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Plus, Search, Grid, List, ChevronDown, ArrowUpDown } from 'lucide-react';
import BrandCard from '@/components/brands/BrandCard';
import { useBrand } from '@/components/brands/BrandContext';
import { Brand } from '@/components/brands/types';
import { cn } from '@/lib/utils';
import EmptyBrands from '@/components/brands/EmptyBrands';

type SortOption = 'alphabetical' | 'recent' | 'campaigns';
type ViewMode = 'grid' | 'list';

const Brands: React.FC = () => {
  const { brands, setActiveBrand } = useBrand();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortedBrands = [...brands].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      case 'campaigns':
        return b.campaignCount - a.campaignCount;
      case 'recent':
        // This would need actual timestamp data, but for now we'll use ID as a proxy
        return b.id.localeCompare(a.id);
      default:
        return 0;
    }
  });

  const filteredBrands = sortedBrands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSortLabel = (sort: SortOption): string => {
    switch (sort) {
      case 'alphabetical': return 'Alphabetical';
      case 'campaigns': return 'Most Campaigns';
      case 'recent': return 'Recently Added';
      default: return 'Sort';
    }
  };

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                >
                  <ArrowUpDown className="h-4 w-4 text-gray-500" />
                  <span>{getSortLabel(sortBy)}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                
                {showSortDropdown && (
                  <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <ul className="py-1">
                      <li 
                        className={cn("px-3 py-2 cursor-pointer hover:bg-gray-50", sortBy === 'alphabetical' && "bg-gray-100")} 
                        onClick={() => { setSortBy('alphabetical'); setShowSortDropdown(false); }}
                      >
                        Alphabetical
                      </li>
                      <li 
                        className={cn("px-3 py-2 cursor-pointer hover:bg-gray-50", sortBy === 'campaigns' && "bg-gray-100")} 
                        onClick={() => { setSortBy('campaigns'); setShowSortDropdown(false); }}
                      >
                        Most Campaigns
                      </li>
                      <li 
                        className={cn("px-3 py-2 cursor-pointer hover:bg-gray-50", sortBy === 'recent' && "bg-gray-100")} 
                        onClick={() => { setSortBy('recent'); setShowSortDropdown(false); }}
                      >
                        Recently Added
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              
              {/* View mode toggle */}
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                <button 
                  className={cn(
                    "flex items-center justify-center p-2 text-sm",
                    viewMode === 'grid' ? "bg-gray-100 text-empowerlocal-navy" : "bg-white text-gray-500 hover:bg-gray-50"
                  )}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button 
                  className={cn(
                    "flex items-center justify-center p-2 text-sm",
                    viewMode === 'list' ? "bg-gray-100 text-empowerlocal-navy" : "bg-white text-gray-500 hover:bg-gray-50"
                  )}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search brands..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-empowerlocal-blue focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Brands Grid/List */}
        <div className="flex-1 p-6 overflow-auto">
          {filteredBrands.length === 0 ? (
            <EmptyBrands isFiltered={searchQuery.length > 0} />
          ) : (
            <div className={cn(
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            )}>
              {filteredBrands.map(brand => (
                <BrandCard 
                  key={brand.id} 
                  brand={brand} 
                  onSetActive={setActiveBrand}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Brands;
