
import React, { useState } from 'react';
import { X, Image, Upload, Lock, Users, Globe } from 'lucide-react';
import { PublisherList } from './types';

interface CreateListModalProps {
  onClose: () => void;
  onCreateList: (list: Partial<PublisherList>) => void;
}

const CreateListModal: React.FC<CreateListModalProps> = ({ onClose, onCreateList }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'team' | 'public'>('private');
  const [coverImage, setCoverImage] = useState('');
  
  // Categories for dropdown
  const categories = ['Seasonal', 'News', 'Regional', 'Demographic', 'Performance', 'Niche'];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) return;
    
    const newList: Partial<PublisherList> = {
      name,
      description,
      category,
      visibility,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80', // Default image
      publisherCount: 0,
      publishers: [],
      lastUpdated: new Date(),
      isShared: false
    };
    
    onCreateList(newList);
  };
  
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-empowerlocal-navy">Create New List</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* List Name */}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-empowerlocal-blue focus:border-transparent"
                placeholder="Enter list description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            
            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
                {coverImage ? (
                  <div className="relative w-full">
                    <img 
                      src={coverImage} 
                      alt="Cover" 
                      className="h-32 w-full object-cover rounded-lg" 
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Image className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Drag & drop an image or click to browse</p>
                    <button
                      type="button"
                      onClick={() => {
                        // Mock file selection with a sample URL
                        setCoverImage('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80');
                      }}
                      className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1"
                    >
                      <Upload className="h-4 w-4" />
                      Browse
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-empowerlocal-blue focus:border-transparent"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'private'}
                    onChange={() => setVisibility('private')}
                    className="mr-3"
                  />
                  <Lock className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <div className="font-medium">Private</div>
                    <div className="text-sm text-gray-500">Only you can see this list</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'team'}
                    onChange={() => setVisibility('team')}
                    className="mr-3"
                  />
                  <Users className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <div className="font-medium">Team</div>
                    <div className="text-sm text-gray-500">Your team members can view and edit</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'public'}
                    onChange={() => setVisibility('public')}
                    className="mr-3"
                  />
                  <Globe className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <div className="font-medium">Public</div>
                    <div className="text-sm text-gray-500">Anyone in your organization can view</div>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-empowerlocal-blue text-white rounded-lg font-medium hover:bg-empowerlocal-navy transition-colors disabled:bg-gray-300"
                disabled={!name.trim()}
              >
                Create List
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateListModal;
