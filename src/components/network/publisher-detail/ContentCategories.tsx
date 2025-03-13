
import React from 'react';

interface ContentCategoriesProps {
  categories: string[];
}

const ContentCategories: React.FC<ContentCategoriesProps> = ({ categories }) => {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-500 mb-2">Content Categories</h4>
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
            {category}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ContentCategories;
