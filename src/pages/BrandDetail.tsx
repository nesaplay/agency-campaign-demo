
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Settings, LineChart, Globe, Tabs } from 'lucide-react';
import { useBrand } from '@/components/brands/BrandContext';
import { Brand } from '@/components/brands/types';
import { cn } from '@/lib/utils';

const BrandDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { brands, setActiveBrand } = useBrand();
  const [activeTab, setActiveTab] = React.useState('overview');
  
  // Find the brand by ID
  const brand = brands.find(b => b.id === id) || null;
  
  if (!brand) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-semibold text-gray-700">Brand not found</h2>
          <p className="text-gray-500 mb-4">The brand you're looking for doesn't exist.</p>
          <Link to="/brands" className="text-empowerlocal-blue hover:underline">
            Back to My Brands
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header with back button */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-5">
            <Link 
              to="/brands" 
              className="flex items-center gap-1 text-gray-500 hover:text-empowerlocal-navy transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to My Brands</span>
            </Link>
          </div>
          
          {/* Brand header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="h-16 w-16 rounded-lg flex items-center justify-center text-white text-2xl font-semibold shadow-sm"
                style={{ backgroundColor: brand.color }}
              >
                {brand.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-empowerlocal-navy">{brand.name}</h1>
                <p className="text-gray-500 mt-1">{brand.description}</p>
                <div className="flex items-center gap-6 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-gray-600">
                      {brand.campaignCount} Campaigns
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-gray-600">
                      23 Publishers
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {!brand.isActive && (
              <button 
                className="px-4 py-2 bg-empowerlocal-blue text-white rounded-lg hover:bg-empowerlocal-navy transition-colors"
                onClick={() => setActiveBrand(brand)}
              >
                Set as Active Brand
              </button>
            )}
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center px-6">
            <button 
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'overview' 
                  ? "border-empowerlocal-blue text-empowerlocal-navy" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'campaigns' 
                  ? "border-empowerlocal-blue text-empowerlocal-navy" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
              onClick={() => setActiveTab('campaigns')}
            >
              Campaigns
            </button>
            <button 
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'publishers' 
                  ? "border-empowerlocal-blue text-empowerlocal-navy" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
              onClick={() => setActiveTab('publishers')}
            >
              Publishers
            </button>
            <button 
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'settings' 
                  ? "border-empowerlocal-blue text-empowerlocal-navy" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <Globe className="h-5 w-5 text-empowerlocal-blue" />
                  <h3 className="font-medium text-gray-800">Active Publishers</h3>
                </div>
                <div className="h-44 flex items-center justify-center border border-gray-100 rounded bg-gray-50">
                  <span className="text-sm text-gray-500">Publisher map preview</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Tabs className="h-5 w-5 text-empowerlocal-blue" />
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
            </div>
          )}
          
          {activeTab === 'campaigns' && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-800">Campaigns</h2>
                <button className="px-4 py-2 bg-empowerlocal-blue text-white text-sm rounded-lg hover:bg-empowerlocal-navy transition-colors">
                  New Campaign
                </button>
              </div>
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="rounded-full bg-gray-100 p-4 mb-4">
                  <LineChart className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Campaign content will appear here</h3>
                <p className="text-gray-500 max-w-md">
                  This is a preview of the campaigns tab. In a real implementation, this would show a list of campaigns for {brand.name}.
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'publishers' && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-800">Publishers</h2>
                <button className="px-4 py-2 bg-empowerlocal-blue text-white text-sm rounded-lg hover:bg-empowerlocal-navy transition-colors">
                  Add Publishers
                </button>
              </div>
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="rounded-full bg-gray-100 p-4 mb-4">
                  <Globe className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Publisher content will appear here</h3>
                <p className="text-gray-500 max-w-md">
                  This is a preview of the publishers tab. In a real implementation, this would show a list of publishers for {brand.name}.
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <h2 className="text-lg font-medium text-gray-800">Settings</h2>
              </div>
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="rounded-full bg-gray-100 p-4 mb-4">
                  <Settings className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Settings content will appear here</h3>
                <p className="text-gray-500 max-w-md">
                  This is a preview of the settings tab. In a real implementation, this would show brand settings for {brand.name}.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default BrandDetail;
