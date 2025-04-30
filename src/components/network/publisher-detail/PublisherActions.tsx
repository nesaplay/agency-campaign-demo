import React from "react";
import { Plus } from "lucide-react";

interface PublisherActionsProps {
  onClick?: () => void;
}

const PublisherActions: React.FC<PublisherActionsProps> = ({ onClick }) => {
  return (
    <div className="p-4 border-t border-gray-200">
      <button
        className="w-full py-2 bg-empowerlocal-gradient text-white rounded-lg font-medium flex items-center justify-center gap-1"
        onClick={onClick}
      >
        <Plus className="h-4 w-4" />
        Add to Campaign
      </button>
    </div>
  );
};

export default PublisherActions;
