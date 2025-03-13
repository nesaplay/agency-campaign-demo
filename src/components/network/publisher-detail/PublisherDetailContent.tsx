
import React from 'react';
import { Publisher } from '../types';
import PublisherHeader from './PublisherHeader';
import KeyMetrics from './KeyMetrics';
import ContentCategories from './ContentCategories';
import PerformanceMetrics from './PerformanceMetrics';
import AudienceDemographics from './AudienceDemographics';
import AvailableInventory from './AvailableInventory';
import { getPerformanceColor } from './utils/colorUtils';
import ContentPreviewGallery from './ContentPreviewGallery';
import PublisherSeasonality from './PublisherSeasonality';
import AiInsights from './AiInsights';
import PublisherSpotlight from './PublisherSpotlight';

interface PublisherDetailContentProps {
  publisher: Publisher;
}

const PublisherDetailContent: React.FC<PublisherDetailContentProps> = ({ publisher }) => {
  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Enhanced Logo and Info */}
      <PublisherHeader 
        publisher={publisher} 
        getPerformanceColor={getPerformanceColor} 
      />
      
      {/* AI Insights Section */}
      <AiInsights publisher={publisher} />
      
      {/* Publisher Spotlight */}
      <PublisherSpotlight publisher={publisher} />
      
      {/* Content Preview Gallery */}
      <ContentPreviewGallery publisher={publisher} />
      
      {/* Key Metrics */}
      <KeyMetrics publisher={publisher} />
      
      {/* Seasonality Calendar */}
      <PublisherSeasonality publisher={publisher} />
      
      {/* Categories */}
      <ContentCategories categories={publisher.categories} />
      
      {/* Performance Metrics */}
      <PerformanceMetrics />
      
      {/* Enhanced Audience Demographics */}
      <AudienceDemographics />
      
      {/* Available Inventory */}
      <AvailableInventory />
    </div>
  );
};

export default PublisherDetailContent;
