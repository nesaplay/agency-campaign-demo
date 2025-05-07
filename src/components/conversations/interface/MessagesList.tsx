import React, { useRef, useEffect } from 'react';
import { CircleEllipsis, MapPin, Star, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Message } from '../types';
import { Publisher } from '@/components/network/types';
import { MessageContent } from './ConversationInterface';
import { StateSelector } from './StateSelector';
import { useCampaignState } from '../hooks/useCampaignState';
import PublisherMap from '../PublisherMap';
import PublisherCard from '@/components/network/PublisherCard';
import { Button } from '@/components/ui/button';

interface MessagesListProps {
  messages: Message[];
  isTyping: boolean;
  onFeedback: (messageId: string, isPositive: boolean) => void;
  onQuickReply: (text: string, value: string, isKeywordTrigger?: boolean) => void;
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

  const initialQuickReplies = [
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
              ) : message.showMap ? (
                <div className="flex items-start gap-3 max-w-3xl">
                  <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-800 mb-2 font-serif" style={{ fontFamily: 'DM Serif Display, Playfair Display, Georgia, Times, serif' }}>{message.content}</p>
                    <div className="relative z-0">
                      <PublisherMap 
                        state={message.state} 
                        publishers={message.publishers || []} 
                        onPublisherSelect={onPublisherSelect}
                        onAddPublisherToCampaign={onAddPublisherToCampaign}
                      />
                    </div>
                  </div>
                </div>
              ) : message.publishers ? (
                <div className="flex items-start gap-3 max-w-3xl">
                  <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-800 mb-2 font-serif" style={{ fontFamily: 'DM Serif Display, Playfair Display, Georgia, Times, serif' }}>{message.content}</p>
                    <div className="overflow-x-auto pb-4 -mx-4 px-4 max-w-[calc(100vw-800px)]">
                      <div className="flex gap-4 min-w-min">
                        {message.publishers.map((publisher) => (
                          <PublisherCard
                            key={publisher.id}
                            publisher={publisher}
                            onClick={() => onPublisherSelect(publisher.id)}
                            onAddToCampaign={() => onAddPublisherToCampaign(publisher.id)}
                            // onViewDetails={() => onPublisherSelect(publisher.id)}
                          />
                        ))}
                      </div>
                    </div>
                    {message.showAddPublisherButton && (
                      <button
                        onClick={onAddAllPublishers}
                        className="mt-4 px-4 py-2 bg-[#E16A3D] text-white rounded-full text-sm font-serif hover:bg-[#d15a2d] transition"
                        style={{ fontFamily: 'DM Serif Display, Playfair Display, Georgia, Times, serif' }}
                      >
                        Add all publishers
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className={`flex ${message.sender === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-2xl rounded-lg p-3 ${
                      message.sender === 'assistant'
                        ? 'bg-white border border-gray-100'
                        : 'bg-[#F7F7F8] border border-gray-200'
                    }`}
                  >
                    <MessageContent content={String(message.content)} isAssistant={message.sender === 'assistant'} />
                  </div>
                </div>
              )}
            </motion.div>
            {message.sender === 'assistant' && (
              (message.quickReplies ? (
                <div className="flex gap-2 mt-2">
                  {message.quickReplies.map((reply) => (
                    <button
                      key={reply.id}
                      className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-serif text-gray-700 hover:bg-[#F7F7F8] transition"
                      style={{ fontFamily: 'DM Serif Display, Playfair Display, Georgia, Times, serif' }}
                      onClick={() => {
                        if (message.id === 'start_campaign') {
                          setCampaignStage(1);
                        }
                        onQuickReply(reply.text, reply.value);
                      }}
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              ) : campaignStage === 0 && (
                <div className="flex gap-2 mt-2">
                  {initialQuickReplies.map((reply) => (
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
              ))
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
