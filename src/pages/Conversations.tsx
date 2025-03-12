
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ConversationInterface from '@/components/conversations/ConversationInterface';

const Conversations: React.FC = () => {
  return (
    <MainLayout>
      <ConversationInterface />
    </MainLayout>
  );
};

export default Conversations;
