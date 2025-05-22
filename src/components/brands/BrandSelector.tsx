import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBrand } from './BrandContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

const BrandSelector: React.FC = () => {
  const { brands, activeBrand, setActiveBrand } = useBrand();

  if (!activeBrand) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6 rounded-full flex items-center justify-center bg-white text-empowerlocal-navy"
            style={{ backgroundColor: activeBrand.color }}
          >
            {activeBrand.name.charAt(0)}
          </div>
          <span className="text-sm font-medium text-white hidden sm:block">
            {activeBrand.name}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-white opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-semibold text-gray-500">Switch Brand</div>
        {brands.map((brand) => (
          <DropdownMenuItem
            key={brand.id}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              brand.isActive && "bg-gray-100"
            )}
            onClick={() => setActiveBrand(brand)}
          >
            <div
              className="h-6 w-6 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: brand.color }}
            >
              {brand.name.charAt(0)}
            </div>
            <span>{brand.name}</span>
            {brand.isActive && (
              <div className="ml-auto w-2 h-2 rounded-full bg-green-500"></div>
            )}
          </DropdownMenuItem>
        ))}
        <div className="border-t border-gray-100 my-1"></div>
        <DropdownMenuItem asChild>
          <Link
            to="/brands"
            className="cursor-pointer flex items-center justify-center text-empowerlocal-blue font-medium"
          >
            Manage All Brands
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BrandSelector;
