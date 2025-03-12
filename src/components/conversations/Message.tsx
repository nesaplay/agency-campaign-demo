
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import QuickReply from './QuickReply';
import PublisherCard from './PublisherCard';
import PublisherMap from './PublisherMap';
import { Message as MessageType } from './types';

interface MessageProps {
  message: MessageType;
  onFeedback: (messageId: string, isPositive: boolean) => void;
  onQuickReply: (text: string, value: string) => void;
}

const Message: React.FC<MessageProps> = ({ message, onFeedback, onQuickReply }) => {
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null);
  
  const handleFeedback = (isPositive: boolean) => {
    if (feedbackGiven) return;
    onFeedback(message.id, isPositive);
    setFeedbackGiven(isPositive ? 'positive' : 'negative');
  };
  
  const isAssistant = message.sender === 'assistant';
  
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
        
        {message.showMap && <PublisherMap />}
        
        {message.publishers && (
          <div className="mt-4">
            <div className="flex overflow-x-auto space-x-4 pb-2 -mx-2 px-2">
              {message.publishers.map(publisher => (
                <PublisherCard key={publisher.id} publisher={publisher} />
              ))}
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
                "text-gray-400 hover:text-green-500 p-1 rounded",
                feedbackGiven === 'positive' && "text-green-500"
              )}
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleFeedback(false)}
              className={cn(
                "text-gray-400 hover:text-red-500 p-1 rounded",
                feedbackGiven === 'negative' && "text-red-500"
              )}
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
