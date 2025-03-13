
import { PublisherList } from './types';

export const mockLists: PublisherList[] = [
  {
    id: '1',
    name: 'Summer Campaign Publishers',
    description: 'Curated list of publishers for our summer promotions targeting families.',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    publisherCount: 12,
    publishers: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23'],
    totalReach: '2.4M',
    lastUpdated: new Date('2023-06-15'),
    category: 'Seasonal',
    createdBy: 'John Doe',
    isShared: false,
    visibility: 'team'
  },
  {
    id: '2',
    name: 'Local News Network',
    description: 'Top-performing local news publishers with high engagement rates.',
    coverImage: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    publisherCount: 8,
    publishers: ['2', '4', '6', '8', '10', '12', '14', '16'],
    totalReach: '1.8M',
    lastUpdated: new Date('2023-07-02'),
    category: 'News',
    createdBy: 'Jane Smith',
    isShared: true,
    visibility: 'team'
  },
  {
    id: '3',
    name: 'Southwest Region',
    description: 'Publishers covering Arizona, New Mexico, and Nevada markets.',
    coverImage: 'https://images.unsplash.com/photo-1544979590-37e9b47eb705?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    publisherCount: 15,
    publishers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
    totalReach: '3.2M',
    lastUpdated: new Date('2023-06-28'),
    category: 'Regional',
    createdBy: 'John Doe',
    isShared: false,
    visibility: 'private'
  },
  {
    id: '4',
    name: 'Family-Friendly Publishers',
    description: 'Publishers with content appropriate for all ages and family-oriented audiences.',
    coverImage: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    publisherCount: 10,
    publishers: ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50'],
    totalReach: '2.1M',
    lastUpdated: new Date('2023-07-10'),
    category: 'Demographic',
    createdBy: 'Jane Smith',
    isShared: true,
    visibility: 'public'
  },
  {
    id: '5',
    name: 'High Engagement Publishers',
    description: 'Top performing publishers with the highest engagement rates.',
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    publisherCount: 7,
    publishers: ['12', '24', '36', '48', '60', '72', '84'],
    totalReach: '1.5M',
    lastUpdated: new Date('2023-07-05'),
    category: 'Performance',
    createdBy: 'John Doe',
    isShared: false,
    visibility: 'team'
  },
  {
    id: '6',
    name: 'Sports Coverage',
    description: 'Publishers focusing on sports news and content.',
    coverImage: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    publisherCount: 9,
    publishers: ['7', '14', '21', '28', '35', '42', '49', '56', '63'],
    totalReach: '1.9M',
    lastUpdated: new Date('2023-06-22'),
    category: 'Niche',
    createdBy: 'Jane Smith',
    isShared: true,
    visibility: 'private'
  }
];
