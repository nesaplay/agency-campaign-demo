import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ConversationHeader from './ConversationHeader';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';
import CampaignSummaryPanel from '../CampaignSummaryPanel';
import { useCampaignState } from '../hooks/useCampaignState';
import { useMessageHandlers } from '../hooks/useMessageHandlers';
import { Publisher as ConversationPublisher } from '@/components/network/types';
import { useToast } from "@/hooks/use-toast";
import { mockPublishers } from '@/components/network/mockData';

interface ConversationInterfaceProps {
  onPublisherSelect?: (publisher: ConversationPublisher) => void;
}

const ConversationInterface: React.FC<ConversationInterfaceProps> = ({ onPublisherSelect }) => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
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

  useEffect(() => {
    const preselectedIds = location.state?.preselectedPublisherIds as string[];
    if (preselectedIds && preselectedIds.length > 0) {
      console.log('Pre-selecting publishers from state:', preselectedIds);
      const publishersToSelect = mockPublishers.filter(p => preselectedIds.includes(p.id));
      setSelectedPublishers(publishersToSelect);

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, setSelectedPublishers]);

  const {
    handlePublisherSelect,
    handleAddAllPublishers,
    handleSendMessage,
    handleQuickReply,
    handleFeedback,
    handleAddPublisherToCampaign
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

  const handleRemovePublisherFromCampaign = (publisherId: string) => {
    setSelectedPublishers(prev => prev.filter(p => p.id !== publisherId));
    toast({
      title: "Publisher Removed",
      description: "The publisher has been removed from your campaign summary.",
    });
  };

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
          onAddPublisherToCampaign={handleAddPublisherToCampaign}
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
        onRemovePublisher={handleRemovePublisherFromCampaign}
        campaignStage={campaignStage}
      />
    </div>
  );
};

export default ConversationInterface;
