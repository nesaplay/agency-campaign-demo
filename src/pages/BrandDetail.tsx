import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useParams } from 'react-router-dom';
import { useBrand } from '@/components/brands/BrandContext';
import BrandHeader from '@/components/brands/detail/BrandHeader';
import BrandTabs from '@/components/brands/detail/BrandTabs';
import BrandNotFound from '@/components/brands/detail/BrandNotFound';
import BrandInfoSection from '@/components/brands/detail/BrandInfoSection';
import OverviewTab from '@/components/brands/detail/tabs/OverviewTab';
import CampaignsTab from '@/components/brands/detail/tabs/CampaignsTab';
import PublishersTab from '@/components/brands/detail/tabs/PublishersTab';
import SettingsTab from '@/components/brands/detail/tabs/SettingsTab';
import AttachmentsTab from '@/components/brands/detail/tabs/AttachmentsTab';

const BrandDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { brands } = useBrand();
  const [activeTab, setActiveTab] = useState('overview');
  
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
      <div className="flex flex-col h-full bg-gray-50">
        <BrandHeader brand={brand} />
        <BrandInfoSection brand={brand} />
        <BrandTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          tabs={['overview', 'campaigns', 'publishers', 'attachments', 'settings']} 
        />
        
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === 'overview' && <OverviewTab brand={brand} setActiveTab={setActiveTab} />}
          {activeTab === 'campaigns' && <CampaignsTab brand={brand} />}
          {activeTab === 'publishers' && <PublishersTab brand={brand} />}
          {activeTab === 'attachments' && <AttachmentsTab brand={brand} />}
          {activeTab === 'settings' && <SettingsTab brand={brand} />}
        </div>
      </div>
    </MainLayout>
  );
};

export default BrandDetail;
