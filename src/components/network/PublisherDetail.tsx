
import React from 'react';
import { Publisher } from './types';
import PublisherModal from './publisher-detail/PublisherModal';
import PublisherDetailContent from './publisher-detail/PublisherDetailContent';
import PublisherActions from './publisher-detail/PublisherActions';

interface PublisherDetailProps {
  publisher: Publisher;
  onClose: () => void;
}

const PublisherDetail: React.FC<PublisherDetailProps> = ({ publisher, onClose }) => {
  return (
    <PublisherModal onClose={onClose}>
      <PublisherDetailContent publisher={publisher} />
      <PublisherActions />
    </PublisherModal>
  );
};

export default PublisherDetail;
