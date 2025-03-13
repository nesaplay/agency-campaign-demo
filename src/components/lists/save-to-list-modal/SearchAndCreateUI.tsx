
import React, { useState } from 'react';
import { Search, Plus, Clock } from 'lucide-react';
import { PublisherList } from '../types';
import ListItem from './ListItem';
import NoResults from './NoResults';
import RecentLists from './RecentLists';

interface SearchAndCreateUIProps {
  lists: PublisherList[];
  selectedListId: string | null;
  setSelectedListId: (id: string) => void;
  onShowCreateNew: () => void;
  onSave: () => void;
  onClose: () => void;
  publisherText: string;
}

const SearchAndCreateUI: React.FC<SearchAndCreateUIProps> = ({ 
  lists, 
  selectedListId, 
  setSelectedListId, 
  onShowCreateNew, 
  onSave, 
  onClose,
  publisherText
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter lists by search query
  const filteredLists = searchQuery.trim() 
    ? lists.filter(list => 
        list.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        list.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : lists;
  
  // Get recent lists (5 most recently updated)
  const recentLists = [...lists]
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
    .slice(0, 5);
  
  return (
    <>
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-3">
          Select a list to save {publisherText} to:
        </p>
        
        {/* Search field */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search lists..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-empowerlocal-blue focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Create new list option */}
        <div 
          className="p-3 border border-dashed border-gray-300 rounded-lg mb-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={onShowCreateNew}
        >
          <div className="bg-empowerlocal-blue/10 p-2 rounded-full">
            <Plus className="h-5 w-5 text-empowerlocal-blue" />
          </div>
          <div>
            <div className="font-medium text-empowerlocal-blue">Create New List</div>
            <div className="text-xs text-gray-500">Start a new collection of publishers</div>
          </div>
        </div>
        
        {searchQuery.trim() === '' && (
          <RecentLists
            recentLists={recentLists}
            selectedListId={selectedListId}
            setSelectedListId={setSelectedListId}
          />
        )}
        
        {/* All filtered lists */}
        {filteredLists.length > 0 && searchQuery.trim() !== '' && (
          <div className="space-y-2">
            {filteredLists.map(list => (
              <ListItem 
                key={list.id}
                list={list}
                isSelected={selectedListId === list.id}
                onSelect={() => setSelectedListId(list.id)}
              />
            ))}
          </div>
        )}
        
        {/* No results state */}
        {filteredLists.length === 0 && searchQuery.trim() !== '' && (
          <NoResults searchQuery={searchQuery} onCreateNew={onShowCreateNew} />
        )}
      </div>
      
      {/* Actions */}
      <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-empowerlocal-blue text-white rounded-lg font-medium hover:bg-empowerlocal-navy transition-colors disabled:bg-gray-300"
          disabled={!selectedListId}
        >
          Save to List
        </button>
      </div>
    </>
  );
};

export default SearchAndCreateUI;
