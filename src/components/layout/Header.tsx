
import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import BrandSelector from '@/components/brands/BrandSelector';
import ThemeToggle from '@/components/theme/ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-white/10 bg-gradient-to-r from-empowerlocal-navy to-[#1A3766] px-6 flex items-center justify-between">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-white/60" />
        </div>
        <input
          type="search"
          placeholder="Search publishers, campaigns..."
          className="block w-full pl-10 pr-3 py-2 border border-white/20 rounded-lg bg-white/10 text-sm text-white placeholder-white/60 focus:ring-empowerlocal-blue focus:border-empowerlocal-blue"
        />
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4">
        {/* Brand Selector */}
        <BrandSelector />
        
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Notification Bell */}
        <button className="p-2 rounded-full hover:bg-white/10 relative">
          <Bell className="h-5 w-5 text-white" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">Jane Cooper</p>
            <p className="text-xs text-white/70">Media Buyer</p>
          </div>
          <div className={cn(
            "h-9 w-9 rounded-full flex items-center justify-center text-empowerlocal-navy font-medium text-sm",
            "bg-white"
          )}>
            JC
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
