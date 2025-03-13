
import { useState } from 'react';
import { Publisher, Message as MessageType } from '../types';

interface CampaignDetails {
  budget: string;
  geography: string;
  timeline: string;
  estimatedReach: string;
}

export const useCampaignState = () => {
  const [campaignStage, setCampaignStage] = useState<number>(0);
  const [showSummaryPanel, setShowSummaryPanel] = useState(false);
  const [selectedPublishers, setSelectedPublishers] = useState<Publisher[]>([]);
  const [campaignDetails, setCampaignDetails] = useState<CampaignDetails>({
    budget: '',
    geography: '',
    timeline: '',
    estimatedReach: ''
  });

  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      content: "Hello! I'm Lassie, your campaign building assistant. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date(),
      quickReplies: [
        { id: '1', text: 'Start a new campaign', value: 'new' },
        { id: '2', text: 'Work on an existing campaign', value: 'existing' }
      ]
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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
