
import React, { useState } from 'react';

interface CreateNewListFormProps {
  onClose: () => void;
  onCreateList: (listName: string) => void;
  publisherText: string;
}

const CreateNewListForm: React.FC<CreateNewListFormProps> = ({ onClose, onCreateList, publisherText }) => {
  const [newListName, setNewListName] = useState('');
  
  const handleCreateNewList = () => {
    if (!newListName.trim()) return;
    onCreateList(newListName);
  };
  
  return (
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
          onClick={onClose}
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
  );
};

export default CreateNewListForm;
