
import { ReactNode } from 'react';

export interface MetricProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color?: string;
}

export interface PerformanceMetricProps {
  label: string;
  value: number;
  color: string;
}
