
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import NetworkNavigatorInterface from '@/components/network/navigator';

const NetworkNavigator: React.FC = () => {
  return (
    <MainLayout>
      <div className="h-full">
        <NetworkNavigatorInterface />
      </div>
    </MainLayout>
  );
};

export default NetworkNavigator;
