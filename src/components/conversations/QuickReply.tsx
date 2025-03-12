
import React from 'react';
import { cn } from '@/lib/utils';

interface QuickReplyProps {
  text: string;
  onClick: () => void;
}

const QuickReply: React.FC<QuickReplyProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-gray-200 hover:border-empowerlocal-blue text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors"
    >
      {text}
    </button>
  );
};

export default QuickReply;
