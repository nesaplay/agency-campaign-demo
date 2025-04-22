
import React, { useRef } from 'react';
import { Send, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  inputValue,
  setInputValue,
  handleSendMessage
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleUploadFile = () => {
    toast({
      title: "File upload",
      description: "File upload functionality will be implemented soon",
    });
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
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
        onClick={handleSendMessage}
        disabled={!inputValue.trim()}
        className={cn(
          "p-2 rounded-full",
          inputValue.trim() 
            ? "bg-empowerlocal-gold text-white hover:bg-amber-600" 
            : "bg-gray-100 text-gray-400"
        )}
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  );
};

export default MessageInput;
