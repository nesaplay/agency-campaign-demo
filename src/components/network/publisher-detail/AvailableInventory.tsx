
import React, { useState } from 'react';
import { Newspaper, Image, LineChart, ArrowRight, MessageSquareText, Info, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AvailableInventoryProps {
  // No specific props needed for now, but could be expanded later
}

const AvailableInventory: React.FC<AvailableInventoryProps> = () => {
  const [selectedOption, setSelectedOption] = useState('content');
  
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-500 mb-2">Available Inventory</h4>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 text-sm font-medium text-center ${
              selectedOption === 'content' ? 'bg-gray-50 text-empowerlocal-navy' : 'text-gray-500 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedOption('content')}
          >
            Content Placements
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium text-center ${
              selectedOption === 'display' ? 'bg-gray-50 text-empowerlocal-navy' : 'text-gray-500 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedOption('display')}
          >
            Display Ads
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium text-center ${
              selectedOption === 'email' ? 'bg-gray-50 text-empowerlocal-navy' : 'text-gray-500 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedOption('email')}
          >
            Email & Newsletter
          </button>
        </div>
        
        {selectedOption === 'content' && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-36 bg-gray-100 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop" 
                    alt="Sponsored Article" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">Sponsored Article</h5>
                      <div className="flex items-center gap-1 mt-1">
                        <Check className="h-3.5 w-3.5 text-green-500" />
                        <span className="text-xs text-gray-500">Social media distribution included</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">$1,500</div>
                      <div className="text-xs text-gray-500">per article</div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Newspaper className="h-3.5 w-3.5" />
                      <span>Homepage Featured</span>
                    </div>
                    <button className="px-3 py-1 bg-empowerlocal-blue text-white text-xs rounded flex items-center gap-1 hover:bg-empowerlocal-navy transition-colors">
                      <span>Add</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-36 bg-gray-100 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop" 
                    alt="Sponsored Video" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">Branded Content Series</h5>
                      <div className="flex items-center gap-1 mt-1">
                        <Check className="h-3.5 w-3.5 text-green-500" />
                        <span className="text-xs text-gray-500">Includes 3 articles over 3 months</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">$3,900</div>
                      <div className="text-xs text-gray-500">package rate</div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MessageSquareText className="h-3.5 w-3.5" />
                      <span>Cross-platform promotion</span>
                    </div>
                    <button className="px-3 py-1 bg-empowerlocal-blue text-white text-xs rounded flex items-center gap-1 hover:bg-empowerlocal-navy transition-colors">
                      <span>Add</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedOption === 'display' && (
          <div className="p-4 space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-empowerlocal-blue" />
                <div>
                  <div className="flex items-center gap-1">
                    <div className="text-sm font-medium">Leaderboard (728x90)</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3.5 w-3.5 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Top of page placement with high visibility</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-xs text-gray-500">Homepage & Article Pages</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">$12 CPM</div>
                <div className="text-xs text-gray-500">min 10,000 impr.</div>
              </div>
            </div>
            
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-empowerlocal-green" />
                <div>
                  <div className="flex items-center gap-1">
                    <div className="text-sm font-medium">Medium Rectangle (300x250)</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3.5 w-3.5 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">In-content placement with high engagement</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-xs text-gray-500">Article Pages Only</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">$15 CPM</div>
                <div className="text-xs text-gray-500">min 10,000 impr.</div>
              </div>
            </div>
            
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="flex items-center gap-1">
                    <div className="text-sm font-medium">Mobile Sticky Banner (320x50)</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3.5 w-3.5 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Mobile-only placement with persistent visibility</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-xs text-gray-500">All Mobile Pages</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">$18 CPM</div>
                <div className="text-xs text-gray-500">min 5,000 impr.</div>
              </div>
            </div>
          </div>
        )}
        
        {selectedOption === 'email' && (
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-empowerlocal-blue" />
                  <div>
                    <div className="text-sm font-medium">Daily Newsletter</div>
                    <div className="text-xs text-gray-500">25,000 subscribers • 42% open rate</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">$800</div>
                  <div className="text-xs text-gray-500">per insertion</div>
                </div>
              </div>
              
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-empowerlocal-green" />
                  <div>
                    <div className="text-sm font-medium">Weekend Events Newsletter</div>
                    <div className="text-xs text-gray-500">18,000 subscribers • 38% open rate</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">$650</div>
                  <div className="text-xs text-gray-500">per insertion</div>
                </div>
              </div>
              
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="text-sm font-medium">Business Weekly Newsletter</div>
                    <div className="text-xs text-gray-500">12,000 subscribers • 45% open rate</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">$550</div>
                  <div className="text-xs text-gray-500">per insertion</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 border border-dashed border-empowerlocal-blue/30 bg-empowerlocal-blue/5 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="bg-white p-1 rounded-full text-empowerlocal-blue border border-empowerlocal-blue/20">
                    <Info className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-empowerlocal-navy">Newsletter Bundle Discount</h5>
                    <p className="mt-1 text-xs text-gray-600">Book 4+ newsletter insertions and receive a 15% discount on your total package.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableInventory;
