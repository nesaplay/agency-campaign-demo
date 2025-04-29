import { Publisher } from '@/components/network/types';

export interface Campaign {
  id: string;
  name: string;
  createdAt: string; // Store as ISO string for easier serialization
  budget?: string;
  geography?: string;
  timeline?: string;
  estimatedReach?: string;
  publishers: Publisher[];
} 