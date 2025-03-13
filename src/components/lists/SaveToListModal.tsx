
import React, { useState } from 'react';
import { X, Search, Plus, Clock, Check } from 'lucide-react';
import { PublisherList } from './types';

interface SaveToListModalProps {
  onClose: () => void;
  onSave: (listId: string, publisherIds: string[]) => void;
  publisherIds: string[];
  lists: PublisherList[];
}

const SaveToListModal: React.FC<SaveToListModalProps> = ({ onClose, onSave, publisherIds, lists }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newListName, setNewListName] = useState('');
  
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
  
  const handleCreateNewList = () => {
    if (!newListName.trim()) return;
    
    // In a real app, this would create a new list and then save publishers to it
    const newListId = `new-${Date.now()}`;
    console.log('Creating new list:', newListName);
    onSave(newListId, publisherIds);
  };
  
  const publisherText = publisherIds.length === 1 
    ? '1 publisher' 
    : `${publisherIds.length} publishers`;
  
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-empowerlocal-navy">
              {showCreateNew ? 'Create New List' : 'Save to List'}
            </h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* Show create new list form */}
          {showCreateNew ? (
            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-500">
                Create a new list and add {publisherText} to it.
              </p>
              
              <div>
                <label htmlFor="list-name" className="block text-sm font-medium text-gray-700 mb-1">
                  List Name*
                </label>
                <input
                  id="list-name"
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-empowerlocal-blue focus:border-transparent"
                  placeholder="Enter list name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateNew(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewList}
                  className="px-4 py-2 bg-empowerlocal-blue text-white rounded-lg font-medium hover:bg-empowerlocal-navy transition-colors disabled:bg-gray-300"
                  disabled={!newListName.trim()}
                >
                  Create & Add
                </button>
              </div>
            </div>
          ) : (
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
                  onClick={() => setShowCreateNew(true)}
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
                  <>
                    {/* Recent Lists section */}
                    <div className="mb-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                        <Clock className="h-4 w-4" />
                        <span>Recent Lists</span>
                      </div>
                      
                      <div className="space-y-2">
                        {recentLists.map(list => (
                          <div 
                            key={list.id}
                            className={`p-3 border rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                              selectedListId === list.id 
                                ? 'border-empowerlocal-blue bg-empowerlocal-blue/5' 
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedListId(list.id)}
                          >
                            <div className="bg-gray-100 h-10 w-10 rounded-md flex items-center justify-center">
                              {selectedListId === list.id ? (
                                <Check className="h-5 w-5 text-empowerlocal-blue" />
                              ) : (
                                <span className="text-xs font-medium text-gray-500">{list.publisherCount}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{list.name}</div>
                              <div className="text-xs text-gray-500 truncate">
                                {list.publisherCount} publishers • {list.lastUpdated.toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {/* All filtered lists */}
                {filteredLists.length > 0 && searchQuery.trim() !== '' && (
                  <div className="space-y-2">
                    {filteredLists.map(list => (
                      <div 
                        key={list.id}
                        className={`p-3 border rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                          selectedListId === list.id 
                            ? 'border-empowerlocal-blue bg-empowerlocal-blue/5' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedListId(list.id)}
                      >
                        <div className="bg-gray-100 h-10 w-10 rounded-md flex items-center justify-center">
                          {selectedListId === list.id ? (
                            <Check className="h-5 w-5 text-empowerlocal-blue" />
                          ) : (
                            <span className="text-xs font-medium text-gray-500">{list.publisherCount}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{list.name}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {list.publisherCount} publishers • {list.lastUpdated.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* No results state */}
                {filteredLists.length === 0 && searchQuery.trim() !== '' && (
                  <div className="py-8 flex flex-col items-center justify-center text-gray-500">
                    <Search className="h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-sm mb-2">No lists found matching "{searchQuery}"</p>
                    <button 
                      className="text-empowerlocal-blue text-sm font-medium hover:underline"
                      onClick={() => setShowCreateNew(true)}
                    >
                      Create a new list?
                    </button>
                  </div>
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
                  onClick={() => selectedListId && onSave(selectedListId, publisherIds)}
                  className="px-4 py-2 bg-empowerlocal-blue text-white rounded-lg font-medium hover:bg-empowerlocal-navy transition-colors disabled:bg-gray-300"
                  disabled={!selectedListId}
                >
                  Save to List
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SaveToListModal;
