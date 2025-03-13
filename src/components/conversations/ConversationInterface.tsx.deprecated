import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, CircleEllipsis, Upload, PlusCircle, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import Message from './Message';
import QuickReply from './QuickReply';
import PublisherCard from './PublisherCard';
import PublisherMap from './PublisherMap';
import CampaignSummaryPanel from './CampaignSummaryPanel';
import { Message as MessageType, Publisher } from './types';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ConversationInterfaceProps {
  onPublisherSelect?: (publisher: Publisher) => void;
}

const ConversationInterface: React.FC<ConversationInterfaceProps> = ({ onPublisherSelect }) => {
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
  const [campaignStage, setCampaignStage] = useState<number>(0);
  const [showSummaryPanel, setShowSummaryPanel] = useState(false);
  const [selectedPublishers, setSelectedPublishers] = useState<Publisher[]>([]);
  const [campaignDetails, setCampaignDetails] = useState({
    budget: '',
    geography: '',
    timeline: '',
    estimatedReach: ''
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const publishers: Publisher[] = [
    {
      id: '1',
      name: 'Phoenix Sun',
      image: '/placeholder.svg',
      location: 'Phoenix, AZ',
      reach: '450K',
      rating: 4.8
    },
    {
      id: '2',
      name: 'LA Weekly',
      image: '/placeholder.svg',
      location: 'Los Angeles, CA',
      reach: '1.2M',
      rating: 4.7
    },
    {
      id: '3',
      name: 'West Coast Lifestyle',
      image: '/placeholder.svg',
      location: 'San Diego, CA',
      reach: '320K',
      rating: 4.5
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

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

  const focusInput = () => {
    inputRef.current?.focus();
  };
  
  const handleUploadFile = () => {
    toast({
      title: "File upload",
      description: "File upload functionality will be implemented soon",
    });
  };

  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col" onClick={focusInput}>
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
        
        <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4">
          <div className="space-y-4 pb-2">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Message 
                  message={message}
                  onFeedback={handleFeedback}
                  onQuickReply={handleQuickReply}
                  onPublisherSelect={handlePublisherSelect}
                  onAddAllPublishers={handleAddAllPublishers}
                />
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 max-w-3xl"
              >
                <div className="bg-gradient-to-r from-[#f0f7ff] to-[#e6f0ff] rounded-2xl rounded-tl-none p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <CircleEllipsis className="h-5 w-5 text-empowerlocal-blue animate-pulse" />
                    <span className="text-gray-500">Lassie is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-gray-200">
          <button
            onClick={handleUploadFile}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Upload a file"
          >
            <Upload className="h-5 w-5" />
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message or ask a question..."
            className="flex-1 bg-transparent outline-none border-none"
          />
          
          <button 
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim()}
            className={cn(
              "p-2 rounded-full",
              inputValue.trim() 
                ? "bg-empowerlocal-blue text-white hover:bg-blue-600" 
                : "bg-gray-100 text-gray-400"
            )}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
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
