
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  HelpCircle, 
  BookOpen, 
  FileText, 
  Video, 
  TrendingUp, 
  Calendar, 
  Calculator, 
  Users, 
  DollarSign,
  ChevronUp,
  ChevronDown,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Footer: React.FC = () => {
  const [isSeasonalAlertVisible, setIsSeasonalAlertVisible] = useState(true);

  return (
    <>
      {/* Seasonal Alert Banner */}
      {isSeasonalAlertVisible && (
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-t border-amber-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-amber-200 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <h4 className="font-medium text-amber-900">Holiday Season Opportunity</h4>
              <p className="text-sm text-amber-700">Black Friday & Cyber Monday campaigns are trending in local markets</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/network-navigator" 
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Explore Publishers
            </Link>
            <button 
              onClick={() => setIsSeasonalAlertVisible(false)}
              className="text-amber-700 hover:text-amber-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Footer */}
      <footer className="bg-gradient-to-r from-empowerlocal-navy to-[#1a3a6c] text-white border-t border-gray-700/20">
        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Company Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded bg-white flex items-center justify-center">
                  <span className="text-empowerlocal-navy font-bold text-lg">EL</span>
                </div>
                <span className="font-semibold">EmpowerLocal</span>
              </div>
              <p className="text-sm text-gray-300">© {new Date().getFullYear()} EmpowerLocal, Inc. All rights reserved.</p>
              <div className="flex flex-col space-y-1 text-sm">
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link>
                <Link to="/contact" className="text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                  <Mail className="h-3.5 w-3.5" />
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Resources</h3>
              <div className="flex flex-col space-y-1 text-sm">
                <Link to="/help" className="text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Help Center</span>
                </Link>
                <Link to="/docs" className="text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Documentation</span>
                </Link>
                <Link to="/api" className="text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                  <FileText className="h-3.5 w-3.5" />
                  <span>API Information</span>
                </Link>
                <Link to="/tutorials" className="text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                  <Video className="h-3.5 w-3.5" />
                  <span>Video Tutorials</span>
                </Link>
                <Link to="/case-studies" className="text-gray-300 hover:text-white transition-colors">Case Studies</Link>
              </div>
            </div>

            {/* Network Status & Tools */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Network & Tools</h3>
              
              <div className="flex flex-col space-y-3">
                <div className="flex items-center text-sm gap-1.5">
                  <TrendingUp className="h-4 w-4 text-empowerlocal-green" />
                  <span className="text-white font-medium">1,243 publishers across 50 states</span>
                </div>
                
                <div className="flex items-center text-sm gap-1.5">
                  <Calendar className="h-4 w-4 text-empowerlocal-blue" />
                  <span className="text-gray-300">Data updated: 2 hours ago</span>
                </div>

                <div className="mt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-sm transition-colors">
                      <span>Quick Tools</span>
                      <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64">
                      <DropdownMenuItem className="cursor-pointer">
                        <Calculator className="mr-2 h-4 w-4" />
                        <span>CPM Calculator</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Users className="mr-2 h-4 w-4" />
                        <span>Audience Reach Estimator</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <DollarSign className="mr-2 h-4 w-4" />
                        <span>Campaign Budget Planner</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
