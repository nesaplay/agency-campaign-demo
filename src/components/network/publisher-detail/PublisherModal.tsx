
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PublisherModalProps {
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const PublisherModal: React.FC<PublisherModalProps> = ({ 
  onClose,
  children,
  title = "Publisher Details"
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] overflow-hidden">
      <div 
        className={cn(
          "fixed inset-y-0 right-0 w-[90%] max-w-6xl bg-white shadow-xl",
          "transform transition-transform duration-300 ease-in-out",
          "flex flex-col h-full"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white z-10 sticky top-0">
          <h3 className="font-medium text-empowerlocal-navy text-xl">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PublisherModal;
