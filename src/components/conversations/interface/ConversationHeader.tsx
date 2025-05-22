import React from "react";
import { Asterisk } from "lucide-react";

interface ConversationHeaderProps {
  campaignStage: number;
  showSummaryPanel: boolean;
  setShowSummaryPanel: (show: boolean) => void;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = () => {
  return (
    <div className="w-full flex items-center justify-center py-4 pb-1 bg-transparent">
      <Asterisk className="h-8 w-8 text-[#E16A3D] mb-2" strokeWidth={2.5} />
      <h1
        className="text-2xl font-serif bg-empowerlocal-gradient bg-clip-text text-transparent font-normal tracking-tight text-center"
        style={{ fontFamily: 'DM Serif Display, Playfair Display, Georgia, Times, serif' }}
      >
        Lassie AI Assistant
      </h1>
    </div>
  );
};

export default ConversationHeader;
