
import React from 'react';
import { X } from 'lucide-react';
import { PublisherList } from '../types';
import CreateListForm from './CreateListForm';

interface CreateListModalProps {
  onClose: () => void;
  onCreateList: (list: Partial<PublisherList>) => void;
}

const CreateListModal: React.FC<CreateListModalProps> = ({ onClose, onCreateList }) => {
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
          
          <CreateListForm onClose={onClose} onCreateList={onCreateList} />
        </div>
      </div>
    </>
  );
};

export default CreateListModal;
