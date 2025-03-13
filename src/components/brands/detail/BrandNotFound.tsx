
import React from 'react';
import { Link } from 'react-router-dom';

const BrandNotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-xl font-semibold text-gray-700">Brand not found</h2>
      <p className="text-gray-500 mb-4">The brand you're looking for doesn't exist.</p>
      <Link to="/brands" className="text-empowerlocal-blue hover:underline">
        Back to My Brands
      </Link>
    </div>
  );
};

export default BrandNotFound;
