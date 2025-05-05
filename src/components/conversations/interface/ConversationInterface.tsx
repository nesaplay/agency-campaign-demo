import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConversationHeader from "./ConversationHeader";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";
import CampaignSummaryPanel from "../CampaignSummaryPanel";
import { useCampaignState } from "../hooks/useCampaignState";
import { useMessageHandlers } from "../hooks/useMessageHandlers";
import { Publisher as ConversationPublisher } from "@/components/network/types";
import { useBrand } from "@/components/brands/BrandContext";
import { useToast } from "@/hooks/use-toast";
import { mockPublishers } from "@/components/network/mockData";

interface ConversationInterfaceProps {
  onPublisherSelect?: (publisher: ConversationPublisher) => void;
}

const ConversationInterface: React.FC<ConversationInterfaceProps> = ({ onPublisherSelect }) => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { activeBrand } = useBrand();

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
    setIsTyping,
  } = useCampaignState();

  useEffect(() => {
    // Use the already extracted preselectedPublisherIds
    const preselectedPublisherIds = location.state?.preselectedPublisherIds as string[] | undefined; // Keep check for actual preselection logic if needed elsewhere
    if (preselectedPublisherIds && preselectedPublisherIds.length > 0) {
      console.log("Pre-selecting publishers from state:", preselectedPublisherIds);
      const publishersToSelect = mockPublishers.filter((p) => preselectedPublisherIds.includes(p.id));
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
    handleAddPublisherToCampaign,
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
    onPublisherSelect,
  });

  const handleRemovePublisherFromCampaign = (publisherId: string) => {
    setSelectedPublishers((prev) => prev.filter((p) => p.id !== publisherId));
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
    <div className="flex gap-4 max-h-[calc(100vh-12rem)] h-full">
      <div className="flex flex-col" onClick={focusInput}>
        <ConversationHeader
          campaignStage={campaignStage}
          showSummaryPanel={showSummaryPanel}
          setShowSummaryPanel={setShowSummaryPanel}
        />

        <div className="flex-1 overflow-y-auto p-4">
          <MessagesList
            messages={messages}
            isTyping={isTyping}
            onFeedback={handleFeedback}
            onQuickReply={handleQuickReply}
            onPublisherSelect={handlePublisherSelect}
            onAddAllPublishers={handleAddAllPublishers}
            onAddPublisherToCampaign={handleAddPublisherToCampaign}
          />
        </div>

        <MessageInput inputValue={inputValue} setInputValue={setInputValue} handleSendMessage={handleSendMessage} />
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
