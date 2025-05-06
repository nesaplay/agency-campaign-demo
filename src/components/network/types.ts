import React from 'react';

export interface Publisher {
  id: string;
  name: string;
  logo: string;
  headerImage?: string;
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
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
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

export interface PublisherCollection {
  id: string;
  name: string;
  description: string;
  publisherCount: number;
  thumbnail: string;
  coverageMapThumbnail: string;
  publishers: string[]; // Array of publisher IDs
}

export interface SeasonalEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  regions: string[];
  categories: string[];
  relevanceScore: number;
  color: string;
  icon?: string;
}

export type ViewMode = 'map' | 'calendar';
