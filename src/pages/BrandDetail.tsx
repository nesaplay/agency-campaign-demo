import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useParams } from 'react-router-dom';
import { useBrand } from '@/components/brands/BrandContext';
import BrandHeader from '@/components/brands/detail/BrandHeader';
import BrandInfoSection from '@/components/brands/detail/BrandInfoSection';
import BrandNotFound from '@/components/brands/detail/BrandNotFound';
import BrandChatInterface from '@/components/brands/detail/BrandChatInterface';

const BrandDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { brands, editBrand } = useBrand();
  const brand = brands.find(b => b.id === id) || null;
  
  if (!brand) {
    return (
      <MainLayout>
        <BrandNotFound />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <div className="flex-none">
          <BrandHeader brand={brand} />
          <BrandInfoSection brand={brand} />
        </div>
        
        <div className="flex-1 min-h-0">
          <BrandChatInterface 
            brand={brand}
            onBrandEdit={editBrand}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default BrandDetail;
