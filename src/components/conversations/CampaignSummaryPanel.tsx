
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Calendar, Coins, Flag, Users, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Publisher } from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface CampaignSummaryPanelProps {
  isExpanded: boolean;
  onToggle: () => void;
  publishers: Publisher[];
  budget?: string;
  geography?: string;
  timeline?: string;
  estimatedReach?: string;
}

const CampaignSummaryPanel: React.FC<CampaignSummaryPanelProps> = ({
  isExpanded,
  onToggle,
  publishers,
  budget = 'Not set',
  geography = 'Not set',
  timeline = 'Not set',
  estimatedReach = 'Not set'
}) => {
  const { toast } = useToast();
  
  // Calculate total reach from all selected publishers
  const calculateTotalReach = () => {
    if (publishers.length === 0) return 'Not available';
    
    // Convert reach strings like "450K" to numbers for calculation
    const totalReach = publishers.reduce((sum, pub) => {
      const reachNumber = parseFloat(pub.reach.replace(/[^0-9.]/g, ''));
      const multiplier = pub.reach.includes('M') ? 1000000 : 
                         pub.reach.includes('K') ? 1000 : 1;
      return sum + (reachNumber * multiplier);
    }, 0);
    
    // Format back to user-friendly string
    if (totalReach >= 1000000) {
      return `${(totalReach / 1000000).toFixed(1)}M`;
    } else if (totalReach >= 1000) {
      return `${(totalReach / 1000).toFixed(0)}K`;
    } else {
      return totalReach.toString();
    }
  };
  
  const handleExportBrief = () => {
    toast({
      title: "Campaign brief ready",
      description: "Your campaign brief has been prepared for export",
    });
  };
  
  const handleSaveToList = () => {
    toast({
      title: "Publishers saved",
      description: `${publishers.length} publishers have been saved to your list`,
    });
  };
  
  return (
    <AnimatePresence>
      {isExpanded ? (
        <motion.div 
          className="w-80 border-l border-gray-200 bg-white shadow-lg h-full"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-empowerlocal-navy">Campaign Summary</h3>
            <div className="flex gap-2">
              <button 
                onClick={onToggle}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-gray-500" />
              </button>
              <button 
                onClick={onToggle}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="p-4 overflow-auto h-[calc(100%-61px)]">
            {/* Progress indicator */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Campaign Progress</h4>
              <div className="flex items-center gap-1">
                <div className="flex-1 h-2 bg-empowerlocal-blue/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-empowerlocal-blue rounded-full" 
                    style={{ width: `${publishers.length ? '60%' : '30%'}` }}
                  ></div>
                </div>
                <span className="text-xs font-medium">{publishers.length ? '60%' : '30%'}</span>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Budget</span>
                <span>Geography</span>
                <span>Publishers</span>
                <span>Schedule</span>
                <span>Create</span>
              </div>
            </div>
            
            {/* Campaign details */}
            <Card className="mb-4 border border-gray-200">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold">Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Coins className="h-4 w-4 text-gray-400" />
                      <span>Budget:</span>
                    </div>
                    <span className="text-sm font-medium">{budget}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Flag className="h-4 w-4 text-gray-400" />
                      <span>Geography:</span>
                    </div>
                    <span className="text-sm font-medium">{geography}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Timeline:</span>
                    </div>
                    <span className="text-sm font-medium">{timeline}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>Est. Reach:</span>
                    </div>
                    <span className="text-sm font-medium">{estimatedReach || calculateTotalReach()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Selected publishers */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Selected Publishers ({publishers.length})</h4>
              {publishers.length > 0 ? (
                <div className="space-y-2">
                  {publishers.map(publisher => (
                    <div 
                      key={publisher.id} 
                      className="p-2 bg-gray-50 border border-gray-200 rounded-md flex items-center gap-2"
                    >
                      <div className="h-8 w-8 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                        <img src={publisher.image} alt={publisher.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm text-gray-800 truncate">{publisher.name}</h5>
                        <p className="text-xs text-gray-500 truncate">{publisher.location}</p>
                      </div>
                      <div className="text-xs font-medium">{publisher.reach}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center border border-dashed border-gray-200 rounded-md">
                  <p className="text-sm text-gray-500">No publishers selected yet</p>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="space-y-2">
              <Button 
                onClick={handleExportBrief}
                className="w-full bg-empowerlocal-blue hover:bg-empowerlocal-navy"
                disabled={publishers.length === 0}
              >
                Export Campaign Brief
              </Button>
              <Button 
                onClick={handleSaveToList}
                variant="outline"
                className="w-full"
                disabled={publishers.length === 0}
              >
                Save Publishers to List
              </Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="w-10 flex items-center justify-center border-l border-gray-200 bg-white shadow-lg h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button 
            onClick={onToggle} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Show campaign summary"
          >
            <ChevronLeft className="h-4 w-4 text-gray-500" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CampaignSummaryPanel;
