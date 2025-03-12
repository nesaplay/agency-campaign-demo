
export interface Publisher {
  id: string;
  name: string;
  logo: string;
  location: string;
  coverage: string;
  subscribers: string;
  engagement: string;
  cpm: string;
  categories: string[];
  performance: 'Good' | 'Average' | 'Excellent';
  latitude: number;
  longitude: number;
  audienceSize: number;
}

export interface RetailLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface FilterOptions {
  states: string[];
  cities: string[];
  radius: number;
  audience: {
    demographics: string[];
    minSize: number;
    maxSize: number;
  };
  categories: string[];
  performance: {
    minEngagement: number;
    maxCpm: number;
  };
}
