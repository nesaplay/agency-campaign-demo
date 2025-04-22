
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface QuickReplyProps {
  text: string;
  onClick: () => void;
}

const QuickReply: React.FC<QuickReplyProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group bg-white border border-gray-200 hover:border-empowerlocal-teal text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-sm flex items-center gap-2"
    >
      <span>{text}</span>
      <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-empowerlocal-teal" />
    </button>
  );
};

export default QuickReply;
