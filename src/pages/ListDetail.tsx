import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { PublisherList } from "@/components/lists/types";
import useListStore from "@/stores/useListStore";
import usePublisherStore from "@/stores/usePublisherStore";
import { Publisher } from "@/components/network/types";
import PublisherDetail from "@/components/network/PublisherDetail";
import { Toaster } from "@/components/ui/toaster";
import ListDetailHeader from "@/components/lists/detail/ListDetailHeader";
import ListDetailContent from "@/components/lists/detail/ListDetailContent";
import { useToast } from "@/hooks/use-toast";

const ListDetail: React.FC = () => {
  const { id: listId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lists, updateList, removePublisherFromList, addPublisherToList } = useListStore();
  const { getPublisherById, publishers: allPublishersFromStore } = usePublisherStore();
  const { toast } = useToast();

  const [list, setList] = useState<PublisherList | null>(null);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Publisher[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const availablePublishersForSearch = React.useMemo(() => {
    if (!list) return [];
    return allPublishersFromStore.filter(p => !list.publishers.includes(p.id));
  }, [list, allPublishersFromStore]);

  useEffect(() => {
    const foundList = lists.find((l) => l.id === listId);

    if (foundList) {
      setList(foundList);
      setEditedName(foundList.name);
      setEditedDescription(foundList.description);

      const listPublishersData = foundList.publishers
        .map(publisherId => getPublisherById(publisherId))
        .filter((p): p is Publisher => p !== undefined);
      
      setPublishers(listPublishersData);
    } else {
      navigate("/lists");
    }
  }, [listId, lists, navigate, getPublisherById]);

  const handleSaveEdit = () => {
    if (!list) return;

    const updatedListData = {
      ...list,
      name: editedName,
      description: editedDescription,
    };
    updateList(updatedListData);
    setIsEditing(false);
    toast({ title: "List Updated", description: `"${editedName}" has been updated.` });
  };

  const handleRemovePublisher = (publisherId: string) => {
    if (!list) return;

    removePublisherFromList(list.id, publisherId);
    toast({ title: "Publisher Removed", description: `Publisher removed from the list.` });
  };

  // Handle input focus
  const handleSearchFocus = () => {
    // If the search query is empty when focusing, show all available publishers
    if (!searchQuery) {
      setSearchResults(availablePublishersForSearch.slice(0, 10)); // Limit initial display
    }
    // Always show the dropdown on focus if there are results (or if query is empty showing all)
    if (searchResults.length > 0 || !searchQuery) {
      setShowSearchResults(true);
    }
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 1) {
      // Filter available publishers based on query
      const results = availablePublishersForSearch.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results.slice(0, 10)); 
      setShowSearchResults(true);
    } else {
      // If query is short/empty, show all available publishers (respecting limit)
      setSearchResults(availablePublishersForSearch.slice(0, 10));
      // Keep dropdown open only if focused and query is empty, 
      // otherwise, let onBlur handle closing or focus handle opening.
      // We'll manage explicit showing in onFocus.
      setShowSearchResults(query.length === 0); // Show if empty, hide if 1 char
       if (query.length === 0) {
         // If query cleared, ensure dropdown is shown (replicates focus behavior)
         setShowSearchResults(true);
       }
    }
  };

  const handleAddPublisherToList = (publisher: Publisher) => {
    if (!list || !publisher) return;
    addPublisherToList(list.id, publisher.id);
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
    toast({ title: "Publisher Added", description: `"${publisher.name}" added to the list.` });
  };

  const handleViewPublisherDetails = (publisher: Publisher) => {
    setSelectedPublisher(publisher);
  };

  const handleCreateCampaign = () => {
    if (!list || publishers.length === 0) {
      toast({
        title: "Cannot Create Campaign",
        description: "Add publishers to the list before creating a campaign.",
        variant: "destructive",
      });
      return;
    }
    
    const publisherIds = list.publishers;
    console.log("Navigating to create campaign with publishers:", publisherIds);
    navigate('/network-navigator', { state: { preselectedPublisherIds: publisherIds } });
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
          searchQuery={searchQuery}
          searchResults={searchResults}
          showSearchResults={showSearchResults}
          handleSearchChange={handleSearchChange}
          handleAddPublisherToList={handleAddPublisherToList}
          setShowSearchResults={setShowSearchResults}
          handleSearchFocus={handleSearchFocus}
        />
      </div>

      {selectedPublisher && (
        <PublisherDetail
          publisher={selectedPublisher}
          onClose={() => setSelectedPublisher(null)}
        />
      )}

      <Toaster />
    </MainLayout>
  );
};

export default ListDetail;
