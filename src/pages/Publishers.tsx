import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { Publisher } from '@/components/network/types';
import usePublisherStore from '@/stores/usePublisherStore'; // Import the store
import PublisherCard from '@/components/network/PublisherCard';
import { Plus, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"; // Keep toast for future use

const PublishersPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const publishers = usePublisherStore((state) => state.publishers);

  const [filteredPublishers, setFilteredPublishers] = useState<Publisher[]>(publishers); // Initialize with store data
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Update filtered list when store data or search query changes
    let currentFiltered = publishers;
    if (searchQuery.trim()) {
      currentFiltered = publishers.filter(publisher => 
        publisher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (publisher.location && publisher.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    setFilteredPublishers(currentFiltered);
  }, [publishers, searchQuery]); // Depend on publishers from store

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePublisherClick = (publisherId: string) => {
    navigate(`/publishers/${publisherId}`); 
  };
  
  const handleAddNewPublisher = () => {
    // toast({ title: "Coming Soon!", description: "Adding new publishers will be available soon." });
    // navigate('/publishers/new/edit'); 
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-empowerlocal-bg">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="heading-1 text-2xl font-semibold text-empowerlocal-navy">Publishers</h1>
            <button 
              className="btn-primary flex items-center gap-2"
              onClick={handleAddNewPublisher}
            >
              <Plus className="h-5 w-5" />
              Add New Publisher
            </button>
          </div>
        </div>
        
        {/* Filters/Search Bar */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-end"> 
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search publishers by name or location..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-empowerlocal-blue focus:border-transparent small-text w-64"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
        
        {/* Publishers Grid */}
        <div className="section flex-1 p-6 overflow-auto">
          {filteredPublishers.length > 0 ? (
            <div className="card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPublishers.map(publisher => (
                <PublisherCard 
                  key={publisher.id} 
                  publisher={publisher} 
                  onClick={() => handlePublisherClick(publisher.id)}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="bg-gray-100 p-6 rounded-full">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium heading-3">No publishers found</h3>
              <p className="mt-2 text-sm body-text">
                {searchQuery ? "Try adjusting your search." : "There are no publishers to display."}
              </p>
              {!searchQuery && (
                 <button 
                    className="btn-primary mt-6 flex items-center gap-2"
                    onClick={handleAddNewPublisher}
                  >
                    <Plus className="h-5 w-5" />
                    Add New Publisher
                  </button>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default PublishersPage; 