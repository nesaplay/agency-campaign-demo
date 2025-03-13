
import React, { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import { Publisher } from '../types';

interface LassieChatPanelProps {
  publisher: Publisher;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const LassieChatPanel: React.FC<LassieChatPanelProps> = ({ publisher }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi there! I'm Lassie, your AI assistant. Ask me anything about ${publisher.name} or how they might fit into your campaigns.`,
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      let responseText = '';
      
      if (input.toLowerCase().includes('audience')) {
        responseText = `${publisher.name}'s audience is primarily composed of local residents aged 35-54 with higher-than-average household incomes. They show strong engagement with content related to local events, dining, and community news.`;
      } else if (input.toLowerCase().includes('performance') || input.toLowerCase().includes('metrics')) {
        responseText = `This publisher has a ${publisher.performance.toLowerCase()} performance rating with ${publisher.engagement} engagement metrics. Their CPM of ${publisher.cpm} is competitive for their market size and audience quality.`;
      } else if (input.toLowerCase().includes('recommend') || input.toLowerCase().includes('suggest')) {
        responseText = `Based on your campaign goals, I'd recommend considering their newsletter placements paired with sponsored content. This publisher performs particularly well for clients in the retail, dining, and professional services sectors.`;
      } else if (input.toLowerCase().includes('compare')) {
        responseText = `Compared to similar publishers in this region, ${publisher.name} offers better-than-average engagement rates but slightly higher CPMs. Their audience demographics skew slightly older and more affluent than the market average.`;
      } else {
        responseText = `${publisher.name} is a ${publisher.performance.toLowerCase()}-performing publisher in ${publisher.location} focusing on ${publisher.categories.slice(0, 3).join(', ')} content. They have ${publisher.subscribers} subscribers with ${publisher.engagement} engagement rates and offer various ad formats at a ${publisher.cpm} average CPM.`;
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Sample quick suggestions
  const quickSuggestions = [
    "How does their audience compare to others?",
    "What ad formats perform best here?",
    "Recommend similar publishers",
    "What makes this publisher unique?"
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-empowerlocal-blue flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-medium">Lassie AI Assistant</h3>
          <p className="text-xs text-gray-500">Ask about this publisher</p>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map(message => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.sender === 'user' 
                    ? 'bg-empowerlocal-blue text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 rounded-tl-none'
                }`}
              >
                {message.sender === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-xs font-medium text-empowerlocal-blue">Lassie AI</span>
                  </div>
                )}
                <p className={`text-sm ${message.sender === 'user' ? 'text-white' : 'text-gray-800'}`}>
                  {message.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-200 bg-white">
        {messages.length < 3 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
                onClick={() => {
                  setInput(suggestion);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about ${publisher.name}...`}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-empowerlocal-blue focus:outline-none resize-none"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className={`p-3 rounded-full ${
              input.trim() 
                ? 'bg-empowerlocal-blue text-white hover:bg-empowerlocal-navy' 
                : 'bg-gray-100 text-gray-400'
            } transition-colors`}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LassieChatPanel;
