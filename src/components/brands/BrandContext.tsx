
import React, { createContext, useContext, useState } from 'react';
import { Brand } from './types';
import { mockBrands } from './mockBrandsData';

interface BrandContextType {
  brands: Brand[];
  activeBrand: Brand | null;
  setActiveBrand: (brand: Brand) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [activeBrand, setActiveBrandState] = useState<Brand | null>(
    mockBrands.find(brand => brand.isActive) || null
  );

  const setActiveBrand = (brand: Brand) => {
    const updatedBrands = brands.map(b => ({
      ...b,
      isActive: b.id === brand.id
    }));
    
    setBrands(updatedBrands);
    setActiveBrandState({...brand, isActive: true});
  };

  return (
    <BrandContext.Provider value={{ brands, activeBrand, setActiveBrand }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = (): BrandContextType => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};
