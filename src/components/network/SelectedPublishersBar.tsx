
import React, { useState } from 'react';
import { X, BarChart2, MessageCircleQuestion } from 'lucide-react';
import PublisherComparisonView from './lassie/PublisherComparisonView';
import { mockPublishers } from './mockData';

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
  const [showComparisonView, setShowComparisonView] = useState(false);
  
  if (selectedPublishers.length === 0) {
    return null;
  }
  
  // Get full publisher objects from mock data
  const selectedPublisherObjects = mockPublishers.filter(p => 
    selectedPublishers.includes(p.id)
  );

  return (
    <>
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-20 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-medium">{selectedPublishers.length} publishers selected</span>
            <button 
              onClick={onClearSelection}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowComparisonView(true)}
              className="px-4 py-2 bg-empowerlocal-blue/10 text-empowerlocal-blue border border-empowerlocal-blue/30 rounded-lg flex items-center gap-2 hover:bg-empowerlocal-blue/20 transition-colors"
            >
              <MessageCircleQuestion className="h-4 w-4" />
              <span>Ask Lassie to Compare</span>
            </button>
            
            <button
              onClick={() => setShowComparisonView(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <BarChart2 className="h-4 w-4" />
              <span>Compare</span>
            </button>
            
            <button
              onClick={onShowSaveToListModal}
              className="px-4 py-2 bg-empowerlocal-blue text-white rounded-lg hover:bg-empowerlocal-navy transition-colors"
            >
              Save to List
            </button>
          </div>
        </div>
      </div>
      
      {showComparisonView && (
        <PublisherComparisonView 
          publishers={selectedPublisherObjects}
          onClose={() => setShowComparisonView(false)}
        />
      )}
    </>
  );
};

export default SelectedPublishersBar;
