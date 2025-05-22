import React from "react";
import { Link } from "react-router-dom";
import { Campaign } from "@/types/campaign";
import { Users, Coins, Flag, Calendar } from "lucide-react";
import { format } from "date-fns";

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const formattedDate = format(new Date(campaign.createdAt), "PPP");
  const coverImageUrl = campaign.publishers[0]?.logo; // Get first publisher image

  console.log({campaign})

  return (
    <Link
      to={`/campaigns/${campaign.id}`}
      className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150 overflow-hidden"
    >
      {/* Cover Image Area */}
      <div
        className="h-40 bg-gray-200 relative bg-cover bg-center" // Added bg-cover, bg-center
        style={{ backgroundImage: coverImageUrl ? `url(${coverImageUrl})` : "none" }} // Set background image
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        {/* Campaign Name in Overlay */}
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h3 className="font-semibold text-white/80 text-lg mb-0 truncate">{campaign.name}</h3>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        {/* Moved date below image */}
        <p className="text-sm text-gray-500 mb-3">Created: {formattedDate}</p>

        {/* Keep details grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
          <div className="flex items-center text-gray-700">
            <Coins className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{campaign.budget || "N/A"}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Flag className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{campaign.geography || "N/A"}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Calendar className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{campaign.timeline || "N/A"}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Users className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{campaign.estimatedReach || "N/A"}</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-1.5 text-gray-400" />
          <span>
            {campaign.publishers.length} Publisher{campaign.publishers.length !== 1 ? "s" : ""}
          </span>
          {/* Optionally show tiny publisher logos */}
          <div className="flex items-center ml-auto space-x-[-6px]">
            {campaign.publishers.slice(0, 4).map((p) => (
              <img
                key={p.id}
                src={p.logo}
                alt={p.name}
                className="h-5 w-5 rounded-full border-2 border-white object-cover"
              />
            ))}
            {campaign.publishers.length > 4 && (
              <span className="h-5 w-5 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">
                +{campaign.publishers.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CampaignCard;
