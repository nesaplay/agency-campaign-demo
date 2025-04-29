
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { PublisherList } from '@/components/lists/types';
import { mockLists } from '@/components/lists/mockListsData';
import { mockPublishers } from '@/components/network/mockData';
import { Publisher } from '@/components/network/types';
import PublisherDetail from '@/components/network/PublisherDetail';
import { Toaster } from "@/components/ui/toaster";
import ListDetailHeader from '@/components/lists/detail/ListDetailHeader';
import ListDetailContent from '@/components/lists/detail/ListDetailContent';

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
    const foundList = mockLists.find(l => l.id === id);
    if (foundList) {
      setList(foundList);
      setEditedName(foundList.name);
      setEditedDescription(foundList.description);
      
      const listPublishers = mockPublishers.filter(p => foundList.publishers.includes(p.id));
      setPublishers(listPublishers);
    } else {
      navigate('/lists');
    }
  }, [id, navigate]);
  
  const handleSaveEdit = () => {
    if (!list) return;
    
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
    
    const updatedPublishers = publishers.filter(p => p.id !== publisherId);
    setPublishers(updatedPublishers);
    
    setList({
      ...list,
      publishers: list.publishers.filter(id => id !== publisherId),
      publisherCount: list.publisherCount - 1,
      lastUpdated: new Date()
    });
  };

  const handleAddPublisherToCampaign = (publisherId: string) => {
    console.log('Adding publisher to campaign:', publisherId);
    // Add your logic here to add the publisher to the campaign
  };
  
  const handleViewPublisherDetails = (publisher: Publisher) => {
    setSelectedPublisher(publisher);
  };
  
  const handleCreateCampaign = () => {
    console.log('Creating campaign from list', list?.id);
    alert('Creating a new campaign with this publisher list!');
  };
  
  if (!list) {
    return (
      <MainLayout>
        <div className="flex flex-col h-full items-center justify-center bg-empowerlocal-bg">
          <p className="body-text">Loading...</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-empowerlocal-bg">
        <ListDetailHeader 
          list={list}
          isEditing={isEditing}
          editedName={editedName}
          editedDescription={editedDescription}
          setEditedName={setEditedName}
          setEditedDescription={setEditedDescription}
          setIsEditing={setIsEditing}
          handleSaveEdit={handleSaveEdit}
          handleCreateCampaign={handleCreateCampaign}
        />
        
        <ListDetailContent
          publishers={publishers}
          viewMode={viewMode}
          setViewMode={setViewMode}
          handleViewPublisherDetails={handleViewPublisherDetails}
          handleRemovePublisher={handleRemovePublisher}
        />
      </div>
      
      {selectedPublisher && (
        <PublisherDetail 
          publisher={selectedPublisher} 
          onClose={() => setSelectedPublisher(null)} 
          onAddPublisherToCampaign={handleAddPublisherToCampaign}
        />
      )}
      
      <Toaster />
    </MainLayout>
  );
};

export default ListDetail;
