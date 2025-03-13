
import React from 'react';

interface CategorySelectorProps {
  category: string;
  setCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ category, setCategory }) => {
  // Categories for dropdown
  const categories = ['Seasonal', 'News', 'Regional', 'Demographic', 'Performance', 'Niche'];
  
  return (
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
  );
};

export default CategorySelector;
