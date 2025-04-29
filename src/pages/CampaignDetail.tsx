import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import useCampaignStore from "@/stores/useCampaignStore";
import { Campaign } from "@/types/campaign";
import { Publisher } from "@/components/network/types";
import PublisherDetail from "@/components/network/PublisherDetail";
import PublisherCard from "@/components/network/PublisherCard";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Coins, Flag, Calendar, Users, LayoutGrid, List, Plus } from "lucide-react";

const CampaignDetail: React.FC = () => {
  const { id: campaignId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const campaigns = useCampaignStore((state) => state.campaigns);

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);

  useEffect(() => {
    const foundCampaign = campaigns.find((c) => c.id === campaignId);
    if (foundCampaign) {
      setCampaign(foundCampaign);
      setPublishers(foundCampaign.publishers || []);
    } else {
      navigate("/campaigns");
    }
  }, [campaignId, campaigns, navigate]);

  const handleRemovePublisher = (publisherId: string) => {
    if (!campaign) return;
    console.log("Removing publisher:", publisherId, "from campaign:", campaign.id);
    const updatedPublishers = publishers.filter((p) => p.id !== publisherId);
    setPublishers(updatedPublishers);
    setCampaign({ ...campaign, publishers: updatedPublishers });
    // TODO: Persist change in store
  };

  const handleAddPublisherToCampaign = (publisherId: string) => {
    console.log("Attempting to add publisher to campaign (from detail view - likely NOP here):", publisherId);
  };

  const handleViewPublisherDetails = (publisher: Publisher) => {
    setSelectedPublisher(publisher);
  };

  if (!campaign) {
    return (
      <MainLayout>
        <div className="flex flex-col h-full items-center justify-center bg-empowerlocal-bg">
          <p className="body-text">Loading campaign...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-empowerlocal-bg">
        <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start">
              <button
                onClick={() => navigate("/campaigns")}
                className="mr-3 mt-1 p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Back to Campaigns"
              >
                <ArrowLeft className="h-5 w-5 text-gray-500" />
              </button>
              <div>
                <h1 className="text-3xl font-semibold text-empowerlocal-navy">{campaign.name}</h1>
                <p className="text-sm text-gray-500 mt-1">Created: {new Date(campaign.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <Link to="/network-navigator" className="mt-1">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Campaign
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-700">
              <Coins className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500">Budget</div>
                <div className="text-sm font-medium">{campaign.budget || "N/A"}</div>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <Flag className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500">Geography</div>
                <div className="text-sm font-medium">{campaign.geography || "N/A"}</div>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <Calendar className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500">Timeline</div>
                <div className="text-sm font-medium">{campaign.timeline || "N/A"}</div>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <Users className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500">Est. Reach</div>
                <div className="text-sm font-medium">{campaign.estimatedReach || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-empowerlocal-navy">Publishers ({publishers.length})</h2>
            <div className="flex items-center bg-gray-100 rounded-md p-1">
              <button
                className={`px-3 py-1 text-sm rounded ${viewMode === "grid" ? "bg-white shadow" : "text-gray-600"}`}
                onClick={() => setViewMode("grid")}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                className={`px-3 py-1 text-sm rounded ${viewMode === "list" ? "bg-white shadow" : "text-gray-600"}`}
                onClick={() => setViewMode("list")}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div
            className={` ${
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }`}
          >
            {publishers.map((pub) => (
              <PublisherCard
                key={pub.id}
                publisher={pub}
                onClick={() => handleViewPublisherDetails(pub)}
                onDelete={() => handleRemovePublisher(pub.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedPublisher && (
        <PublisherDetail
          publisher={selectedPublisher}
          onClose={() => setSelectedPublisher(null)}
          onAddPublisherToCampaign={handleAddPublisherToCampaign}
        />
      )}

      <Toaster />
    </MainLayout>
  );
};

export default CampaignDetail;
