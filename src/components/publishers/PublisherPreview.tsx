import React from "react";
import { Publisher } from "@/components/network/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Define the data structure expected by the preview component
// This mirrors PublisherFormData from PublisherForm.tsx and EditablePublisher from PublisherEditPage.tsx
export interface PublisherPreviewData extends Partial<Publisher> {
  logoFile?: File | null;
  headerImageFile?: File | null;
  // Ensure all fields used in the preview are here, referencing the Publisher type
  // Colors (primaryColor, secondaryColor, accentColor) are already in Publisher type (optional)
  // headerImage is also in Publisher type (optional)
}

interface PublisherPreviewProps {
  publisherData: PublisherPreviewData | null;
  preview?: boolean;
  onViewPublisher?: () => void;
}

const PublisherPreview: React.FC<PublisherPreviewProps> = ({ publisherData, preview = true, onViewPublisher }) => {
  if (!publisherData) return <div className="p-4">Loading preview...</div>;

  // Use an empty object as default, relying on publisherData or field-level fallbacks
  const defaults = {} as PublisherPreviewData; // Use the defined interface
  const displayData: PublisherPreviewData = { ...defaults, ...publisherData };

  const primaryColor = displayData.primaryColor || "#442d9a";
  const secondaryColor = displayData.secondaryColor || "#753363";
  const accentColor = displayData.accentColor || "#a29090";

  // Determine header background
  let headerBackground: React.CSSProperties = {};
  let headerContent = <span className="text-white/80">Header Image Preview</span>;
  if (displayData.headerImageFile) {
    headerBackground = {
      backgroundImage: `url(${URL.createObjectURL(displayData.headerImageFile)})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
    headerContent = null;
  } else if (displayData.headerImage) {
    headerBackground = {
      backgroundImage: `url(${displayData.headerImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
    headerContent = null;
  } else {
    headerBackground = { backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` };
  }

  // Determine logo content
  let logoContent = (
    <span className="text-white text-2xl font-bold">
      {displayData.name ? displayData.name.charAt(0).toUpperCase() : "L"}
    </span>
  );
  let logoBackground: React.CSSProperties = { backgroundColor: secondaryColor };
  if (displayData.logoFile) {
    logoBackground = {
      backgroundImage: `url(${URL.createObjectURL(displayData.logoFile)})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
    logoContent = null;
  } else if (displayData.logo) {
    logoBackground = {
      backgroundImage: `url(${displayData.logo})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
    logoContent = null;
  }

  const buttonGradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
    color: "white",
    border: "none",
  };

  return (
    <div
      className={cn("bg-gray-50 rounded-lg shadow h-full", {
        "p-6": preview,
        "p-0": !preview,
      })}
    >
      {preview && <h2 className="text-xl font-semibold text-gray-700 mb-4">Live Preview</h2>}
      <div className="h-40 rounded-t-md flex items-center justify-center mb-4" style={headerBackground}>
        {headerContent}
      </div>
      <div className="bg-white p-4">
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 rounded-md flex items-center justify-center mr-3" style={logoBackground}>
            {logoContent}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {displayData.name || "Your Publication Name"}
            </h3>
            <p className="text-sm text-gray-500 truncate">{displayData.coverage || "Your Coverage Area"}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {(displayData.categories || []).slice(0, 3).map((cat, index) => (
            <span
              key={cat}
              className={`px-2 py-1 text-xs rounded-full ${index === 0 ? "text-white" : "bg-gray-200 text-gray-700"}`}
              style={index === 0 ? { backgroundColor: accentColor } : {}}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-white p-4 border-t border-gray-200 rounded-b-md">
        <h4 className="text-md font-semibold text-gray-700 mb-2">Publisher Details</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div>
            Avg. Monthly Audience:{" "}
            <span className="font-medium text-gray-800">
              {(displayData.audienceSize || 0).toLocaleString() || "250,000"}
            </span>
          </div>
          <div>
            Subscribers: <span className="font-medium text-gray-800">{displayData.subscribers || "N/A"}</span>
          </div>

          {preview && (
            <>
              <div>
                Engagement: <span className="font-medium text-gray-800">{displayData.engagement || "N/A"}</span>
              </div>
              <div>
                CPM: <span className="font-medium text-gray-800">{displayData.cpm || "N/A"}</span>
              </div>
              <div>
                Performance: <span className="font-medium text-gray-800">{displayData.performance || "N/A"}</span>
              </div>
              <div>
                Inventory Types: <span className="font-medium text-gray-800">Display, Native, Newsletter</span>
              </div>
            </>
          )}
          {!preview && (
            <div className="text-center text-gray-400 text-xs mt-1">
              ...
            </div>
          )}
        </div>
      </div>
      {preview && (
        <div className={cn("mt-4", { "px-0": preview, "p-2": !preview })}>
          <Button
            style={buttonGradientStyle}
            className={cn(
              "w-full font-semibold py-2 px-4 rounded-md hover:opacity-90 transition-opacity btn-primary",
            )}
            onClick={onViewPublisher}
          >
            View Publisher
          </Button>
        </div>
      )}
    </div>
  );
};

export default PublisherPreview;
