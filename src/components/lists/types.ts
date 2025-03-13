
import { Publisher } from '@/components/network/types';

export interface PublisherList {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  publisherCount: number;
  publishers: string[]; // Array of publisher IDs
  totalReach: string;
  lastUpdated: Date;
  category: string;
  createdBy: string;
  isShared: boolean;
  visibility: 'private' | 'team' | 'public';
}

export type ListCategory = 'all' | 'recent' | 'category' | 'shared';
