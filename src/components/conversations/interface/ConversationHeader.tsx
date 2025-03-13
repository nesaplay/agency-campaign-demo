
import React from 'react';
import { Bot } from 'lucide-react';

interface ConversationHeaderProps {
  campaignStage: number;
  showSummaryPanel: boolean;
  setShowSummaryPanel: (show: boolean) => void;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  campaignStage,
  showSummaryPanel,
  setShowSummaryPanel
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Bot className="h-6 w-6 text-empowerlocal-blue" />
        <h1 className="text-xl font-semibold text-empowerlocal-navy">Lassie AI Assistant</h1>
      </div>
      
      {campaignStage > 0 && (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${campaignStage >= 1 ? 'bg-empowerlocal-blue' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-2 rounded-full ${campaignStage >= 2 ? 'bg-empowerlocal-blue' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-2 rounded-full ${campaignStage >= 3 ? 'bg-empowerlocal-blue' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-2 rounded-full ${campaignStage >= 4 ? 'bg-empowerlocal-blue' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-2 rounded-full ${campaignStage >= 5 ? 'bg-empowerlocal-blue' : 'bg-gray-200'}`}></div>
          </div>
          
          <span className="text-sm text-gray-500">Step {campaignStage} of 5</span>
          
          <button 
            onClick={() => setShowSummaryPanel(!showSummaryPanel)}
            className={`text-xs font-medium py-1 px-3 rounded-full flex items-center gap-1 ${
              showSummaryPanel 
                ? 'bg-empowerlocal-blue/10 text-empowerlocal-blue' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showSummaryPanel ? 'Hide Summary' : 'Show Summary'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ConversationHeader;
