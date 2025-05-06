import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Column */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Page Content Wrapper (Below Header, Above Footer) */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Page Content Area - Allow child to control scroll, or this 'main' to scroll its content */}
          <main className="flex-1 bg-background overflow-y-auto">
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
