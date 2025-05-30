
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useBrand } from '../BrandContext';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import CollapsedView from './CollapsedView';
import MetricsSection from './MetricsSection';
import ActionBar from './ActionBar';
import EmptyState from './EmptyState';

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
        <EmptyState />
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
          <CollapsedView brand={activeBrand} />

          {/* Expand/Collapse Control */}
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="border border-gray-200 flex-shrink-0 transition-transform duration-300 hover:scale-105"
              aria-label={isOpen ? "Collapse brand details" : "Expand brand details"}
            >
              {isOpen ? (
                <ChevronUp className="h-4 w-4 transition-transform duration-300" />
              ) : (
                <ChevronDown className="h-4 w-4 transition-transform duration-300" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        {/* Expanded State Content */}
        <CollapsibleContent className="transition-all duration-300 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <Separator className="mb-4" />
          <MetricsSection />
          <ActionBar brand={activeBrand} />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default BrandContextModule;
