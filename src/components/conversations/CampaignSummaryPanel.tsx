import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Calendar, Coins, Flag, Users, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Publisher } from '@/components/network/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import useCampaignStore from '@/stores/useCampaignStore';
import useListStore from '@/stores/useListStore';
import { ToastAction } from '@/components/ui/toast';
import { useNavigate } from 'react-router-dom';
import { PublisherList } from '../lists/types';

interface CampaignSummaryPanelProps {
  isExpanded: boolean;
  onToggle: () => void;
  publishers: Publisher[];
  budget?: string;
  geography?: string;
  timeline?: string;
  estimatedReach?: string;
  onRemovePublisher: (publisherId: string) => void;
  campaignStage: number;
}

const CampaignSummaryPanel: React.FC<CampaignSummaryPanelProps> = ({
  isExpanded,
  onToggle,
  publishers,
  budget = 'Not set',
  geography = 'Not set',
  timeline = 'Not set',
  estimatedReach = 'Not set',
  onRemovePublisher,
  campaignStage
}) => {
  const { toast } = useToast();
  const addCampaign = useCampaignStore((state) => state.addCampaign);
  const addList = useListStore((state) => state.addList);
  const navigate = useNavigate();
  
  // Calculate total reach from all selected publishers
  const calculateTotalReach = () => {
    if (publishers.length === 0) return 'Not available';
    
    // Convert reach strings like "450K" to numbers for calculation
    const totalReach = publishers.reduce((sum, pub) => {
      const reachNumber = pub.audienceSize;
      const multiplier = 1;
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
    // Gather current campaign data
    const campaignData = {
      budget,
      geography,
      timeline,
      estimatedReach,
      publishers,
    };
    
    // Add campaign to the store
    addCampaign(campaignData);
    
    // Show confirmation toast
    toast({
      title: "Campaign Saved & Ready",
      description: "Your campaign has been saved and prepared for export.",
    });
  };
  
  const handleSaveToList = () => {
    if (publishers.length === 0) return;

    // 1. Define list data
    const newListData = {
      id: `list_${Date.now()}`,
      name: `Campaign Publishers - ${new Date().toLocaleDateString()}`,
      description: `Publishers selected during campaign creation on ${new Date().toLocaleDateString()}.`, 
      publishers,
      publisherCount: publishers.length,
      visibility: 'private' as const,
      lastUpdated: new Date(),
      coverImage: publishers[0]?.logo || '',
      category: 'campaign',
      createdBy: 'You',
      isShared: false,
      totalReach: calculateTotalReach(),
    };

    // 2. Call store action to add the list
    const newList = addList(newListData);

    // 3. Show confirmation toast
    toast({
      title: "List Created",
      description: `List "${newList.name}" created with ${publishers.length} publishers.`,
      action: (
        <ToastAction 
          altText="View List" 
          onClick={() => navigate(`/lists/${newList.id}`)}
          className="bg-empowerlocal-blue hover:bg-empowerlocal-navy text-white"
        >
          View List
        </ToastAction>
      ),
    });
  };
  
  return (
    <AnimatePresence>
      {isExpanded ? (
        <motion.div 
          className="w-[420px] min-w-[420px] border-l border-t border-gray-200 bg-white shadow-xl h-full sticky top-4 overflow-auto flex flex-col"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-empowerlocal-navy">Campaign Summary</h3>
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
          
          {/* Scrollable Content Area */}
          <div className="p-4 flex-1 overflow-y-auto">
            {/* Progress indicator */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Campaign Progress</h4>
              {(() => {
                const totalSteps = 4;
                let progressSteps = 0;
                
                if (campaignStage >= 1) progressSteps = 1; // Start campaign
                if (campaignStage >= 2) progressSteps = 2; // Budget
                if (campaignStage >= 3) progressSteps = 3; // Geography
                if (campaignStage >= 3 && publishers.length > 0) progressSteps = 4; // Publishers

                const progress = (progressSteps / totalSteps) * 100;
                
                return (
                  <>
                    <div className="flex items-center gap-1">
                      <div className="flex-1 h-2 bg-empowerlocal-blue/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-empowerlocal-blue rounded-full transition-all duration-300 ease-out" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Budget</span>
                      <span>Geography</span>
                      <span>Publishers</span>
                      <span>Create</span>
                    </div>
                  </>
                );
              })()}
            </div>
            
            {/* Campaign details */}
            <Card className="mb-4 border border-gray-200 !p-0">
              <CardHeader className="p-4">
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
                      className="relative group p-2 bg-gray-50 border border-gray-200 rounded-md flex items-center gap-2"
                    >
                      <div className="h-8 w-8 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                        <img src={publisher.logo} alt={publisher.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm text-gray-800 truncate">{publisher.name}</h5>
                        <p className="text-xs text-gray-500 truncate">{publisher.location}</p>
                      </div>
                      <div className="text-xs font-medium">{publisher.audienceSize.toLocaleString()}</div>
                      {/* Remove button - appears on hover */}
                      <button 
                        className="absolute -top-2 -right-2 p-1 bg-white rounded-full text-red-400 hover:text-white hover:bg-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150 border border-gray-200 shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemovePublisher(publisher.id);
                        }}
                        title="Remove publisher"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center border border-dashed border-gray-200 rounded-md">
                  <p className="text-sm text-gray-500">No publishers selected yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Footer for Actions */}
          <div className="sticky bottom-0 z-10 bg-white p-4 border-t border-gray-200 space-y-2">
            <Button 
              onClick={handleExportBrief}
              className="w-full !text-base bg-empowerlocal-blue hover:bg-empowerlocal-navy"
              disabled={publishers.length === 0}
              size="sm"
            >
              Export Campaign Brief
            </Button>
            <Button 
              onClick={handleSaveToList}
              variant="outline"
              className="w-full !text-base"
              disabled={publishers.length === 0}
              size="sm"
            >
              Save Publishers to List
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="w-10 flex items-center justify-center border-l border-gray-200 bg-white shadow-lg"
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
