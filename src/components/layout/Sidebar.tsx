
import React from 'react';
import { 
  Home, 
  Bot, 
  BarChart3, 
  Settings, 
  LineChart,
  ChevronLeft,
  MapPin,
  ListChecks
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Bot, label: 'Ask Lassie', href: '/conversations' },
    { icon: MapPin, label: 'Explore Media', href: '/network-navigator' },
    { icon: ListChecks, label: 'My Lists', href: '/lists' },
    { icon: LineChart, label: 'Campaigns', href: '/campaigns' },
    { icon: BarChart3, label: 'Data & Analytics', href: '/analytics' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <aside
      className={cn(
        "h-full bg-white border-r border-gray-200 transition-all duration-300 flex flex-col relative",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Area */}
      <div className="p-4 border-b border-gray-200">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <div className="empowerlocal-gradient h-9 w-9 rounded-lg flex items-center justify-center text-white font-bold">
            E
          </div>
          {!collapsed && (
            <span className="text-empowerlocal-navy font-semibold text-xl">EmpowerLocal</span>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6">
        <ul className="space-y-1 px-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href || 
                            (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <li key={index}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-gray-100 text-empowerlocal-blue" 
                      : "text-gray-700 hover:bg-gray-100",
                    collapsed ? "justify-center" : ""
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    isActive && "text-empowerlocal-blue",
                    !isActive && (index === 0 && "text-empowerlocal-green" || 
                             index === 1 && "text-empowerlocal-blue" ||
                             index === 2 && "text-empowerlocal-navy" ||
                             index === 3 && "text-empowerlocal-green" ||
                             index !== 0 && index !== 1 && index !== 2 && index !== 3 && "text-gray-500")
                  )} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-md"
      >
        <ChevronLeft className={cn(
          "h-4 w-4 text-gray-500 transition-transform duration-300",
          collapsed && "rotate-180"
        )} />
      </button>
    </aside>
  );
};

export default Sidebar;
