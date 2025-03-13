
import React from 'react';
import { X } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] relative overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="font-medium text-empowerlocal-navy text-xl">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default PublisherModal;
