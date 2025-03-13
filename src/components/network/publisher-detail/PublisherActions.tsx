
import React from 'react';
import { Plus } from 'lucide-react';

interface PublisherActionsProps {
  // No specific props needed for now, but could be expanded later
}

const PublisherActions: React.FC<PublisherActionsProps> = () => {
  return (
    <div className="p-4 border-t border-gray-200">
      <button className="w-full py-2 bg-gradient-to-r from-empowerlocal-green to-empowerlocal-blue text-white rounded-lg font-medium flex items-center justify-center gap-1">
        <Plus className="h-4 w-4" />
        Add to Campaign
      </button>
    </div>
  );
};

export default PublisherActions;
