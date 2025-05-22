import React from "react";
import { Publisher } from "@/components/network/types";
import PublisherCard from "@/components/network/PublisherCard";

interface ResultsDisplayProps {
  resultsDisplayMode: "map" | "list";
  filteredPublishers: Publisher[];
  selectedPublisher: Publisher | null;
  onPublisherSelect: (publisher: Publisher) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  publisherCount: number;
  showFilters: boolean;
  toggleFilters: () => void;
  setResultsDisplayMode: (mode: "map" | "list") => void;
  togglePublisherSelection?: (publisherId: string) => void;
  selectedPublishers?: string[];
  onAddToCampaign?: (publisher: Publisher) => void;
  onDeleteFromList?: (publisherId: string) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  resultsDisplayMode,
  filteredPublishers,
  selectedPublisher,
  onPublisherSelect,
  searchQuery,
  onSearchChange,
  publisherCount,
  showFilters,
  toggleFilters,
  setResultsDisplayMode,
  togglePublisherSelection,
  selectedPublishers,
  onAddToCampaign,
  onDeleteFromList,
}) => {
  if (!filteredPublishers) {
    return <div className="p-4 text-center text-gray-500">Loading publishers...</div>;
  }

  if (resultsDisplayMode === "map") {
    return <div className="p-4 text-center">Map view is not yet fully implemented here.</div>;
  }

  if (resultsDisplayMode === "list") {
    if (filteredPublishers.length === 0) {
      return <div className="p-4 text-center text-gray-500">No publishers found matching your criteria.</div>;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-4 overflow-y-auto h-full">
        {filteredPublishers.map((publisher) => (
          <PublisherCard
            key={publisher.id}
            publisher={publisher}
            onClick={() => onPublisherSelect(publisher)}
          />
        ))}
      </div>
    );
  }

  return <div className="p-4 text-center">Please select a display mode.</div>;
};

export default ResultsDisplay; 