
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, HelpCircle, BookOpen, FileText, Video, TrendingUp, Calendar, Calculator, Users, DollarSign, ChevronDown } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Footer: React.FC = () => {
  return (
    <footer className="bg-empowerlocal-gradient text-white border-t border-white/10">
      <div className="container mx-auto py-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Company Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-white flex items-center justify-center">
                <span className="text-empowerlocal-navy font-bold text-lg">EL</span>
              </div>
              <span className="font-semibold">EmpowerLocal</span>
            </div>
            <p className="text-sm text-gray-100 small-text">© {new Date().getFullYear()} EmpowerLocal, Inc. All rights reserved.</p>
            <div className="flex flex-col space-y-1 text-sm">
              <Link to="/about" className="text-gray-100 hover:text-white transition-colors small-text">About Us</Link>
              <Link to="/privacy" className="text-gray-100 hover:text-white transition-colors small-text">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-100 hover:text-white transition-colors small-text">Terms of Service</Link>
              <Link to="/contact" className="text-gray-100 hover:text-white flex items-center gap-1 transition-colors small-text">
                <Mail className="h-3.5 w-3.5" />
                <span>Contact Us</span>
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg heading-4">Resources</h3>
            <div className="flex flex-col space-y-1 text-sm">
              <Link to="/help" className="text-gray-100 hover:text-white flex items-center gap-1 transition-colors small-text">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Help Center</span>
              </Link>
              <Link to="/docs" className="text-gray-100 hover:text-white flex items-center gap-1 transition-colors small-text">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Documentation</span>
              </Link>
              <Link to="/api" className="text-gray-100 hover:text-white flex items-center gap-1 transition-colors small-text">
                <FileText className="h-3.5 w-3.5" />
                <span>API Information</span>
              </Link>
              <Link to="/tutorials" className="text-gray-100 hover:text-white flex items-center gap-1 transition-colors small-text">
                <Video className="h-3.5 w-3.5" />
                <span>Video Tutorials</span>
              </Link>
              <Link to="/case-studies" className="text-gray-100 hover:text-white transition-colors small-text">Case Studies</Link>
            </div>
          </div>

          {/* Network Status & Tools */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg heading-4">Network & Tools</h3>
            
            <div className="flex flex-col space-y-3">
              <div className="flex items-center text-sm gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-300" />
                <span className="text-white font-medium data-text">1,243 publishers across 50 states</span>
              </div>
              
              <div className="flex items-center text-sm gap-1.5 small-text">
                <Calendar className="h-4 w-4 text-blue-300" />
                <span className="text-gray-100">Data updated: 2 hours ago</span>
              </div>

              <div className="mt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-sm transition-colors small-text">
                    <span>Quick Tools</span>
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64">
                    <DropdownMenuItem className="cursor-pointer small-text">
                      <Calculator className="mr-2 h-4 w-4" />
                      <span>CPM Calculator</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer small-text">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Audience Reach Estimator</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer small-text">
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
  );
};

export default Footer;
