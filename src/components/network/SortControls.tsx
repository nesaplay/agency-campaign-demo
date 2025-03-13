import React from 'react';
import { ArrowUpDown } from 'lucide-react';
interface SortControlsProps {
  onSortChange: (value: string) => void;
}
const SortControls: React.FC<SortControlsProps> = ({
  onSortChange
}) => {
  return <div className="flex items-center text-sm text-gray-500">
      <span className="mr-2">Sort by:</span>
      <select className="border-0 focus:ring-0 pr-8 py-0 text-sm" onChange={e => onSortChange(e.target.value)}>
        <option value="relevance">Relevance</option>
        <option value="audience">Audience Size</option>
        <option value="performance">Performance</option>
      </select>
      
    </div>;
};
export default SortControls;