
import React from 'react';

interface NameDescriptionFieldsProps {
  name: string;
  description: string;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
}

const NameDescriptionFields: React.FC<NameDescriptionFieldsProps> = ({
  name,
  description,
  setName,
  setDescription
}) => {
  return (
    <>
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
    </>
  );
};

export default NameDescriptionFields;
