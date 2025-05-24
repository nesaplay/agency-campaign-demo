import { useState, useEffect, useRef } from 'react';
import { Message as MessageType } from '../types';
import { Publisher } from '@/components/network/types';
import { useBrand } from '@/components/brands/BrandContext';
import { Brand } from '@/components/brands/types';

interface CampaignDetails {
  budget: string;
  geography: string;
  timeline: string;
  estimatedReach: string;
}

// Define the type for initial context
interface InitialStateContext {
    preselectedPublisherIds?: string[];
}

const defaultWelcomeMessage: MessageType = {
    id: '1', // Keep original ID or use a new unique one like 'default_welcome'
    content: "Hello! I'm Lassie, your campaign building assistant. How can I help you today?",
    sender: 'assistant',
    timestamp: new Date(),
    quickReplies: [
      { id: '1', text: 'Start a new campaign', value: 'new' },
      { id: '2', text: 'Work on an existing campaign', value: 'existing' }
    ]
};

// --- Function to generate the dynamic recommendation prompt ---
const createRecommendationPrompt = (brandName: string): MessageType => ({
    id: 'recommend_prompt',
    content: `Greeting Jane, Would you like to build a campaign?`,
    sender: 'assistant',
    timestamp: new Date(),
});
// --- End function ---

export const useCampaignState = (initialContext?: InitialStateContext) => {
  const { activeBrand } = useBrand();
  // console.log('[useCampaignState] Active brand from context:', activeBrand?.name); // Optional logging

  const [campaignStage, setCampaignStage] = useState<number>(0);
  const [showSummaryPanel, setShowSummaryPanel] = useState(true);
  const [selectedPublishers, setSelectedPublishers] = useState<Publisher[]>([]);
  const [campaignDetails, setCampaignDetails] = useState<CampaignDetails>({
    budget: '',
    geography: '',
    timeline: '',
    estimatedReach: ''
  });

  // Conditionally build initial messages
  const getInitialMessages = (): MessageType[] => {
      const initialMessages: MessageType[] = [];
      // Check if a brand is selected
      if (activeBrand) {
          // Adjust timestamp slightly so it appears just before the default welcome
          const promptTimestamp = new Date();
          promptTimestamp.setMilliseconds(promptTimestamp.getMilliseconds() - 1);
          initialMessages.push(createRecommendationPrompt(activeBrand.name)); // Generate dynamic message
      } else {
          console.log('[useCampaignState] No active brand from context: Adding default welcome message.');
          initialMessages.push(defaultWelcomeMessage);
      }
      // console.log('[useCampaignState] Final initial messages:', initialMessages); // <-- Remove log
      return initialMessages;
  };

  const [messages, setMessages] = useState<MessageType[]>(getInitialMessages());

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // --- Effect to handle dynamic brand changes ---
  const prevActiveBrandRef = useRef(activeBrand); // Initialize ref with brand from context

  useEffect(() => {
    const currentActiveBrand = activeBrand; // Use brand from context
    const prevActiveBrand = prevActiveBrandRef.current;

    // Check if brand actually changed
    if (currentActiveBrand?.id !== prevActiveBrand?.id) {
        console.log('[useCampaignState Effect] Active brand changed from', prevActiveBrand?.name, 'to', currentActiveBrand?.name);
    }
    // Update the ref for the next render
    prevActiveBrandRef.current = currentActiveBrand;
  }, [activeBrand]); // <-- Dependency is now directly on activeBrand from context

  return {
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
  };
};
