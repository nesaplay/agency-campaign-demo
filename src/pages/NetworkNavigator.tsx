
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import NetworkNavigatorInterface from '@/components/network/navigator';

const NetworkNavigator: React.FC = () => {
  console.log("Rendering NetworkNavigator page");
  return (
    <MainLayout>
      <div className="h-full w-full">
        <NetworkNavigatorInterface />
      </div>
    </MainLayout>
  );
};

export default NetworkNavigator;
