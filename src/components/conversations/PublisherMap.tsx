
import React from 'react';
import { MapPin } from 'lucide-react';

const PublisherMap: React.FC = () => {
  return (
    <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
      <div className="bg-gray-100 h-64 relative">
        {/* This is a placeholder for the actual map */}
        <div className="absolute inset-0 bg-[#e6f0ff]">
          <div className="absolute w-full h-full opacity-20"
               style={{
                 backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
               }}
          ></div>
          
          {/* Los Angeles Marker */}
          <div className="absolute" style={{ top: '45%', left: '20%' }}>
            <div className="relative">
              <MapPin className="h-8 w-8 text-empowerlocal-blue" />
              <div className="absolute -top-8 -left-16 bg-white px-2 py-1 rounded shadow-md text-xs font-medium">
                Los Angeles (8 publishers)
              </div>
            </div>
          </div>
          
          {/* Phoenix Marker */}
          <div className="absolute" style={{ top: '55%', left: '38%' }}>
            <div className="relative">
              <MapPin className="h-8 w-8 text-empowerlocal-green" />
              <div className="absolute -top-8 -left-12 bg-white px-2 py-1 rounded shadow-md text-xs font-medium">
                Phoenix (5 publishers)
              </div>
            </div>
          </div>
          
          {/* San Diego Marker */}
          <div className="absolute" style={{ top: '58%', left: '22%' }}>
            <div className="relative">
              <MapPin className="h-6 w-6 text-purple-500" />
              <div className="absolute -top-8 -left-12 bg-white px-2 py-1 rounded shadow-md text-xs font-medium">
                San Diego (3 publishers)
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-3 left-3 bg-white p-2 rounded shadow-sm text-xs">
            Publisher coverage in Western markets
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublisherMap;
