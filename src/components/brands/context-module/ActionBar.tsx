
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Brand } from '../types';

interface ActionBarProps {
  brand: Brand;
}

const ActionBar: React.FC<ActionBarProps> = ({ brand }) => {
  return (
    <div className="px-4 pb-4 flex justify-end">
      <Button 
        variant="default"
        size="sm"
        asChild
        className="text-xs"
      >
        <Link to={`/brands/${brand.id}`}>
          View Full Profile
          <ExternalLink className="ml-1 h-3 w-3" />
        </Link>
      </Button>
    </div>
  );
};

export default ActionBar;
