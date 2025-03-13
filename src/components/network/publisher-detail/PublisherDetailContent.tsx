
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle } from 'lucide-react';

interface PublisherDetailContentProps {
  publisher: Publisher;
  setShowLassieChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const PublisherDetailContent: React.FC<PublisherDetailContentProps> = ({ 
  publisher,
  setShowLassieChat
}) => {
  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-6">
        {/* Enhanced Logo and Info */}
        <div className="flex justify-between items-start mb-6">
          <PublisherHeader 
            publisher={publisher} 
            getPerformanceColor={getPerformanceColor} 
          />
          <button
            onClick={() => setShowLassieChat(true)}
            className="px-4 py-2 bg-white border border-empowerlocal-blue text-empowerlocal-blue rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Ask Lassie</span>
          </button>
        </div>
        
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
    </ScrollArea>
  );
};

export default PublisherDetailContent;
