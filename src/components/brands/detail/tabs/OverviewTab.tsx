import React from "react";
import { LineChart, Globe, LayoutGrid, Paperclip, Download } from "lucide-react";
import { Brand } from "@/components/brands/types";
import { Button } from "@/components/ui/button";

interface OverviewTabProps {
  brand: Brand;
  setActiveTab: (tab: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ brand, setActiveTab }) => {
  const attachments = brand.attachments || [];
  const MAX_PREVIEW_ATTACHMENTS = 2;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <LineChart className="h-5 w-5 text-empowerlocal-blue" />
          <h3 className="font-medium text-gray-800">Performance Summary</h3>
        </div>
        <div className="h-44 flex items-center justify-center border border-gray-100 rounded bg-gray-50">
          <span className="text-sm text-gray-500">Performance chart preview</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <LayoutGrid className="h-5 w-5 text-empowerlocal-blue" />
          <h3 className="font-medium text-gray-800">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">C</div>
            <div>
              <div className="text-sm font-medium">Campaign Created</div>
              <div className="text-xs text-gray-500">Summer Promotion</div>
            </div>
            <div className="ml-auto text-xs text-gray-500">2d ago</div>
          </div>
          <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">P</div>
            <div>
              <div className="text-sm font-medium">Publisher Added</div>
              <div className="text-xs text-gray-500">Daily Chronicle</div>
            </div>
            <div className="ml-auto text-xs text-gray-500">5d ago</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-empowerlocal-blue" />
          <h3 className="font-medium text-gray-800">Active Publishers</h3>
        </div>
        <div className="h-44 flex items-center justify-center border border-gray-100 rounded bg-gray-50">
          <span className="text-sm text-gray-500">Publisher map preview</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Paperclip className="h-5 w-5 text-empowerlocal-blue" />
            <h3 className="font-medium text-gray-800">Attachments</h3>
          </div>
          {attachments.length > MAX_PREVIEW_ATTACHMENTS && (
            <Button variant="link" size="sm" className="h-auto p-0" onClick={() => setActiveTab("attachments")}>
              View All ({attachments.length})
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {attachments.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No attachments added yet.</p>
          ) : (
            attachments.slice(0, MAX_PREVIEW_ATTACHMENTS).map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100"
              >
                <span className="text-sm text-gray-700 truncate pr-2">{file.name}</span>
                <Button variant="ghost" size="sm" className="h-auto p-1" asChild>
                  <a
                    href={file.url}
                    download={file.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Download ${file.name}`}
                  >
                    <Download className="h-4 w-4 text-gray-500" />
                  </a>
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
