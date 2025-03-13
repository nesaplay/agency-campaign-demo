
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const EmptyState: React.FC = () => {
  return (
    <CardContent className="p-6 flex justify-center items-center">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">No Brand Selected</h3>
        <p className="text-sm text-gray-500 mb-4">Select or create a brand to get started</p>
        <Button asChild>
          <Link to="/brands">Manage Brands</Link>
        </Button>
      </div>
    </CardContent>
  );
};

export default EmptyState;
