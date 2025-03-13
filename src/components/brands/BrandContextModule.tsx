
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Users, Target, BarChart2, ExternalLink } from 'lucide-react';
import { useBrand } from './BrandContext';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const BrandContextModule: React.FC = () => {
  const { activeBrand } = useBrand();
  const [isOpen, setIsOpen] = useState(() => {
    // Get stored preference from localStorage or default to false (collapsed)
    const storedState = localStorage.getItem('brandContextExpanded');
    return storedState ? JSON.parse(storedState) : true; // Default to expanded for first-time users
  });

  // Save expanded state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('brandContextExpanded', JSON.stringify(isOpen));
  }, [isOpen]);

  if (!activeBrand) {
    return (
      <Card className="mb-6 bg-gray-50 border-dashed border-gray-300 shadow-sm">
        <CardContent className="p-6 flex justify-center items-center">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Brand Selected</h3>
            <p className="text-sm text-gray-500 mb-4">Select or create a brand to get started</p>
            <Button asChild>
              <Link to="/brands">Manage Brands</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="mb-6 overflow-hidden transition-all duration-300" 
      style={{ borderLeft: `4px solid ${activeBrand.color}` }}
    >
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        {/* Collapsed State - Always Visible */}
        <div className="p-4 flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
          {/* Brand Identity */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div 
              className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: activeBrand.color }}
            >
              {activeBrand.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{activeBrand.name}</h2>
              <p className="text-sm text-gray-500 max-w-md truncate">{activeBrand.description}</p>
            </div>
          </div>

          {/* Key Metrics - Visible in Collapsed State */}
          <div className="flex items-center gap-6 ml-auto flex-grow justify-end flex-wrap flex-shrink-0">
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-500 mb-1">
                <BarChart2 className="h-4 w-4 mr-1" />
                <span className="text-xs">Campaigns</span>
              </div>
              <span className="text-lg font-semibold">{activeBrand.campaignCount}</span>
            </div>
            
            <Badge 
              className="h-7 rounded-md flex items-center" 
              variant="outline"
              style={{ 
                borderColor: activeBrand.isActive ? '#22c55e' : '#94a3b8',
                backgroundColor: activeBrand.isActive ? 'rgba(34, 197, 94, 0.1)' : 'transparent'
              }}
            >
              <span className={`mr-1.5 h-2 w-2 rounded-full ${activeBrand.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              {activeBrand.isActive ? 'Active' : 'Inactive'}
            </Badge>

            {/* Expand/Collapse Control */}
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="border border-gray-200 flex-shrink-0"
                aria-label={isOpen ? "Collapse brand details" : "Expand brand details"}
              >
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        {/* Expanded State Content */}
        <CollapsibleContent>
          <Separator className="mb-4" />
          <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Audience Demographics */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Users className="h-4 w-4 mr-1.5 text-gray-500" />
                Target Audience
              </h3>
              <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-600">
                <div className="mb-2">
                  <span className="font-medium">Primary:</span> Adults 25-45
                </div>
                <div className="mb-2">
                  <span className="font-medium">Interests:</span> Outdoor activities, Local events
                </div>
                <div>
                  <span className="font-medium">Locations:</span> Urban/Suburban areas
                </div>
              </div>
            </div>

            {/* Brand Objectives */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Target className="h-4 w-4 mr-1.5 text-gray-500" />
                Brand Objectives
              </h3>
              <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-600">
                <ul className="list-disc list-inside space-y-1">
                  <li>Increase local market awareness</li>
                  <li>Drive in-store traffic and engagement</li>
                  <li>Build community presence and loyalty</li>
                </ul>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <BarChart2 className="h-4 w-4 mr-1.5 text-gray-500" />
                Performance Metrics
              </h3>
              <div className="bg-gray-50 rounded-md p-3 text-sm">
                <div className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Awareness</span>
                    <span className="font-medium">64%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '64%' }}></div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Engagement</span>
                    <span className="font-medium">72%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Conversion</span>
                    <span className="font-medium">41%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '41%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="px-4 pb-4 flex justify-end">
            <Button 
              variant="outline"
              size="sm"
              asChild
              className="text-xs"
            >
              <Link to={`/brands/${activeBrand.id}`}>
                View Full Profile
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default BrandContextModule;
