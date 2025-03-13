
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { PublisherList } from '@/components/lists/types';
import { mockLists } from '@/components/lists/mockListsData';
import { mockPublishers } from '@/components/network/mockData';
import { Publisher } from '@/components/network/types';
import { 
  ArrowLeft, 
  Edit2, 
  Rocket, 
  Users, 
  BarChart2, 
  MapPin, 
  Grid, 
  List as ListIcon,
  Share2,
  Lock,
  Globe
} from 'lucide-react';
import PublisherCard from '@/components/network/PublisherCard';
import PublisherListItem from '@/components/network/PublisherListItem';
import PublisherDetail from '@/components/network/PublisherDetail';
import { Toaster } from "@/components/ui/toaster";

const ListDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [list, setList] = useState<PublisherList | null>(null);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  
  useEffect(() => {
    // Find the list in our mock data
    const foundList = mockLists.find(l => l.id === id);
    if (foundList) {
      setList(foundList);
      setEditedName(foundList.name);
      setEditedDescription(foundList.description);
      
      // Get publishers that are in this list
      const listPublishers = mockPublishers.filter(p => foundList.publishers.includes(p.id));
      setPublishers(listPublishers);
    } else {
      // List not found, navigate back
      navigate('/lists');
    }
  }, [id, navigate]);
  
  const handleSaveEdit = () => {
    if (!list) return;
    
    // In a real app, you'd send this to an API
    setList({
      ...list,
      name: editedName,
      description: editedDescription,
      lastUpdated: new Date()
    });
    
    setIsEditing(false);
  };
  
  const handleRemovePublisher = (publisherId: string) => {
    if (!list) return;
    
    // Filter out the publisher from our list
    const updatedPublishers = publishers.filter(p => p.id !== publisherId);
    setPublishers(updatedPublishers);
    
    // Update the list as well
    setList({
      ...list,
      publishers: list.publishers.filter(id => id !== publisherId),
      publisherCount: list.publisherCount - 1,
      lastUpdated: new Date()
    });
  };
  
  const handleViewPublisherDetails = (publisher: Publisher) => {
    setSelectedPublisher(publisher);
  };
  
  const handleCreateCampaign = () => {
    // In a real app, this would navigate to campaign creation with prefilled list
    console.log('Creating campaign from list', list?.id);
    alert('Creating a new campaign with this publisher list!');
  };
  
  if (!list) {
    return (
      <MainLayout>
        <div className="flex flex-col h-full items-center justify-center bg-gray-50">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
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
          
          {/* Description & Stats */}
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
            
            <div className="flex flex-wrap gap-4 md:gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 min-w-[120px]">
                <div className="flex items-center text-gray-500 mb-1">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">Publishers</span>
                </div>
                <div className="text-xl font-semibold">{list.publisherCount}</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 min-w-[120px]">
                <div className="flex items-center text-gray-500 mb-1">
                  <BarChart2 className="h-4 w-4 mr-1" />
                  <span className="text-sm">Total Reach</span>
                </div>
                <div className="text-xl font-semibold">{list.totalReach}</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 min-w-[120px]">
                <div className="flex items-center text-gray-500 mb-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">Category</span>
                </div>
                <div className="text-xl font-semibold">{list.category || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Publishers */}
        <div className="flex-1 overflow-auto flex">
          <div className="flex-1">
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between sticky top-0 z-10">
              <h2 className="font-medium text-empowerlocal-navy">Publishers in this list</h2>
              
              <div className="flex bg-gray-100 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-empowerlocal-blue text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  <ListIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {publishers.length > 0 ? (
              <div className="p-6">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {publishers.map(publisher => (
                      <div key={publisher.id}>
                        <PublisherCard 
                          publisher={publisher}
                          onClick={() => handleViewPublisherDetails(publisher)}
                          onDelete={() => handleRemovePublisher(publisher.id)}
                          onViewDetails={() => handleViewPublisherDetails(publisher)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {publishers.map(publisher => (
                      <div key={publisher.id}>
                        <PublisherListItem 
                          publisher={publisher}
                          onClick={() => handleViewPublisherDetails(publisher)}
                          onDelete={() => handleRemovePublisher(publisher.id)}
                          onViewDetails={() => handleViewPublisherDetails(publisher)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-500 p-6">
                <div className="bg-gray-100 p-6 rounded-full">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No publishers in this list</h3>
                <p className="mt-2 text-sm">Browse the Network Navigator to add publishers</p>
                <button 
                  className="mt-6 flex items-center gap-2 bg-empowerlocal-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-empowerlocal-navy transition-colors"
                  onClick={() => navigate('/network-navigator')}
                >
                  <MapPin className="h-4 w-4" />
                  Explore Media
                </button>
              </div>
            )}
          </div>
          
          {/* Publisher Detail Sidebar */}
          {selectedPublisher && (
            <PublisherDetail 
              publisher={selectedPublisher} 
              onClose={() => setSelectedPublisher(null)} 
            />
          )}
        </div>
      </div>
      <Toaster />
    </MainLayout>
  );
};

export default ListDetail;
