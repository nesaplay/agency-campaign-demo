
import React from 'react';
import SaveToListModal from '@/components/lists/save-to-list-modal';
import { Publisher } from '../types';
import { PublisherList } from '@/components/lists/types';

interface SaveToListModalWrapperProps {
  showSaveToListModal: boolean;
  setShowSaveToListModal: (show: boolean) => void;
  handleAddToList: (listId: string, publisherIds: string[]) => void;
  publisherToSave: Publisher | null;
  selectedPublishers: string[];
  lists: PublisherList[];
}

const SaveToListModalWrapper: React.FC<SaveToListModalWrapperProps> = ({
  showSaveToListModal,
  setShowSaveToListModal,
  handleAddToList,
  publisherToSave,
  selectedPublishers,
  lists
}) => {
  if (!showSaveToListModal) {
    return null;
  }
  
  return (
    <SaveToListModal
      onClose={() => setShowSaveToListModal(false)}
      onSave={handleAddToList}
      publisherIds={publisherToSave ? [publisherToSave.id] : selectedPublishers}
      lists={lists}
    />
  );
};

export default SaveToListModalWrapper;
