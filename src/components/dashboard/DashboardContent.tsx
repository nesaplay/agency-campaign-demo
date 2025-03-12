
import React from 'react';
import { Bot, MapPin, Activity, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const DashboardContent: React.FC = () => {
  // Placeholder data
  const stats = [
    { 
      title: 'Total Publishers', 
      value: '1,245', 
      change: '+12%',
      icon: Users,
      color: 'bg-blue-50 text-empowerlocal-blue'
    },
    { 
      title: 'Active Campaigns', 
      value: '36', 
      change: '+5%',
      icon: Activity,
      color: 'bg-green-50 text-empowerlocal-green'
    },
    { 
      title: 'Markets', 
      value: '178', 
      change: '+8%',
      icon: MapPin,
      color: 'bg-purple-50 text-purple-600'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-empowerlocal-navy">Welcome, Jane</h1>
            <p className="mt-1 text-gray-500">Discover and plan your next multi-local campaign</p>
          </div>
          <Link to="/conversations" className="px-4 py-2 bg-gradient-to-r from-empowerlocal-green to-empowerlocal-blue text-white rounded-lg flex items-center gap-2 font-medium">
            <Bot className="h-4 w-4" />
            <span>Ask Lassie AI</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <div className="mt-1 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <span className="ml-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={cn("p-3 rounded-lg", stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-80 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="empowerlocal-gradient inline-flex h-12 w-12 rounded-lg items-center justify-center text-white mb-4">
            <MapPin className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold text-empowerlocal-navy">Network Navigator</h2>
          <p className="mt-2 text-gray-500">
            Explore our network of 1000+ trusted local publishers across the United States
          </p>
          <button className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors">
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
