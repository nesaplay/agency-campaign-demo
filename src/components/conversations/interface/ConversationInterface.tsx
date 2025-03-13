import React from 'react';
import ConversationHeader from './ConversationHeader';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';
import CampaignSummaryPanel from '../CampaignSummaryPanel';
import { useCampaignState } from '../hooks/useCampaignState';
import { useMessageHandlers } from '../hooks/useMessageHandlers';
import { Publisher } from '../types';
import { mockPublishers } from '../data/mockPublishers';

interface ConversationInterfaceProps {
  onPublisherSelect?: (publisher: Publisher) => void;
}

const ConversationInterface: React.FC<ConversationInterfaceProps> = ({ onPublisherSelect }) => {
  const {
    campaignStage,
    setCampaignStage,
    showSummaryPanel,
    setShowSummaryPanel,
    selectedPublishers,
    setSelectedPublishers,
    campaignDetails,
    setCampaignDetails,
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isTyping,
    setIsTyping
  } = useCampaignState();

  const {
    handlePublisherSelect,
    handleAddAllPublishers,
    handleSendMessage,
    handleQuickReply,
    handleFeedback
  } = useMessageHandlers({
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isTyping,
    setIsTyping,
    setCampaignStage,
    selectedPublishers,
    setSelectedPublishers,
    setCampaignDetails,
    setShowSummaryPanel,
    publishers: mockPublishers,
    onPublisherSelect
  });

  const focusInput = () => {
    // The actual focus logic is in MessageInput now, but we keep the container click handler
    // to create a good UX where clicking anywhere in the chat area focuses the input
  };

  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col" onClick={focusInput}>
        <ConversationHeader 
          campaignStage={campaignStage}
          showSummaryPanel={showSummaryPanel}
          setShowSummaryPanel={setShowSummaryPanel}
        />
        
        <MessagesList 
          messages={messages}
          isTyping={isTyping}
          onFeedback={handleFeedback}
          onQuickReply={handleQuickReply}
          onPublisherSelect={handlePublisherSelect}
          onAddAllPublishers={handleAddAllPublishers}
        />
        
        <MessageInput 
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
        />
      </div>
      
      <CampaignSummaryPanel 
        isExpanded={showSummaryPanel}
        onToggle={() => setShowSummaryPanel(!showSummaryPanel)}
        publishers={selectedPublishers}
        budget={campaignDetails.budget}
        geography={campaignDetails.geography}
        timeline={campaignDetails.timeline}
        estimatedReach={campaignDetails.estimatedReach}
      />
    </div>
  );
};

export default ConversationInterface;
