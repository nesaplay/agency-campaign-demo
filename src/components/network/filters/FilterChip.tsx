
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface FilterChipProps {
  label: string;
  colorClass?: string;
  onRemove: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({
  label,
  colorClass = "bg-blue-50 text-blue-700",
  onRemove
}) => {
  return (
    <div className={cn("px-2 py-1 rounded-full text-xs flex items-center gap-1", colorClass)}>
      {label}
      <button onClick={onRemove}>
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};

export default FilterChip;
