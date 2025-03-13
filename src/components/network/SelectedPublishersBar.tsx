
import React from 'react';
import { Check, ListPlus } from 'lucide-react';

interface SelectedPublishersBarProps {
  selectedPublishers: string[];
  onShowSaveToListModal: () => void;
  onClearSelection: () => void;
}

const SelectedPublishersBar: React.FC<SelectedPublishersBarProps> = ({
  selectedPublishers,
  onShowSaveToListModal,
  onClearSelection
}) => {
  if (selectedPublishers.length === 0) return null;
  
  return (
    <div className="bg-empowerlocal-blue text-white py-2 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4" />
        <span>{selectedPublishers.length} publishers selected</span>
      </div>
      <div className="flex items-center gap-4">
        <button 
          className="flex items-center gap-2 px-3 py-1.5 bg-white text-empowerlocal-blue rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          onClick={onShowSaveToListModal}
        >
          <ListPlus className="h-4 w-4" />
          Add to List
        </button>
        <button 
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          onClick={onClearSelection}
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
};

export default SelectedPublishersBar;
