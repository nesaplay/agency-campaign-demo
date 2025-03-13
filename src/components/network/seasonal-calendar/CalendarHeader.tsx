import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { format } from 'date-fns';
interface CalendarHeaderProps {
  currentMonth: Date;
  navigateMonth: (direction: 'prev' | 'next') => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  regions: string[];
  categories: string[];
}
const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  navigateMonth,
  selectedRegion,
  setSelectedRegion,
  selectedCategory,
  setSelectedCategory,
  regions,
  categories
}) => {
  return <div className="p-4 border-b border-gray-200 flex items-center justify-between">
      
      
      <div className="flex items-center gap-4">
        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button onClick={() => navigateMonth('prev')} className="p-1 rounded-lg hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
          <span className="font-medium min-w-24 text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button onClick={() => navigateMonth('next')} className="p-1 rounded-lg hover:bg-gray-100">
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <Filter className="h-4 w-4 text-gray-400 mr-1" />
            <select className="text-sm border-0 focus:ring-0 py-1" value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)}>
              <option>All Regions</option>
              {regions.map(region => <option key={region} value={region}>{region}</option>)}
            </select>
          </div>
          
          <div className="flex items-center">
            <select className="text-sm border-0 focus:ring-0 py-1" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
              <option>All Categories</option>
              {categories.map(category => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>;
};
export default CalendarHeader;