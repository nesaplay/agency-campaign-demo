
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Info, X, MessageCircle, Map, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import QuickReply from './QuickReply';
import PublisherCard from './PublisherCard';
import PublisherMap from './PublisherMap';
import { Message as MessageType } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface MessageProps {
  message: MessageType;
  onFeedback: (messageId: string, isPositive: boolean) => void;
  onQuickReply: (text: string, value: string) => void;
  onPublisherSelect?: (publisherId: string) => void;
  onAddAllPublishers?: () => void;
}

const Message: React.FC<MessageProps> = ({ 
  message, 
  onFeedback, 
  onQuickReply, 
  onPublisherSelect,
  onAddAllPublishers
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null);
  const [selectedView, setSelectedView] = useState<'map' | 'list'>('map');
  const [showInsight, setShowInsight] = useState(false);
  const { toast } = useToast();
  
  const handleFeedback = (isPositive: boolean) => {
    if (feedbackGiven) return;
    onFeedback(message.id, isPositive);
    setFeedbackGiven(isPositive ? 'positive' : 'negative');
  };
  
  const handlePublisherCardClick = (publisherId: string) => {
    if (onPublisherSelect) {
      onPublisherSelect(publisherId);
      toast({
        title: "Publisher details",
        description: "Viewing detailed publisher information",
      });
    }
  };
  
  const handleAddAll = () => {
    if (onAddAllPublishers) {
      onAddAllPublishers();
      toast({
        title: "Publishers added",
        description: "All recommended publishers have been added to your campaign",
      });
    }
  };
  
  const isAssistant = message.sender === 'assistant';
  
  // Contextual insights based on conversation content
  const getContextualInsight = () => {
    if (message.content.includes('ice cream') || message.content.includes('summer')) {
      return "Summer ice cream campaigns perform best when launched 2-3 weeks before seasonal temperature increases. Consider starting in late April or early May for maximum impact.";
    }
    
    if (message.content.includes('budget') || message.content.includes('$10,000')) {
      return "Similar campaigns in this budget range typically allocate 60% to premium publishers and 40% to mid-tier publishers for optimal reach/engagement balance.";
    }
    
    if (message.content.includes('West Coast')) {
      return "West Coast markets show 28% higher engagement for food and beverage campaigns during summer months compared to national averages.";
    }
    
    return "Based on similar campaigns, we recommend including a mix of lifestyle and news publishers for optimal audience reach.";
  };
  
  return (
    <div className={cn(
      "flex items-start gap-3",
      isAssistant ? "justify-start" : "justify-end"
    )}>
      <div className={cn(
        "max-w-3xl space-y-2",
        isAssistant ? "bg-gradient-to-r from-[#f0f7ff] to-[#e6f0ff] rounded-2xl rounded-tl-none p-4 shadow-sm" :
        "bg-white border border-gray-200 rounded-2xl rounded-tr-none p-4 shadow-sm"
      )}>
        <div className="text-gray-800">
          {message.content}
        </div>
        
        {isAssistant && message.content.includes('campaign') && (
          <div className="mt-2 pt-2 border-t border-gray-200/50">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setShowInsight(!showInsight)}
                className="flex items-center gap-1.5 text-xs text-empowerlocal-blue font-medium hover:underline"
              >
                <Info className="h-3.5 w-3.5" />
                Campaign Insight
              </button>
              
              {showInsight && (
                <button 
                  onClick={() => setShowInsight(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-gray-500" />
                </button>
              )}
            </div>
            
            <AnimatePresence>
              {showInsight && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded-md text-xs text-blue-700">
                    {getContextualInsight()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        
        {message.showMap && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-empowerlocal-navy">Publisher Coverage</h4>
              <div className="flex items-center bg-gray-100 rounded-md p-0.5">
                <button 
                  className={`px-2 py-1 text-xs rounded ${selectedView === 'map' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setSelectedView('map')}
                >
                  <span className="flex items-center gap-1">
                    <Map className="h-3 w-3" />
                    Map
                  </span>
                </button>
                <button 
                  className={`px-2 py-1 text-xs rounded ${selectedView === 'list' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setSelectedView('list')}
                >
                  <span className="flex items-center gap-1">
                    <List className="h-3 w-3" />
                    List
                  </span>
                </button>
              </div>
            </div>
            
            {selectedView === 'map' ? (
              <PublisherMap />
            ) : (
              <div className="border border-gray-200 rounded-md p-3 bg-white">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 pb-2 border-b border-gray-100">
                    <span>Publisher</span>
                    <span>Area</span>
                    <span>Coverage</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Los Angeles</span>
                    <span>Southern CA</span>
                    <span className="text-blue-600 font-medium">8 publishers</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Phoenix</span>
                    <span>Arizona</span>
                    <span className="text-green-600 font-medium">5 publishers</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">San Diego</span>
                    <span>Southern CA</span>
                    <span className="text-purple-600 font-medium">3 publishers</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {message.publishers && (
          <div className="mt-4">
            <div className="flex flex-col space-y-4">
              <div className="flex overflow-x-auto space-x-4 pb-2 -mx-2 px-2">
                {message.publishers.map(publisher => (
                  <div 
                    key={publisher.id} 
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() => handlePublisherCardClick(publisher.id)}
                  >
                    <PublisherCard key={publisher.id} publisher={publisher} />
                  </div>
                ))}
              </div>
              
              {message.publishers.length > 0 && (
                <button
                  onClick={handleAddAll}
                  className="w-full bg-gradient-to-r from-empowerlocal-blue to-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:from-empowerlocal-navy hover:to-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Add all {message.publishers.length} publishers</span>
                </button>
              )}
            </div>
          </div>
        )}
        
        {message.quickReplies && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.quickReplies.map(reply => (
              <QuickReply 
                key={reply.id} 
                text={reply.text} 
                onClick={() => onQuickReply(reply.text, reply.value)} 
              />
            ))}
          </div>
        )}
        
        {isAssistant && (
          <div className="flex items-center gap-2 mt-2">
            <button 
              onClick={() => handleFeedback(true)}
              className={cn(
                "p-1.5 rounded-full border border-transparent transition-all duration-150",
                feedbackGiven === 'positive' 
                  ? "bg-green-100 border-green-200 text-green-700" 
                  : "text-gray-400 hover:bg-gray-100"
              )}
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleFeedback(false)}
              className={cn(
                "p-1.5 rounded-full border border-transparent transition-all duration-150",
                feedbackGiven === 'negative' 
                  ? "bg-red-100 border-red-200 text-red-700" 
                  : "text-gray-400 hover:bg-gray-100"
              )}
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
            
            <span className="flex-1"></span>
            
            <button 
              className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-empowerlocal-blue rounded-full transition-colors"
              title="Ask follow-up"
              onClick={() => toast({
                title: "Ask a follow-up",
                description: "Type your question in the input field below",
              })}
            >
              <MessageCircle className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
