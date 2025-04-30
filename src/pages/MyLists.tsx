import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { PublisherList, ListCategory } from '@/components/lists/types';
import useListStore from '@/stores/useListStore';
import ListCard from '@/components/lists/ListCard';
import { Plus, Search } from 'lucide-react';
import CreateListModal from '@/components/lists/create-modal/CreateListModal';
import { useToast } from "@/hooks/use-toast";

const MyLists: React.FC = () => {
  const navigate = useNavigate();
  const { lists, addList } = useListStore();
  const [filteredLists, setFilteredLists] = useState<PublisherList[]>(lists);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ListCategory>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const categoryFiltered = getFilteredListsByCategory(activeCategory, lists);
    if (searchQuery.trim()) {
      const searchFiltered = categoryFiltered.filter(list => 
        list.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        list.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLists(searchFiltered);
    } else {
      setFilteredLists(categoryFiltered);
    }
  }, [lists, activeCategory, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    const baseLists = getFilteredListsByCategory(activeCategory, lists);
    if (!query.trim()) {
      setFilteredLists(baseLists);
      return;
    }
    
    const filtered = baseLists.filter(list => 
      list.name.toLowerCase().includes(query.toLowerCase()) || 
      list.description.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredLists(filtered);
  };

  const getFilteredListsByCategory = (category: ListCategory, listsToFilter: PublisherList[]) => {
    switch(category) {
      case 'recent':
        return [...listsToFilter].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
      case 'shared':
        return listsToFilter.filter(list => list.isShared);
      case 'category':
        return listsToFilter;
      case 'all':
      default:
        return listsToFilter;
    }
  };

  const handleCategoryChange = (category: ListCategory) => {
    setActiveCategory(category);
    setFilteredLists(getFilteredListsByCategory(category, lists));
  };

  const handleListClick = (listId: string) => {
    navigate(`/lists/${listId}`);
  };

  const handleCreateList = (newListData: Omit<PublisherList, 'id' | 'publishers' | 'publisherCount' | 'lastUpdated' | 'createdBy' | 'isShared' | 'totalReach' | 'category'> & { publishers: string[] }) => {
    const listToAdd = {
      name: newListData.name,
      description: newListData.description,
      publishers: [],
      visibility: newListData.visibility,
    }
    
    const createdList = addList(listToAdd);
    
    setShowCreateModal(false);

    toast({
      title: "List Created",
      description: `"${createdList.name}" has been successfully created.`,
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-empowerlocal-bg">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="heading-1 text-2xl font-semibold text-empowerlocal-navy">My Lists</h1>
            <button 
              className="btn-primary flex items-center gap-2"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-5 w-5" />
              Create New List
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors small-text ${
                  activeCategory === 'all' ? 'bg-gray-100 text-empowerlocal-navy' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => handleCategoryChange('all')}
              >
                All Lists
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors small-text ${
                  activeCategory === 'recent' ? 'bg-gray-100 text-empowerlocal-navy' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => handleCategoryChange('recent')}
              >
                Recently Updated
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors small-text ${
                  activeCategory === 'category' ? 'bg-gray-100 text-empowerlocal-navy' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => handleCategoryChange('category')}
              >
                By Category
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors small-text ${
                  activeCategory === 'shared' ? 'bg-gray-100 text-empowerlocal-navy' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => handleCategoryChange('shared')}
              >
                Shared with Me
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search lists..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-empowerlocal-blue focus:border-transparent small-text"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
        
        {/* Lists Grid */}
        <div className="section flex-1 p-6 overflow-auto">
          {filteredLists.length > 0 ? (
            <div className="card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLists.map(list => (
                <ListCard 
                  key={list.id} 
                  list={list} 
                  onClick={() => handleListClick(list.id)}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="bg-gray-100 p-6 rounded-full">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium heading-3">No lists found</h3>
              <p className="mt-2 text-sm body-text">Try adjusting your search or filters</p>
              <button 
                className="btn-primary mt-6 flex items-center gap-2"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-5 w-5" />
                Create New List
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Create List Modal */}
      {showCreateModal && (
        <CreateListModal 
          onClose={() => setShowCreateModal(false)}
          onCreateList={handleCreateList}
        />
      )}
    </MainLayout>
  );
};

export default MyLists;
