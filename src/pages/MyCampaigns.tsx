import React, { useState } from "react";
import useCampaignStore from "@/stores/useCampaignStore";
import CampaignCard from "@/components/campaigns/CampaignCard";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { ListCategory } from "@/components/lists/types";
import { Campaign } from "@/types/campaign";

const MyCampaigns: React.FC = () => {
  const campaigns = useCampaignStore((state) => state.campaigns);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>(campaigns);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "recent">("all");
  const navigate = useNavigate();

  // Filter handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredCampaigns(getFilteredCampaignsByCategory("all", campaigns));
      return;
    }

    const filtered = campaigns.filter(
      (campaign) =>
        campaign.name.toLowerCase().includes(query.toLowerCase()) ||
        campaign.publishers.some((publisher) => publisher.name.toLowerCase().includes(query.toLowerCase())) ||
        campaign.geography.toLowerCase().includes(query.toLowerCase()),
    );

    setFilteredCampaigns(filtered);
  };

  const getFilteredCampaignsByCategory = (category: ListCategory, campaignsToFilter: Campaign[]) => {
    switch (category) {
      case "recent":
        return [...campaignsToFilter].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "all":
      default:
        return campaignsToFilter;
    }
  };

  const handleCategoryChange = (category: "all" | "recent") => {
    setActiveCategory(category);
    setFilteredCampaigns(getFilteredCampaignsByCategory(category, campaigns));
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-empowerlocal-bg">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="heading-1 text-2xl font-semibold text-empowerlocal-navy">My Campaigns</h1>
            <Link to="/network-navigator" className="btn-primary flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Campaign
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors small-text ${
                  activeCategory === "all" ? "bg-gray-100 text-empowerlocal-navy" : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => handleCategoryChange("all")}
              >
                All Campaigns
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors small-text ${
                  activeCategory === "recent" ? "bg-gray-100 text-empowerlocal-navy" : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => handleCategoryChange("recent")}
              >
                Recently Updated
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-empowerlocal-blue focus:border-transparent small-text"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg flex items-center justify-center flex-col h-full">
            <h2 className="text-xl font-medium text-gray-700 mb-2">No campaigns yet</h2>
            <p className="text-gray-500 mb-4">Start building your first campaign with Lassie.</p>
            <Link to="/network-navigator" className="btn-primary flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Campaign
            </Link>
          </div>
        ) : (
          <div className="section flex-1 p-6 overflow-auto">
            <div className="card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyCampaigns;
