
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PublisherList } from '../types';
import SearchAndCreateUI from './SearchAndCreateUI';
import CreateNewListForm from './CreateNewListForm';

interface SaveToListModalProps {
  onClose: () => void;
  onSave: (listId: string, publisherIds: string[]) => void;
  publisherIds: string[];
  lists: PublisherList[];
}

const SaveToListModal: React.FC<SaveToListModalProps> = ({ onClose, onSave, publisherIds, lists }) => {
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  
  const publisherText = publisherIds.length === 1 
    ? '1 publisher' 
    : `${publisherIds.length} publishers`;
  
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-empowerlocal-navy">
              {showCreateNew ? 'Create New List' : 'Save to List'}
            </h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {showCreateNew ? (
            <CreateNewListForm 
              onClose={() => setShowCreateNew(false)}
              onCreateList={(newListName) => {
                const newListId = `new-${Date.now()}`;
                console.log('Creating new list:', newListName);
                onSave(newListId, publisherIds);
              }}
              publisherText={publisherText}
            />
          ) : (
            <SearchAndCreateUI
              lists={lists}
              selectedListId={selectedListId}
              setSelectedListId={setSelectedListId}
              onShowCreateNew={() => setShowCreateNew(true)}
              onSave={() => selectedListId && onSave(selectedListId, publisherIds)}
              onClose={onClose}
              publisherText={publisherText}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SaveToListModal;
