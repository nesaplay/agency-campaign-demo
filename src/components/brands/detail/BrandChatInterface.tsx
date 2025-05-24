import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Message } from '@/components/conversations/types';
import { Brand } from '@/components/brands/types';
import { PerformanceMetricProps } from '@/components/brands/context-module/types';
import { useToast } from '@/hooks/use-toast';
import { Send, Upload, ThumbsUp, ThumbsDown, MessageCircle, X, Paperclip, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CHAT_STREAM_SUPABASE_EDGE_URL, SUPABASE_ASSISTANT_ID } from "@/lib/constants";

interface BrandChatInterfaceProps {
  brand: Brand;
  onBrandEdit: (brandId: string, field: keyof Brand, value: Brand[keyof Brand]) => void;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  file: File;
}

interface BrandMetrics {
  targetAudience: {
    primary: string;
    interests: string[];
    locations: string[];
  };
  objectives: string[];
  performance: PerformanceMetricProps[];
}

const BrandMessage: React.FC<{
  message: Message;
  onFeedback: (messageId: string, isPositive: boolean) => void;
}> = ({ message, onFeedback }) => {
  const [feedbackGiven, setFeedbackGiven] = useState<"positive" | "negative" | null>(null);
  const isAssistant = message.sender === "assistant";

  const handleFeedback = (isPositive: boolean) => {
    if (feedbackGiven) return;
    onFeedback(message.id, isPositive);
    setFeedbackGiven(isPositive ? "positive" : "negative");
  };

  return (
    <div className={cn("flex items-start gap-2", isAssistant ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-2xl space-y-1",
          isAssistant
            ? "bg-white rounded-xl rounded-tl-none p-2.5 shadow-sm border border-gray-100"
            : "bg-[#F7F7F8] border border-gray-200 rounded-xl rounded-tr-none p-2.5 shadow-sm",
        )}
      >
        <div
          style={{ fontWeight: 300 }}
          className={cn(
            isAssistant ? "text-gray-800 font-serif" : "text-gray-900 font-sans",
            "prose prose-sm max-w-none",
            "prose-headings:font-serif",
            "prose-p:my-1",
            "prose-ul:my-1",
            "prose-ol:my-1",
            "prose-li:my-0.5",
            "prose-blockquote:my-1",
            "[&_p]:text-sm",
            "[&_h1]:text-sm [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:font-medium",
            "[&_h2]:text-sm [&_h2]:mt-3 [&_h2]:mb-2 [&_h2]:font-medium",
            "[&_h3]:text-sm [&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:font-medium",
            "[&_h4]:text-sm [&_h4]:mt-2.5 [&_h4]:mb-1.5 [&_h4]:font-medium",
            "[&_h5]:text-sm [&_h5]:mt-2 [&_h5]:mb-1 [&_h5]:font-medium",
            "[&_h6]:text-sm [&_h6]:mt-2 [&_h6]:mb-1 [&_h6]:font-medium",
            "[&_ul]:text-sm",
            "[&_ol]:text-sm",
            "[&_li]:text-sm",
            "[&_blockquote]:text-sm",
            "[&_a]:text-sm"
          )}
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ children, ...props }: { children: ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
                <a {...props} className="text-empowerlocal-blue hover:underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              code: ({ children, className, ...props }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLElement>) => {
                const match = /language-(\w+)/.exec(className || '');
                return !match ? (
                  <code {...props} className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                    {children}
                  </code>
                ) : (
                  <code {...props} className="block bg-gray-100 p-2 rounded text-sm my-1">
                    {children}
                  </code>
                );
              },
              blockquote: ({ children, ...props }: { children: ReactNode } & React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
                <blockquote {...props} className="border-l-2 border-gray-300 pl-2 italic text-gray-600 text-sm">
                  {children}
                </blockquote>
              ),
              ul: ({ children, ...props }: { children: ReactNode } & React.HTMLAttributes<HTMLUListElement>) => (
                <ul {...props} className="list-disc pl-3 space-y-0.5 text-sm">
                  {children}
                </ul>
              ),
              ol: ({ children, ...props }: { children: ReactNode } & React.HTMLAttributes<HTMLOListElement>) => (
                <ol {...props} className="list-decimal pl-3 space-y-0.5 text-sm">
                  {children}
                </ol>
              ),
            }}
          >
            {String(message.content)}
          </ReactMarkdown>
        </div>

        {isAssistant && (
          <div className="flex items-center gap-1.5 mt-1">
            <button
              onClick={() => handleFeedback(true)}
              className={cn(
                "p-1 rounded-full border border-transparent transition-all duration-150",
                feedbackGiven === "positive"
                  ? "bg-green-100 border-green-200 text-green-700"
                  : "text-gray-400 hover:bg-gray-100",
              )}
            >
              <ThumbsUp className="h-3 w-3" />
            </button>
            <button
              onClick={() => handleFeedback(false)}
              className={cn(
                "p-1 rounded-full border border-transparent transition-all duration-150",
                feedbackGiven === "negative"
                  ? "bg-red-100 border-red-200 text-red-700"
                  : "text-gray-400 hover:bg-gray-100",
              )}
            >
              <ThumbsDown className="h-3 w-3" />
            </button>

            <span className="flex-1"></span>

            <button
              className="p-1 text-gray-400 hover:bg-gray-100 hover:text-empowerlocal-blue rounded-full transition-colors"
              title="Ask follow-up"
            >
              <MessageCircle className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const BrandMessageInput: React.FC<{
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  attachments: Attachment[];
  onAttachmentAdd: (files: File[]) => void;
  onAttachmentRemove: (id: string) => void;
}> = ({ 
  inputValue, 
  setInputValue, 
  handleSendMessage, 
  attachments,
  onAttachmentAdd,
  onAttachmentRemove 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onAttachmentAdd(files);
    }
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-200 text-xs"
            >
              <Paperclip className="h-3 w-3 text-gray-500" />
              <span className="text-gray-700">{attachment.name}</span>
              <span className="text-gray-500">({formatFileSize(attachment.size)})</span>
              <button
                onClick={() => onAttachmentRemove(attachment.id)}
                className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-3 w-3 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-1.5 bg-white rounded-lg p-2 border border-gray-200">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          title="Add attachments"
        >
          <Upload className="h-4 w-4" />
        </button>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message or ask a question..."
          className="flex-1 bg-transparent outline-none border-none text-sm"
        />
        
        <button 
          onClick={handleSendMessage}
          disabled={!inputValue.trim() && attachments.length === 0}
          className={cn(
            "p-1.5 rounded-full",
            (inputValue.trim() || attachments.length > 0)
              ? "bg-empowerlocal-gold text-white hover:bg-amber-600" 
              : "bg-gray-100 text-gray-400"
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const ThinkingLoader: React.FC = () => (
  <div className="flex items-center gap-1.5 mt-1">
    <div className="flex items-center gap-1">
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100" />
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200" />
    </div>
  </div>
);

const HelpTooltip: React.FC = () => {
  const commands = [
    {
      category: "Audience",
      commands: [
        "Set primary audience: 'Set audience to [group]'",
        "Add interest: 'Add [interest] to interests'",
        "Remove interest: 'Remove [interest] from interests'",
        "Add location: 'Add [location] to locations'",
        "Remove location: 'Remove [location] from locations'"
      ]
    },
    {
      category: "Objectives",
      commands: [
        "Add objective: 'Add [objective] to objectives'",
        "Remove objective: 'Remove [objective] from objectives'"
      ]
    },
    {
      category: "Attachments",
      commands: [
        "Upload files using the paperclip icon",
        "Download files from the attachments section",
        "Remove files from the attachments section"
      ]
    }
  ];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="p-1.5 text-gray-400 hover:text-empowerlocal-blue hover:bg-gray-100 rounded-full transition-colors">
            <HelpCircle className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="w-80 p-4 space-y-3 bg-white shadow-lg border border-gray-200"
        >
          <div className="font-medium text-gray-900 mb-2">Available Commands</div>
          {commands.map((section) => (
            <div key={section.category} className="space-y-1.5">
              <div className="text-sm font-medium text-empowerlocal-blue">
                {section.category}
              </div>
              <ul className="space-y-1 text-xs text-gray-600">
                {section.commands.map((cmd, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-gray-400">•</span>
                    <span>{cmd}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const BrandChatInterface: React.FC<BrandChatInterfaceProps> = ({ brand, onBrandEdit }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      content: `I'm here to help you manage ${brand.name}. You can ask me to update brand details like audience, objectives, interests, or any other information. What would you like to do?`,
      sender: "assistant",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Add stream mutation for regular chat
  const streamMutation = useMutation({
    mutationFn: async (userInput: string) => {
      setIsTyping(true);

      // 1. Get Supabase auth token
      const supabase = createClient();
      const session = (await supabase.auth.getSession())?.data?.session;

      if (!session) throw new Error("Not authenticated");

      // 2. Prepare request body
      const requestBody = {
        message: userInput,
        assistantId: SUPABASE_ASSISTANT_ID,
        context: JSON.stringify({
          brand,
        }),
      };

      // 3. Call the stream API endpoint
      const url = CHAT_STREAM_SUPABASE_EDGE_URL;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // 4. Process the stream
      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      const assistantMsgId = `assistant-${Date.now()}`;
      let accumulatedContent = "";

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          content: "",
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulatedContent += value;
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, content: accumulatedContent } : msg)),
        );
      }

      return accumulatedContent;
    },
    onSuccess: () => {
      setIsTyping(false);
    },
    onError: (error) => {
      console.error("Streaming mutation error:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          content: `Error: ${error.message}`,
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleBrandMessage = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    
    // Helper function to extract item name from message
    const extractItem = (message: string, section: string): string | null => {
      const patterns = [
        new RegExp(`(?:remove|delete|take out) (?:the )?([^,.]+) (?:from|in) ${section}`, 'i'),
        new RegExp(`(?:add|include|put) (?:the )?([^,.]+) (?:to|in|into) ${section}`, 'i'),
        new RegExp(`(?:set|update) ${section} (?:to|as) ([^,.]+)`, 'i'),
      ];
      
      for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match) return match[1].trim();
      }
      return null;
    };

    // Helper function to determine action type
    const getActionType = (message: string): 'add' | 'remove' | 'set' | null => {
      if (message.match(/\b(?:remove|delete|take out)\b/i)) return 'remove';
      if (message.match(/\b(?:add|include|put)\b/i)) return 'add';
      if (message.match(/\b(?:set|update)\b/i)) return 'set';
      return null;
    };

    // Helper function to determine section
    const getSection = (message: string): 'audience' | 'objectives' | 'interests' | 'locations' | null => {
      if (message.match(/\b(?:audience|target audience)\b/i)) return 'audience';
      if (message.match(/\b(?:objective|goal|objectives|goals)\b/i)) return 'objectives';
      if (message.match(/\b(?:interest|hobby|interests|hobbies)\b/i)) return 'interests';
      if (message.match(/\b(?:location|area|locations|areas)\b/i)) return 'locations';
      return null;
    };

    const action = getActionType(lowerMessage);
    const section = getSection(lowerMessage);
    
    if (!action || !section) return false;

    const item = extractItem(message, section);
    if (!item) return false;

    const newMetrics: BrandMetrics = { ...brand.metrics };

    switch (section) {
      case 'audience':
        if (action === 'set') {
          newMetrics.targetAudience = {
            ...newMetrics.targetAudience,
            primary: item
          };
          onBrandEdit(brand.id, 'metrics', newMetrics);
          toast({
            title: "Target Audience Updated",
            description: `Primary audience set to: ${item}`,
          });
        }
        break;

      case 'objectives':
        if (action === 'add') {
          newMetrics.objectives = [...newMetrics.objectives, item];
          onBrandEdit(brand.id, 'metrics', newMetrics);
          toast({
            title: "Objective Added",
            description: `New objective added: ${item}`,
          });
        } else if (action === 'remove') {
          newMetrics.objectives = newMetrics.objectives.filter(obj => 
            obj.toLowerCase() !== item.toLowerCase()
          );
          onBrandEdit(brand.id, 'metrics', newMetrics);
          toast({
            title: "Objective Removed",
            description: `Removed objective: ${item}`,
          });
        }
        break;

      case 'interests':
        if (action === 'add') {
          newMetrics.targetAudience.interests = [...newMetrics.targetAudience.interests, item];
          onBrandEdit(brand.id, 'metrics', newMetrics);
          toast({
            title: "Interest Added",
            description: `New interest added: ${item}`,
          });
        } else if (action === 'remove') {
          newMetrics.targetAudience.interests = newMetrics.targetAudience.interests.filter(interest => 
            interest.toLowerCase() !== item.toLowerCase()
          );
          onBrandEdit(brand.id, 'metrics', newMetrics);
          toast({
            title: "Interest Removed",
            description: `Removed interest: ${item}`,
          });
        }
        break;

      case 'locations':
        if (action === 'add') {
          newMetrics.targetAudience.locations = [...newMetrics.targetAudience.locations, item];
          onBrandEdit(brand.id, 'metrics', newMetrics);
          toast({
            title: "Location Added",
            description: `New location added: ${item}`,
          });
        } else if (action === 'remove') {
          newMetrics.targetAudience.locations = newMetrics.targetAudience.locations.filter(location => 
            location.toLowerCase() !== item.toLowerCase()
          );
          onBrandEdit(brand.id, 'metrics', newMetrics);
          toast({
            title: "Location Removed",
            description: `Removed location: ${item}`,
          });
        }
        break;
    }

    return true;
  };

  const handleAttachmentAdd = (files: File[]) => {
    const newAttachments: Attachment[] = files.map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      file
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleAttachmentRemove = (id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      attachments: attachments.map(attachment => ({
        id: attachment.id,
        name: attachment.name,
        type: attachment.type,
        size: attachment.size
      }))
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue('');

    // If there are attachments, add them to the brand
    if (attachments.length > 0) {
      const newAttachments = attachments.map(attachment => ({
        id: attachment.id,
        name: attachment.name,
        type: attachment.type,
        size: attachment.size,
        url: URL.createObjectURL(attachment.file)
      }));

      onBrandEdit(brand.id, 'attachments', [
        ...(brand.attachments || []),
        ...newAttachments
      ]);

      setAttachments([]);
      return;
    }

    // Try to handle as brand command first
    const handled = handleBrandMessage(messageToSend);
    
    // If not a brand command, use regular chat
    if (!handled) {
      streamMutation.mutate(messageToSend);
    }
  };

  const handleFeedback = (messageId: string, isPositive: boolean) => {
    // Handle feedback logic here
    console.log(`Feedback for message ${messageId}: ${isPositive ? 'positive' : 'negative'}`);
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F8]">
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-3 pb-1 max-w-2xl mx-auto">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <BrandMessage
                message={message}
                onFeedback={handleFeedback}
              />
            </motion.div>
          ))}
          {isTyping && <ThinkingLoader />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex-none p-2 border-t border-gray-200 bg-white">
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute right-12 bottom-2">
            <HelpTooltip />
          </div>
          <BrandMessageInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSendMessage={handleSendMessage}
            attachments={attachments}
            onAttachmentAdd={handleAttachmentAdd}
            onAttachmentRemove={handleAttachmentRemove}
          />
        </div>
      </div>
    </div>
  );
};

export default BrandChatInterface; 