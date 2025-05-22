import React from "react";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import BrandContextModule from "@/components/brands/context-module/BrandContextModule";
import { Button } from "@/components/ui/button";

const DashboardContent: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Welcome Section with Create Campaign Button */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-empowerlocal-navy">Welcome, Jane</h1>
            <p className="mt-1 text-gray-500">Your campaign command center</p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-empowerlocal-green to-empowerlocal-blue hover:from-empowerlocal-green/90 hover:to-empowerlocal-blue/90"
          >
            <Link to="/network-navigator">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Campaign
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex p-6 w-full">
        <BrandContextModule />
      </div>
    </div>
  );
};

export default DashboardContent;
