
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import NetworkNavigatorInterface from '@/components/network/NetworkNavigatorInterface';

const NetworkNavigator: React.FC = () => {
  return (
    <MainLayout>
      <NetworkNavigatorInterface />
    </MainLayout>
  );
};

export default NetworkNavigator;
