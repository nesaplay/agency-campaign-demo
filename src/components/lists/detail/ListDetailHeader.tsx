
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit2, 
  Rocket,
  Share2,
  Lock,
  Globe,
  Users,
  BarChart2,
  MapPin
} from 'lucide-react';
import { PublisherList } from '@/components/lists/types';

interface ListDetailHeaderProps {
  list: PublisherList;
  isEditing: boolean;
  editedName: string;
  editedDescription: string;
  setEditedName: (name: string) => void;
  setEditedDescription: (description: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  handleSaveEdit: () => void;
  handleCreateCampaign: () => void;
}

const ListDetailHeader: React.FC<ListDetailHeaderProps> = ({
  list,
  isEditing,
  editedName,
  editedDescription,
  setEditedName,
  setEditedDescription,
  setIsEditing,
  handleSaveEdit,
  handleCreateCampaign
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <button 
          onClick={() => navigate('/lists')}
          className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full text-2xl font-semibold text-empowerlocal-navy bg-gray-100 p-2 rounded-lg"
              autoFocus
            />
          ) : (
            <h1 className="text-2xl font-semibold text-empowerlocal-navy">{list.name}</h1>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {isEditing ? (
            <button 
              onClick={handleSaveEdit}
              className="flex items-center gap-2 bg-empowerlocal-green text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Save
            </button>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                Edit List
              </button>
              <button 
                onClick={handleCreateCampaign}
                className="flex items-center gap-2 bg-empowerlocal-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-empowerlocal-navy transition-colors"
              >
                <Rocket className="h-4 w-4" />
                Create Campaign
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex-1">
          {isEditing ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows={3}
              className="w-full text-gray-600 bg-gray-100 p-2 rounded-lg"
            />
          ) : (
            <p className="text-gray-600">{list.description}</p>
          )}
          
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <div className="flex items-center">
              {list.visibility === 'private' ? (
                <Lock className="h-4 w-4 mr-1" />
              ) : list.visibility === 'team' ? (
                <Share2 className="h-4 w-4 mr-1" />
              ) : (
                <Globe className="h-4 w-4 mr-1" />
              )}
              <span className="capitalize">{list.visibility}</span>
            </div>
            <span>•</span>
            <span>Updated {list.lastUpdated.toLocaleDateString()}</span>
          </div>
        </div>
        
        <ListDetailStats list={list} />
      </div>
    </div>
  );
};

interface ListDetailStatsProps {
  list: PublisherList;
}

const ListDetailStats: React.FC<ListDetailStatsProps> = ({ list }) => {
  return (
    <div className="flex flex-wrap gap-4 md:gap-6">
      <StatCard 
        icon={<Users className="h-4 w-4 mr-1" />} 
        label="Publishers" 
        value={list.publisherCount.toString()} 
      />
      <StatCard 
        icon={<BarChart2 className="h-4 w-4 mr-1" />} 
        label="Total Reach" 
        value={list.totalReach} 
      />
      <StatCard 
        icon={<MapPin className="h-4 w-4 mr-1" />} 
        label="Category" 
        value={list.category || 'N/A'} 
      />
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 min-w-[120px]">
      <div className="flex items-center text-gray-500 mb-1">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
};

export default ListDetailHeader;

