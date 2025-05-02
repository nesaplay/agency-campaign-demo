import { PerformanceMetricProps } from './context-module/types';

// Define structure for metrics within the Brand type
interface BrandMetrics {
  targetAudience: {
    primary: string;
    interests: string[];
    locations: string[];
  };
  objectives: string[];
  performance: PerformanceMetricProps[];
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  campaignCount: number;
  color: string;
  isActive: boolean;
  attachments?: { name: string; url: string }[];
  metrics?: BrandMetrics;
}
