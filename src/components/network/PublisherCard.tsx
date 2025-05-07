import React, { useState } from "react";
import { MoreVertical, Trash2, Eye, Star, PlusCircle } from "lucide-react";
import { Publisher } from "./types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import PublisherPreview, { PublisherPreviewData } from "@/components/publishers/PublisherPreview";
import { useNavigate } from "react-router-dom";
interface PublisherCardProps {
  publisher: Publisher;
  onClick: () => void;
  onDeleteFromList?: () => void;
  onViewDetailsInMenu?: () => void;
  onAddToCampaign?: () => void;
}

const PublisherCard: React.FC<PublisherCardProps> = ({
  publisher,
  onClick,
  onDeleteFromList,
  onViewDetailsInMenu,
  onAddToCampaign,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (onDeleteFromList) {
      onDeleteFromList();
      toast({
        title: "Publisher removed",
        description: `${publisher.name} has been removed.`,
      });
    } else {
      toast({
        title: "Action not available",
        description: "Delete function not provided for this card.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetailsClickInMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (onViewDetailsInMenu) {
      onViewDetailsInMenu();
    } else {
      onClick();
    }
  };

  const isPremium = publisher.performance === "Excellent";

  const publisherDataForPreview: PublisherPreviewData = {
    ...publisher,
    logoFile: null,
    headerImageFile: null,
  };

  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 relative group min-w-[300px]",
        isHovered && "transform scale-[1.01]",
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isPremium && (
        <div className="absolute top-3 right-3 z-30 bg-amber-100 border border-amber-300 rounded-full p-1 shadow-md">
          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
        </div>
      )}

      <div className="absolute top-2 left-2 z-40">
        <button
          onClick={handleMenuToggle}
          className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-gray-100 transition-colors shadow-sm group-hover:opacity-100 opacity-75"
        >
          <MoreVertical className="h-4 w-4 text-gray-600" />
        </button>

        {menuOpen && (
          <div className="absolute left-0 mt-1 w-40 bg-white rounded-md shadow-xl border border-gray-200 overflow-hidden z-50">
            <button
              className="w-full text-left py-2 px-3 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-gray-700"
              onClick={handleViewDetailsClickInMenu}
            >
              <Eye className="h-4 w-4 text-gray-500" />
              View Details
            </button>
            {onDeleteFromList && (
              <button
                className="w-full text-left py-2 px-3 hover:bg-red-50 transition-colors flex items-center gap-2 text-sm text-red-600"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            )}
          </div>
        )}
      </div>

      <div className="cursor-pointer">
        <PublisherPreview
          publisherData={publisherDataForPreview}
          preview={false}
          onViewPublisher={() => navigate(`/publishers/${publisher.id}`)}
        />
      </div>

      {onAddToCampaign && (
        <div className="p-4 border-t border-gray-200 bg-gray-50/50">
          <Button
            variant="default"
            size="sm"
            className="w-full font-semibold !text-base bg-empowerlocal-blue hover:bg-empowerlocal-navy text-white"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCampaign();
              toast({ title: "Added to Campaign", description: `${publisher.name} added.` });
            }}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add to Campaign
          </Button>
        </div>
      )}
    </div>
  );
};

export default PublisherCard;
