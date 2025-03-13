
import React from 'react';
import { Publisher } from '../types';
import PublisherHeader from './PublisherHeader';
import KeyMetrics from './KeyMetrics';
import ContentCategories from './ContentCategories';
import PerformanceMetrics from './PerformanceMetrics';
import AudienceDemographics from './AudienceDemographics';
import AvailableInventory from './AvailableInventory';
import { getPerformanceColor } from './utils/colorUtils';

interface PublisherDetailContentProps {
  publisher: Publisher;
}

const PublisherDetailContent: React.FC<PublisherDetailContentProps> = ({ publisher }) => {
  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Logo and Info */}
      <PublisherHeader 
        publisher={publisher} 
        getPerformanceColor={getPerformanceColor} 
      />
      
      {/* Key Metrics */}
      <KeyMetrics publisher={publisher} />
      
      {/* Categories */}
      <ContentCategories categories={publisher.categories} />
      
      {/* Performance Metrics */}
      <PerformanceMetrics />
      
      {/* Audience Demographics */}
      <AudienceDemographics />
      
      {/* Available Inventory */}
      <AvailableInventory />
    </div>
  );
};

export default PublisherDetailContent;
