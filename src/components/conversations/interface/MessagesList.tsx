import React, { useRef, useEffect } from 'react';
import { CircleEllipsis } from 'lucide-react';
import { motion } from 'framer-motion';
import Message from '../Message';
import { Message as MessageType } from '../types';
import { StateSelector } from './StateSelector';
import { useCampaignState } from '../hooks/useCampaignState';

interface MessagesListProps {
  messages: MessageType[];
  isTyping: boolean;
  onFeedback: (messageId: string, isPositive: boolean) => void;
  onQuickReply: (text: string, value: string) => void;
  onPublisherSelect: (publisherId: string) => void;
  onAddAllPublishers: () => void;
  onAddPublisherToCampaign: (publisherId: string) => void;
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  isTyping,
  onFeedback,
  onQuickReply,
  onPublisherSelect,
  onAddAllPublishers,
  onAddPublisherToCampaign,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { campaignStage, setCampaignStage } = useCampaignState();
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const quickReplies = [
    { id: '1', text: 'Start a new campaign', value: 'new' },
    { id: '2', text: 'Work on an existing campaign', value: 'existing' }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F7F8] rounded-lg p-6 h-full">
      <div className="space-y-6 pb-2">
        {messages.map((message, idx) => (
          <React.Fragment key={message.id}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message.selectGeography ? (
                <div className="flex items-start gap-3 max-w-3xl">
                  <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-800 mb-2 font-serif" style={{ fontFamily: 'DM Serif Display, Playfair Display, Georgia, Times, serif' }}>{message.content}</p>
                    <StateSelector onSelect={message.selectGeography.onSelect} />
                  </div>
                </div>
              ) : (
                <Message 
                  message={message}
                  onFeedback={onFeedback}
                  onQuickReply={onQuickReply}
                  onPublisherSelect={onPublisherSelect}
                  onAddAllPublishers={onAddAllPublishers}
                  onAddPublisherToCampaign={onAddPublisherToCampaign}
                />
              )}
            </motion.div>
            {message.sender === 'assistant' && campaignStage === 0 && (
              <div className="flex gap-2 mt-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply.id}
                    className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-serif text-gray-700 hover:bg-[#F7F7F8] transition"
                    style={{ fontFamily: 'DM Serif Display, Playfair Display, Georgia, Times, serif' }}
                    onClick={() => {
                      setCampaignStage(1);
                      onQuickReply(reply.text, reply.value);
                    }}
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 mt-2">
            <CircleEllipsis className="animate-pulse text-[#E16A3D]" />
            <span className="text-sm text-gray-500 font-serif" style={{ fontFamily: 'DM Serif Display, Playfair Display, Georgia, Times, serif' }}>Lassie is typing…</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessagesList;
