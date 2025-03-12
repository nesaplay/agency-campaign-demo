
import React, { useState, useRef, useEffect } from 'react';
import { Send, ThumbsUp, ThumbsDown, Bot, CircleEllipsis } from 'lucide-react';
import { cn } from '@/lib/utils';
import Message from './Message';
import QuickReply from './QuickReply';
import PublisherCard from './PublisherCard';
import PublisherMap from './PublisherMap';
import { Message as MessageType, Publisher } from './types';

const ConversationInterface: React.FC = () => {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sample publishers data
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

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = (content: string = inputValue) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate Lassie thinking
    setIsTyping(true);
    
    // Process response based on conversation flow
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
      } else if (content.includes('$10,000') || content.includes('budget')) {
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
      } else if (content.includes('West Coast') || content.includes('geographic')) {
        response = {
          id: (Date.now() + 1).toString(),
          content: "The West Coast is a great choice for a summer ice cream campaign! Here's our publisher coverage in these areas:",
          sender: 'assistant',
          timestamp: new Date(),
          showMap: true
        };
        
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
        
        // Add a follow-up message with publisher recommendations after showing the map
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            const recommendationsResponse: MessageType = {
              id: (Date.now() + 2).toString(),
              content: "Based on your budget and geographic focus, I recommend these top-performing publishers for your summer ice cream campaign:",
              sender: 'assistant',
              timestamp: new Date(),
              publishers: publishers,
              quickReplies: [
                { id: '9', text: 'Add all three', value: 'add-all' },
                { id: '10', text: 'See other options', value: 'more-options' }
              ]
            };
            setMessages(prev => [...prev, recommendationsResponse]);
            setIsTyping(false);
          }, 1500);
        }, 3000);
        
        return;
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
    handleSendMessage(text);
  };

  const handleFeedback = (messageId: string, isPositive: boolean) => {
    console.log(`Feedback for message ${messageId}: ${isPositive ? 'positive' : 'negative'}`);
    // Here you would typically send this feedback to your backend
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="h-full flex flex-col" onClick={focusInput}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-empowerlocal-blue" />
          <h1 className="text-xl font-semibold text-empowerlocal-navy">Lassie AI Assistant</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4">
        <div className="space-y-4 pb-2">
          {messages.map((message) => (
            <Message 
              key={message.id}
              message={message}
              onFeedback={handleFeedback}
              onQuickReply={handleQuickReply}
            />
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-3 max-w-3xl">
              <div className="bg-gradient-to-r from-[#f0f7ff] to-[#e6f0ff] rounded-2xl rounded-tl-none p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <CircleEllipsis className="h-5 w-5 text-empowerlocal-blue animate-pulse" />
                  <span className="text-gray-500">Lassie is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-gray-200">
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
  );
};

export default ConversationInterface;
