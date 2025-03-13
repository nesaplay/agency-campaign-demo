
import React from 'react';
import { Image, Upload, X } from 'lucide-react';

interface CoverImageUploaderProps {
  coverImage: string;
  setCoverImage: (url: string) => void;
}

const CoverImageUploader: React.FC<CoverImageUploaderProps> = ({ coverImage, setCoverImage }) => {
  return (
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
  );
};

export default CoverImageUploader;
