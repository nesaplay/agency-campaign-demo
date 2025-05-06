import React from "react";
import { Publisher } from "./types";
import PublisherModal from "./publisher-detail/PublisherModal";
import PublisherPreview from "../publishers/PublisherPreview";

interface PublisherDetailProps {
  publisher: Publisher;
  onClose: () => void;
  onAddPublisherToCampaign?: (publisherId: string) => void;
}

const PublisherDetail: React.FC<PublisherDetailProps> = ({ publisher, onClose, onAddPublisherToCampaign }) => {
  return (
    <PublisherModal onClose={onClose}>
      <PublisherPreview
        publisherData={publisher}
        onViewPublisher={onAddPublisherToCampaign ? () => onAddPublisherToCampaign(publisher.id) : undefined}
        preview={true} // Set to true to show detailed view
      />
    </PublisherModal>
  );
};

export default PublisherDetail;
