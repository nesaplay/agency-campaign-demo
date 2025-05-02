import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CampaignSummaryPanel from '../CampaignSummaryPanel';
import { useCampaignState } from '../hooks/useCampaignState';
import { useMessageHandlers } from '../hooks/useMessageHandlers';
import { Publisher as ConversationPublisher } from '@/components/network/types';
import { useToast } from "@/hooks/use-toast";
import { mockPublishers } from '@/components/network/mockData';

// Define the expected structure of data coming from the widget
interface WidgetResponse {
  type: 'message' | 'quickReply';
  payload: string | { text: string; value: string };
}

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

  const chatbotContainerRef = useRef<HTMLDivElement>(null);

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
    handleSendMessage,
    handleQuickReply,
    handleAddPublisherToCampaign,
    stepsConfig,
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

  // Callback function for the ChatWidget
  const handleResponseFromWidget = useCallback((response: WidgetResponse) => {
    console.log("Received response from ChatWidget:", response);
    if (response.type === 'message' && typeof response.payload === 'string') {
      handleSendMessage(response.payload); // Use the handler from the hook
    } else if (response.type === 'quickReply' && typeof response.payload === 'object') {
      const { text, value } = response.payload;
      handleQuickReply(text, value); // Use the handler from the hook
    } else {
      console.warn("Received unknown response type from ChatWidget", response);
    }
  }, [handleSendMessage, handleQuickReply]); // Dependencies for the callback

  // Effect to check for ChatWidget availability (Simpler check is okay now)
  const [chatWidgetAvailable, setChatWidgetAvailable] = useState(false);
  useEffect(() => {
    const checkForChatWidget = () => {
        if (typeof window !== "undefined" && window.ChatWidget) {
             console.log("window.ChatWidget found.");
             setChatWidgetAvailable(true); 
             return true; 
        }
        return false;
    };
    if (checkForChatWidget()) return;
    const intervalId = setInterval(() => {
        if (checkForChatWidget()) {
            clearInterval(intervalId);
        }
    }, 500); 
    return () => clearInterval(intervalId);
  }, []); 

  // Effect to initialize widget, send config via DIRECT CALL, and set up callback
  useEffect(() => {
    if (chatWidgetAvailable && window.ChatWidget) {
      try {
        // 1. Initialize widget
        if (typeof window.ChatWidget.init === 'function') {
           console.log("Initializing ChatWidget...");
           window.ChatWidget.init('#sfai-chatbot');
        }

        // 2. Send serializable config data via DIRECT CALL
        if (stepsConfig && typeof window.ChatWidget.sendData === 'function') { 
            console.log("Sending serializable steps config via direct call...");
            const serializableSteps = stepsConfig.map(step => ({
                id: step.id,
                triggers: step.triggers,
                quickReplies: step.quickReplies ? step.quickReplies.map(qr => ({ ...qr })) : undefined,
            }));
            const configData = { 
                type: 'config' as const, // Use 'config' type
                payload: { steps: serializableSteps }
            };
            window.ChatWidget.sendData(configData);
            console.log("Config data sent:", configData);
        } else if (stepsConfig) {
            console.warn("window.ChatWidget.sendData method not found.");
        }

        // 3. Set up callback (remains the same)
        console.log("Assigning callback handler to window.handleChatWidgetResponse");
        window.handleChatWidgetResponse = handleResponseFromWidget;

      } catch (error) {
        console.error("Error interacting with ChatWidget:", error);
      }

      // Cleanup (remains the same)
      return () => {
        console.log("Cleaning up window.handleChatWidgetResponse");
        delete window.handleChatWidgetResponse;
      };
    }
  }, [chatWidgetAvailable, stepsConfig, handleResponseFromWidget]); 

  // Effect to send updated messages list via DIRECT CALL
  useEffect(() => {
    if (chatWidgetAvailable && window.ChatWidget?.sendData && messages.length > 0) { 
       console.log("Messages updated, sending via direct call:", messages);
       try {
           const messagesData = { 
               type: 'messages' as const, // Use 'messages' type
               payload: { messages: messages }
           };
           window.ChatWidget.sendData(messagesData);
       } catch (error) {
           console.error("Failed to send message update via direct call:", error);
       }
    } else if (chatWidgetAvailable && messages.length > 0) {
        console.warn("window.ChatWidget.sendData method not found (for messages).");
    }
  }, [messages, chatWidgetAvailable]);

  return (
    <div className="h-full flex bg-empowerlocal-bg">
      <div className="flex-1 flex flex-col p-4" ref={chatbotContainerRef}>
        <div id="sfai-chatbot" style={{ height: '100%', width: '100%' }} />
        {!chatWidgetAvailable && 
          <div className="flex items-center justify-center h-full text-gray-500">Loading Chat Widget...</div>
        }
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
