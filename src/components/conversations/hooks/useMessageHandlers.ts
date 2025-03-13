
import { useToast } from '@/hooks/use-toast';
import { Publisher, Message as MessageType } from '../types';

interface UseMessageHandlersProps {
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setCampaignStage: React.Dispatch<React.SetStateAction<number>>;
  selectedPublishers: Publisher[];
  setSelectedPublishers: React.Dispatch<React.SetStateAction<Publisher[]>>;
  setCampaignDetails: React.Dispatch<React.SetStateAction<{
    budget: string;
    geography: string;
    timeline: string;
    estimatedReach: string;
  }>>;
  setShowSummaryPanel: React.Dispatch<React.SetStateAction<boolean>>;
  publishers: Publisher[];
  onPublisherSelect?: (publisher: Publisher) => void;
}

export const useMessageHandlers = ({
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
  publishers,
  onPublisherSelect
}: UseMessageHandlersProps) => {
  const { toast } = useToast();

  const handlePublisherSelect = (publisherId: string) => {
    const publisher = publishers.find(p => p.id === publisherId);
    if (publisher) {
      if (onPublisherSelect) {
        onPublisherSelect(publisher);
      } else {
        setSelectedPublishers(prev => [...prev.filter(p => p.id !== publisherId), publisher]);
        toast({
          title: "Publisher details",
          description: "Viewing detailed publisher information",
        });
      }
    }
  };
  
  const handleAddAllPublishers = () => {
    const newPublishers = publishers.filter(
      p => !selectedPublishers.some(sp => sp.id === p.id)
    );
    
    if (newPublishers.length > 0) {
      setSelectedPublishers(prev => [...prev, ...newPublishers]);
      setShowSummaryPanel(true);
    }
  };

  const handleSendMessage = (content: string = inputValue) => {
    if (!content.trim()) return;

    const userMessage: MessageType = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    setIsTyping(true);
    
    setTimeout(() => {
      let response: MessageType;
      
      if (content.includes('Start a new campaign') || content.includes('new campaign')) {
        response = {
          id: (Date.now() + 1).toString(),
          content: "Great! Let's clarify your campaign budget and goals. What's your budget range for this campaign?",
          sender: 'assistant',
          timestamp: new Date(),
          quickReplies: [
            { id: '3', text: 'Under $10,000', value: 'budget-small' },
            { id: '4', text: '$10,000 - $50,000', value: 'budget-medium' },
            { id: '5', text: 'Over $50,000', value: 'budget-large' }
          ]
        };
        setCampaignStage(1);
      } else if (content.includes('$10,000') || content.includes('budget')) {
        setCampaignDetails(prev => ({...prev, budget: '$10,000 - $50,000'}));
        response = {
          id: (Date.now() + 1).toString(),
          content: "Thank you for sharing your budget. Which geographic areas would you like to focus on for your Dr. Bombay ice cream summer campaign?",
          sender: 'assistant',
          timestamp: new Date(),
          quickReplies: [
            { id: '6', text: 'West Coast (CA, AZ, NV)', value: 'west' },
            { id: '7', text: 'East Coast', value: 'east' },
            { id: '8', text: 'Nationwide', value: 'nationwide' }
          ]
        };
        setCampaignStage(2);
      } else if (content.includes('West Coast') || content.includes('geographic')) {
        setCampaignDetails(prev => ({...prev, geography: 'West Coast (CA, AZ, NV)'}));
        response = {
          id: (Date.now() + 1).toString(),
          content: "The West Coast is a great choice for a summer ice cream campaign! Here's our publisher coverage in these areas:",
          sender: 'assistant',
          timestamp: new Date(),
          showMap: true
        };
        setCampaignStage(3);
        
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
        
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setCampaignDetails(prev => ({
              ...prev, 
              timeline: 'June 15 - August 30',
              estimatedReach: '1.97M'
            }));
            
            const recommendationsResponse: MessageType = {
              id: (Date.now() + 2).toString(),
              content: "Based on your budget and geographic focus, I recommend these top-performing publishers for your summer ice cream campaign:",
              sender: 'assistant',
              timestamp: new Date(),
              publishers: publishers,
              quickReplies: [
                { id: '9', text: 'Add all three', value: 'add-all' },
                { id: '10', text: 'See other options', value: 'more-options' },
                { id: '11', text: 'View campaign summary', value: 'view-summary' }
              ]
            };
            setMessages(prev => [...prev, recommendationsResponse]);
            setIsTyping(false);
            
            setTimeout(() => {
              setShowSummaryPanel(true);
            }, 1000);
            
          }, 1500);
        }, 3000);
        
        return;
      } else if (content.includes('Add all three') || content.includes('add all')) {
        handleAddAllPublishers();
        response = {
          id: (Date.now() + 1).toString(),
          content: "Great! I've added all three publishers to your campaign. Would you like to review your campaign summary or proceed to the next step?",
          sender: 'assistant',
          timestamp: new Date(),
          quickReplies: [
            { id: '12', text: 'Review summary', value: 'review-summary' },
            { id: '13', text: 'Proceed to creative options', value: 'creative' }
          ]
        };
        setCampaignStage(4);
      } else if (content.includes('View campaign summary') || content.includes('Review summary')) {
        setShowSummaryPanel(true);
        response = {
          id: (Date.now() + 1).toString(),
          content: "Here's your campaign summary. You can continue to refine it or proceed to the next step when you're ready.",
          sender: 'assistant',
          timestamp: new Date(),
          quickReplies: [
            { id: '14', text: 'Proceed to creative options', value: 'creative' },
            { id: '15', text: 'Adjust publisher selection', value: 'adjust' }
          ]
        };
      } else {
        response = {
          id: (Date.now() + 1).toString(),
          content: "I understand you're interested in creating a campaign for Dr. Bombay ice cream. Could you tell me more about your specific needs?",
          sender: 'assistant',
          timestamp: new Date()
        };
      }
      
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (text: string, value: string) => {
    if (value === 'add-all') {
      handleAddAllPublishers();
    } else if (value === 'view-summary' || value === 'review-summary') {
      setShowSummaryPanel(true);
    }
    
    handleSendMessage(text);
  };

  const handleFeedback = (messageId: string, isPositive: boolean) => {
    console.log(`Feedback for message ${messageId}: ${isPositive ? 'positive' : 'negative'}`);
    toast({
      title: isPositive ? "Thanks for your feedback" : "We'll improve this response",
      description: isPositive ? "Your feedback helps us improve Lassie" : "We'll use your feedback to make Lassie better",
    });
  };

  return {
    handlePublisherSelect,
    handleAddAllPublishers,
    handleSendMessage,
    handleQuickReply,
    handleFeedback
  };
};
