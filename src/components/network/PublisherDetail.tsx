import React from "react";
import { Publisher } from "./types";
import PublisherModal from "./publisher-detail/PublisherModal";
import PublisherPreview from "../publishers/PublisherPreview";
import { useNavigate } from "react-router-dom";

interface PublisherDetailProps {
  publisher: Publisher;
  onClose: () => void;
  onAddPublisherToCampaign?: (publisherId: string) => void;
}

const PublisherDetail: React.FC<PublisherDetailProps> = ({ publisher, onClose, onAddPublisherToCampaign }) => {
  const navigate = useNavigate();
  return (
    <PublisherModal onClose={onClose}>
      <PublisherPreview
        publisherData={publisher}
        onViewPublisher={
          onAddPublisherToCampaign
            ? () => onAddPublisherToCampaign(publisher.id)
            : () => navigate(`/publishers/${publisher.id}`)
        }
        preview={true}
      />
    </PublisherModal>
  );
};

export default PublisherDetail;
