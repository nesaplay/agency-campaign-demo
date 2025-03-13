
import React, { useState } from 'react';
import { Publisher } from './types';
import PublisherModal from './publisher-detail/PublisherModal';
import PublisherDetailContent from './publisher-detail/PublisherDetailContent';
import PublisherActions from './publisher-detail/PublisherActions';
import LassieChatPanel from './lassie/LassieChatPanel';
import { X } from 'lucide-react';

interface PublisherDetailProps {
  publisher: Publisher;
  onClose: () => void;
}

const PublisherDetail: React.FC<PublisherDetailProps> = ({ publisher, onClose }) => {
  const [showLassieChat, setShowLassieChat] = useState(false);
  
  return (
    <PublisherModal onClose={onClose}>
      <div className="flex h-full">
        <div className={`flex-1 flex flex-col transition-all duration-300 ${showLassieChat ? 'w-2/3' : 'w-full'}`}>
          <PublisherDetailContent publisher={publisher} />
          <PublisherActions />
        </div>
        
        {showLassieChat && (
          <div className="w-1/3 border-l border-gray-200 bg-gray-50 relative flex flex-col">
            <div className="absolute top-2 right-2">
              <button 
                onClick={() => setShowLassieChat(false)} 
                className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <LassieChatPanel publisher={publisher} />
          </div>
        )}
        
        {!showLassieChat && (
          <button 
            onClick={() => setShowLassieChat(true)}
            className="absolute bottom-20 right-6 px-4 py-2 bg-empowerlocal-blue text-white rounded-full shadow-md hover:bg-empowerlocal-navy transition-colors flex items-center gap-2"
          >
            <span>Ask Lassie</span>
          </button>
        )}
      </div>
    </PublisherModal>
  );
};

export default PublisherDetail;
