import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Users, AlertTriangle, FileText, Settings, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
interface CampaignMetrics {
  impressions: string;
  clicks: string;
  conversions: string;
}
interface Campaign {
  id: string;
  name: string;
  dateRange: string;
  status: string;
  performance: string;
  primaryKPI: string;
  primaryValue: number;
  primaryTarget: number;
  primaryDifference: number;
  budgetPacing: number;
  publisherCount: number;
  needsAttention: boolean;
  needsAttentionReason?: string;
  metrics: CampaignMetrics;
}
interface CampaignCardProps {
  campaign: Campaign;
}
const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign
}) => {
  const [expanded, setExpanded] = useState(false);
  const performanceColors = {
    good: {
      bg: 'bg-success/10',
      border: 'border-success/20',
      text: 'text-success',
      indicator: 'bg-success'
    },
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning/20',
      text: 'text-warning',
      indicator: 'bg-warning'
    },
    poor: {
      bg: 'bg-error/10',
      border: 'border-error/20',
      text: 'text-error',
      indicator: 'bg-error'
    },
    'not-started': {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-700',
      indicator: 'bg-gray-400'
    }
  };
  const colors = performanceColors[campaign.performance as keyof typeof performanceColors];
  const handleClick = () => {
    setExpanded(!expanded);
  };
  return <Card className={cn("card-component card-campaign interactive w-[300px] min-w-[300px] cursor-pointer transition-all duration-200", expanded ? "scale-[1.02] shadow-elevated" : "", campaign.needsAttention ? `${colors.border} ring-1 ring-warning/30` : "")} onClick={handleClick} style={{
    padding: 0,
    // override Card default if needed, using 24px on inner sections
    borderRadius: 8
  }}>
      <CardContent className="!p-0">
        <div className="relative">
          {campaign.needsAttention}

          {/* Header */}
          <div className={cn("card-header px-6 py-4 flex flex-col gap-1", colors.bg)}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex-1 min-w-0">
                <h3 className="heading-4 truncate" title={campaign.name}>{campaign.name}</h3>
                <p className="small-text text-[#64748B] mt-1 mb-0">{campaign.dateRange}</p>
              </div>
              <div className={cn("h-3 w-3 rounded-full", colors.indicator)}></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 py-6 space-y-6">
            {/* KPI Row */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center mb-1">
                <span className="small-text text-gray-500">{campaign.primaryKPI}</span>
                <div className="flex items-center space-x-1">
                  <span className="data-text">{campaign.primaryValue}</span>
                  <span className="small-text text-gray-500">vs</span>
                  <span className="small-text text-gray-700">{campaign.primaryTarget}</span>
                  {campaign.primaryDifference > 0 ? <TrendingUp className="h-3 w-3 ml-1 text-success" /> : campaign.primaryDifference < 0 ? <TrendingDown className="h-3 w-3 ml-1 text-error" /> : null}
                </div>
              </div>
              <div className="text-xs text-right mb-1">
                {campaign.primaryDifference > 0 ? <span className="data-text text-success">+{campaign.primaryDifference}%</span> : <span className="data-text text-error">{campaign.primaryDifference}%</span>}
              </div>
            </div>

            {/* Progress Bar Row */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="small-text text-gray-500">Budget Pacing</span>
                <span className="data-text">{campaign.budgetPacing}%</span>
              </div>
              <Progress value={campaign.budgetPacing} />
            </div>

            {/* Publisher Count */}
            <div className="flex items-center small-text text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              <span>{campaign.publisherCount} publishers</span>
            </div>

            {/* Expandable Section */}
            {expanded && <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                {campaign.needsAttention && campaign.needsAttentionReason && <div className="mb-4 p-2 bg-warning/10 text-warning/80 text-sm rounded-md flex items-start">
                    <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="body-text">{campaign.needsAttentionReason}</p>
                  </div>}

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <p className="small-text text-gray-500">Impressions</p>
                    <p className="data-text">{campaign.metrics.impressions}</p>
                  </div>
                  <div className="text-center">
                    <p className="small-text text-gray-500">Clicks</p>
                    <p className="data-text">{campaign.metrics.clicks}</p>
                  </div>
                  <div className="text-center">
                    <p className="small-text text-gray-500">Conversions</p>
                    <p className="data-text">{campaign.metrics.conversions}</p>
                  </div>
                </div>
                {/* Card Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="btn-secondary flex-1 h-8">
                    <FileText className="h-3 w-3 mr-1" /> Details
                  </Button>
                  
                  <Button size="sm" variant="outline" className="btn-secondary flex-1 h-8">
                    <PlusCircle className="h-3 w-3 mr-1" /> Add
                  </Button>
                </div>
              </div>}
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default CampaignCard;