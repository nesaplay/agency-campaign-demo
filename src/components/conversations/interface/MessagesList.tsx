
import React, { useRef, useEffect } from 'react';
import { CircleEllipsis } from 'lucide-react';
import { motion } from 'framer-motion';
import Message from '../Message';
import { Message as MessageType } from '../types';

interface MessagesListProps {
  messages: MessageType[];
  isTyping: boolean;
  onFeedback: (messageId: string, isPositive: boolean) => void;
  onQuickReply: (text: string, value: string) => void;
  onPublisherSelect: (publisherId: string) => void;
  onAddAllPublishers: () => void;
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  isTyping,
  onFeedback,
  onQuickReply,
  onPublisherSelect,
  onAddAllPublishers
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
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
              onFeedback={onFeedback}
              onQuickReply={onQuickReply}
              onPublisherSelect={onPublisherSelect}
              onAddAllPublishers={onAddAllPublishers}
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
  );
};

export default MessagesList;
