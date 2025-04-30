import React, { useState } from "react";
import { Publisher } from "./types";
import PublisherModal from "./publisher-detail/PublisherModal";
import PublisherDetailContent from "./publisher-detail/PublisherDetailContent";
import PublisherActions from "./publisher-detail/PublisherActions";
import LassieChatPanel from "./lassie/LassieChatPanel";
import { X } from "lucide-react";

interface PublisherDetailProps {
  publisher: Publisher;
  onClose: () => void;
  onAddPublisherToCampaign?: (publisherId: string) => void;
}

const PublisherDetail: React.FC<PublisherDetailProps> = ({ publisher, onClose, onAddPublisherToCampaign }) => {
  const [showLassieChat, setShowLassieChat] = useState(false);

  return (
    <PublisherModal onClose={onClose}>
      <div className="flex h-full">
        <div className={`flex-1 flex flex-col transition-all duration-300 ${showLassieChat ? "w-3/4" : "w-full"}`}>
          <div className="flex-1 overflow-hidden">
            <PublisherDetailContent publisher={publisher} setShowLassieChat={setShowLassieChat} />
          </div>
          <PublisherActions onClick={onAddPublisherToCampaign ? () => onAddPublisherToCampaign(publisher.id) : undefined} />
        </div>

        {showLassieChat && (
          <div className="w-1/4 border-l border-gray-200 bg-gray-50 relative flex flex-col">
            <div className="absolute top-2 right-2 z-10">
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
      </div>
    </PublisherModal>
  );
};

export default PublisherDetail;
