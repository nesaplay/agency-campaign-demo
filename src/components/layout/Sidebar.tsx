import React from "react";
import { Home, BarChart3, Settings, LineChart, ChevronLeft, MapPin, ListChecks, Bot, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useBrand } from "@/components/brands/BrandContext";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();
  const { activeBrand } = useBrand();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    {
      icon: Home,
      label: "Home",
      href: "/",
    },
    {
      icon: MapPin,
      label: "Explore",
      href: "/network-navigator",
    },
    {
      icon: Bot,
      label: "Ask Lassie",
      href: "/ask-lassie",
    },
    {
      icon: ListChecks,
      label: "Lists",
      href: "/lists",
    },
    {
      icon: LineChart,
      label: "Campaigns",
      href: "/campaigns",
    },
    {
      icon: Users,
      label: "Publishers",
      href: "/publishers",
    },
    {
      icon: BarChart3,
      label: "Data & Analytics",
      href: "/analytics",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
    },
  ];

  return (
    <aside
      className={cn(
        "h-full bg-gradient-to-r from-empowerlocal-blue to-empowerlocal-teal border-r border-white/10 shadow-lg transition-all duration-300 flex flex-col relative",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="p-4 border-b border-white/10">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <img
            src="/lovable-uploads/027d72d6-e0db-45e6-844e-6241241f5cfe.png"
            alt="EmpowerLocal Logo"
            className={cn("h-8", collapsed ? "w-8" : "w-auto")}
          />
        </div>
      </div>

      <nav className="flex-1 py-6">
        <ul className="space-y-1 px-2">
          {navItems.map((item, index) => {
            const isActive =
              location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
            return (
              <li key={index}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative",
                    isActive ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white",
                    collapsed ? "justify-center" : "",
                    isActive &&
                      "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-empowerlocal-gold before:rounded-l-lg",
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-white/80")} />
                  {!collapsed && <span className="small-text">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-md"
      >
        <ChevronLeft
          className={cn("h-4 w-4 text-empowerlocal-navy transition-transform duration-300", collapsed && "rotate-180")}
        />
      </button>
    </aside>
  );
};

export default Sidebar;
