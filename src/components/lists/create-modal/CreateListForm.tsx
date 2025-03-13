
import React, { useState } from 'react';
import { PublisherList } from '../types';
import NameDescriptionFields from './NameDescriptionFields';
import CoverImageUploader from './CoverImageUploader';
import CategorySelector from './CategorySelector';
import VisibilityOptions from './VisibilityOptions';

interface CreateListFormProps {
  onClose: () => void;
  onCreateList: (list: Partial<PublisherList>) => void;
}

const CreateListForm: React.FC<CreateListFormProps> = ({ onClose, onCreateList }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'team' | 'public'>('private');
  const [coverImage, setCoverImage] = useState('');
  
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
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <NameDescriptionFields 
        name={name}
        description={description}
        setName={setName}
        setDescription={setDescription}
      />
      
      <CoverImageUploader 
        coverImage={coverImage}
        setCoverImage={setCoverImage}
      />
      
      <CategorySelector 
        category={category}
        setCategory={setCategory}
      />
      
      <VisibilityOptions 
        visibility={visibility}
        setVisibility={setVisibility}
      />
      
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
  );
};

export default CreateListForm;
