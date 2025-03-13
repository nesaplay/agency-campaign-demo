
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ConversationInterface from '@/components/conversations/interface';

const Conversations: React.FC = () => {
  return (
    <MainLayout>
      <ConversationInterface />
    </MainLayout>
  );
};

export default Conversations;
