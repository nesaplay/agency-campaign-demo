
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import CampaignCommandCenter from './command-center/CampaignCommandCenter';
import OpportunitySpotting from './opportunity-spotting/OpportunitySpotting';
import PersonalizedDiscovery from './personalized-discovery/PersonalizedDiscovery';
import BrandContextModule from '@/components/brands/BrandContextModule';
import { Button } from '@/components/ui/button';

const DashboardContent: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Section with Create Campaign Button */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-empowerlocal-navy">Welcome, Jane</h1>
            <p className="mt-1 text-gray-500">Your campaign command center</p>
          </div>
          <Button asChild className="bg-gradient-to-r from-empowerlocal-green to-empowerlocal-blue hover:from-empowerlocal-green/90 hover:to-empowerlocal-blue/90">
            <Link to="/campaigns/create">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Campaign
            </Link>
          </Button>
        </div>
      </div>

      {/* Brand Context Module (New Addition) */}
      <BrandContextModule />

      {/* Campaign Performance Command Center (Highest Priority) */}
      <section aria-labelledby="campaign-performance-heading">
        <CampaignCommandCenter />
      </section>

      {/* Seasonal & Trend Opportunity Spotting (Middle Priority) */}
      <section aria-labelledby="opportunity-spotting-heading">
        <OpportunitySpotting />
      </section>

      {/* Personalized Discovery & Learning (Lower Priority) */}
      <section aria-labelledby="personalized-discovery-heading">
        <PersonalizedDiscovery />
      </section>
    </div>
  );
};

export default DashboardContent;
