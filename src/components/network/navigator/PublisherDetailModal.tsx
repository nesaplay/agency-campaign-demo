
import React from 'react';
import PublisherDetail from '../PublisherDetail';
import { Publisher } from '../types';

interface PublisherDetailModalProps {
  selectedPublisher: Publisher | null;
  onClose: () => void;
}

const PublisherDetailModal: React.FC<PublisherDetailModalProps> = ({
  selectedPublisher,
  onClose
}) => {
  if (!selectedPublisher) {
    return null;
  }
  
  return (
    <PublisherDetail 
      publisher={selectedPublisher} 
      onClose={onClose} 
    />
  );
};

export default PublisherDetailModal;
