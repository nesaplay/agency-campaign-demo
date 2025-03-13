
import React, { useState } from 'react';
import { ArrowRight, SlidersHorizontal, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import CampaignCard from './CampaignCard';
import { Button } from '@/components/ui/button';

// Mock data for campaigns
const campaigns = [
  {
    id: 'camp-1',
    name: 'Summer Retail Promotion',
    dateRange: 'Jun 15 - Aug 31',
    status: 'active',
    performance: 'good', // good, warning, poor
    primaryKPI: 'CTR',
    primaryValue: 2.8,
    primaryTarget: 2.5,
    primaryDifference: 12,
    budgetPacing: 68,
    publisherCount: 12,
    needsAttention: false,
    metrics: {
      impressions: '1.2M',
      clicks: '32.5K',
      conversions: '1.8K'
    }
  },
  {
    id: 'camp-2',
    name: 'Back to School',
    dateRange: 'Jul 20 - Sep 15',
    status: 'active',
    performance: 'warning',
    primaryKPI: 'Conv. Rate',
    primaryValue: 1.2,
    primaryTarget: 1.5,
    primaryDifference: -20,
    budgetPacing: 42,
    publisherCount: 8,
    needsAttention: true,
    needsAttentionReason: 'Conversion rate below target',
    metrics: {
      impressions: '875K',
      clicks: '22.1K',
      conversions: '980'
    }
  },
  {
    id: 'camp-3',
    name: 'Fall Fashion',
    dateRange: 'Sep 1 - Oct 31',
    status: 'active',
    performance: 'poor',
    primaryKPI: 'ROAS',
    primaryValue: 1.8,
    primaryTarget: 3.0,
    primaryDifference: -40,
    budgetPacing: 35,
    publisherCount: 15,
    needsAttention: true,
    needsAttentionReason: 'ROAS significantly below target',
    metrics: {
      impressions: '980K',
      clicks: '18.5K',
      conversions: '650'
    }
  },
  {
    id: 'camp-4',
    name: 'Holiday Preview',
    dateRange: 'Oct 15 - Nov 15',
    status: 'active',
    performance: 'good',
    primaryKPI: 'Engagement',
    primaryValue: 8.5,
    primaryTarget: 7.0,
    primaryDifference: 21,
    budgetPacing: 25,
    publisherCount: 10,
    needsAttention: false,
    metrics: {
      impressions: '420K',
      clicks: '15.8K',
      conversions: '1.2K'
    }
  },
  {
    id: 'camp-5',
    name: 'Winter Essentials',
    dateRange: 'Nov 1 - Dec 31',
    status: 'scheduled',
    performance: 'not-started',
    primaryKPI: 'Reach',
    primaryValue: 0,
    primaryTarget: 500000,
    primaryDifference: 0,
    budgetPacing: 0,
    publisherCount: 18,
    needsAttention: false,
    metrics: {
      impressions: '0',
      clicks: '0',
      conversions: '0'
    }
  }
];

const CampaignCommandCenter: React.FC = () => {
  const [sortBy, setSortBy] = useState('performance');
  
  // Count campaigns by performance
  const goodPerformance = campaigns.filter(c => c.performance === 'good').length;
  const warningPerformance = campaigns.filter(c => c.performance === 'warning').length;
  const poorPerformance = campaigns.filter(c => c.performance === 'poor').length;
  const needsAttention = campaigns.filter(c => c.needsAttention).length;
  
  // Get active campaigns only
  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  
  // Sort campaigns
  const sortedCampaigns = [...activeCampaigns].sort((a, b) => {
    if (sortBy === 'performance') {
      const performanceOrder = { good: 3, warning: 2, poor: 1 };
      return performanceOrder[b.performance as keyof typeof performanceOrder] - 
             performanceOrder[a.performance as keyof typeof performanceOrder];
    } else if (sortBy === 'attention') {
      return Number(b.needsAttention) - Number(a.needsAttention);
    } else {
      return 0;
    }
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h2 id="campaign-performance-heading" className="text-xl font-semibold text-empowerlocal-navy">
              Active Campaigns
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Monitor and optimize your current campaign performance
            </p>
          </div>
          <Tabs defaultValue="performance" onValueChange={(value) => setSortBy(value)}>
            <TabsList>
              <TabsTrigger value="performance">
                Performance
              </TabsTrigger>
              <TabsTrigger value="attention">
                Needs Attention ({needsAttention})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Good Performance</p>
                <p className="text-xl font-semibold">{goodPerformance}/{activeCampaigns.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-4">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Needs Optimization</p>
                <p className="text-xl font-semibold">{warningPerformance}/{activeCampaigns.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-4">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Poor Performance</p>
                <p className="text-xl font-semibold">{poorPerformance}/{activeCampaigns.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="mb-6" />

        <div className="relative">
          <div className="flex overflow-x-auto pb-2 space-x-4 campaign-cards-scroll">
            {sortedCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 pointer-events-none bg-gradient-to-l from-white to-transparent w-16"></div>
        </div>

        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="text-empowerlocal-blue">
            View All Campaigns <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCommandCenter;
