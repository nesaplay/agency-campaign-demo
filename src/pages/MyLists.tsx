
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { PublisherList, ListCategory } from '@/components/lists/types';
import { mockLists } from '@/components/lists/mockListsData';
import ListCard from '@/components/lists/ListCard';
import { Plus, Search } from 'lucide-react';
import CreateListModal from '@/components/lists/CreateListModal';

const MyLists: React.FC = () => {
  const navigate = useNavigate();
  const [lists] = useState<PublisherList[]>(mockLists);
  const [filteredLists, setFilteredLists] = useState<PublisherList[]>(mockLists);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ListCategory>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredLists(getFilteredListsByCategory(activeCategory, lists));
      return;
    }
    
    const filtered = lists.filter(list => 
      list.name.toLowerCase().includes(query.toLowerCase()) || 
      list.description.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredLists(filtered);
  };

  const getFilteredListsByCategory = (category: ListCategory, listsToFilter: PublisherList[]) => {
    switch(category) {
      case 'recent':
        return [...listsToFilter].sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
      case 'shared':
        return listsToFilter.filter(list => list.isShared);
      case 'category':
        // This would actually group by category, but for now we'll just show all
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

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-empowerlocal-navy">My Lists</h1>
            <button 
              className="flex items-center gap-2 bg-empowerlocal-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-empowerlocal-navy transition-colors"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-5 w-5" />
              Create New List
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === 'all' ? 'bg-gray-100 text-empowerlocal-navy' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => handleCategoryChange('all')}
              >
                All Lists
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === 'recent' ? 'bg-gray-100 text-empowerlocal-navy' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => handleCategoryChange('recent')}
              >
                Recently Updated
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === 'category' ? 'bg-gray-100 text-empowerlocal-navy' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => handleCategoryChange('category')}
              >
                By Category
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-empowerlocal-blue focus:border-transparent"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
        
        {/* Lists Grid */}
        <div className="flex-1 p-6 overflow-auto">
          {filteredLists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <h3 className="mt-4 text-lg font-medium">No lists found</h3>
              <p className="mt-2 text-sm">Try adjusting your search or filters</p>
              <button 
                className="mt-6 flex items-center gap-2 bg-empowerlocal-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-empowerlocal-navy transition-colors"
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
          onCreateList={(list) => {
            console.log("List created:", list);
            setShowCreateModal(false);
            // In a real app, we would add the list to the lists array
          }}
        />
      )}
    </MainLayout>
  );
};

export default MyLists;
