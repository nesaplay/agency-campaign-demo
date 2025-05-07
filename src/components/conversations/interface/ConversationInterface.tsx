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
import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

interface ConversationInterfaceProps {
  onPublisherSelect?: (publisher: ConversationPublisher) => void;
  assistantId?: string;
}

const ConversationInterface: React.FC<ConversationInterfaceProps> = ({ onPublisherSelect, assistantId }) => {
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

  const [currentThreadId, setCurrentThreadId] = React.useState<string | null>(null);

  // --- TanStack Query Mutation for sending message and handling stream ---
  const streamMutation = useMutation({
    mutationFn: async (userInput: string) => {
      setIsTyping(true);

      // 1. Get Supabase auth token
      const supabase = createClient();
      const session = (await supabase.auth.getSession())?.data?.session;

      if (!session) throw new Error("Not authenticated");

      // 2. Prepare request body
      const requestBody = {
        message: userInput,
        assistantId: assistantId,
        thread_id: currentThreadId,
        context: JSON.stringify({
          brand: activeBrand,
        }),
      };

      // 3. Call the stream API endpoint
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // 4. Process the stream
      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      const assistantMsgId = `assistant-${Date.now()}`;
      let accumulatedContent = "";

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          content: "",
          sender: "assistant" as const,
          timestamp: new Date(),
        },
      ]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulatedContent += value;
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, content: accumulatedContent } : msg)),
        );
      }

      const newThreadIdHeader = response.headers.get("X-Thread-ID");
      if (newThreadIdHeader) {
        console.log("New thread created with ID:", newThreadIdHeader);
        setCurrentThreadId(newThreadIdHeader);
      }

      return accumulatedContent;
    },
    onSuccess: () => {
      console.log("Stream finished successfully.");
      setIsTyping(false);
    },
    onError: (error) => {
      console.error("Streaming mutation error:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          content: `Error: ${error.message}`,
          sender: "assistant" as const,
          timestamp: new Date(),
        },
      ]);
    },
  });

  useEffect(() => {
    // Use the already extracted preselectedPublisherIds
    const preselectedPublisherIds = location.state?.preselectedPublisherIds as string[] | undefined;
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
    onPublisherSelect,
  });

  const handleSendMessage = () => {
    if (!inputValue.trim() || streamMutation.isPending) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue("");

    streamMutation.mutate(messageToSend);
  };

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
    <div className="flex gap-4 max-h-[calc(100vh-10rem)] h-full w-full">
      <div className="flex flex-col flex-1 bg-[#F7F7F8]" onClick={focusInput}>
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
