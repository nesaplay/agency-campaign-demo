
import { PublisherCollection, SeasonalEvent } from './types';

// Mock publisher collections
export const mockCollections: PublisherCollection[] = [
  {
    id: '1',
    name: 'Family Friendly / Female Leaning',
    description: 'A collection of parenting blogs and lifestyle sites focused on family content.',
    publisherCount: 32,
    thumbnail: '/placeholder.svg',
    coverageMapThumbnail: 'https://placehold.co/600x400/f0f7ff/2868C3?text=Family+Coverage',
    publishers: ['pub1', 'pub2', 'pub3']
  },
  {
    id: '2',
    name: 'SEC Country',
    description: 'Publishers covering SEC college sports with passionate fan followings.',
    publisherCount: 24,
    thumbnail: '/placeholder.svg',
    coverageMapThumbnail: 'https://placehold.co/600x400/fff7e0/FFA500?text=SEC+Coverage',
    publishers: ['pub4', 'pub5', 'pub6']
  },
  {
    id: '3',
    name: 'Foodie Destinations',
    description: 'Local food & dining publications with engaged audiences of food enthusiasts.',
    publisherCount: 18,
    thumbnail: '/placeholder.svg',
    coverageMapThumbnail: 'https://placehold.co/600x400/fffbf0/FFD700?text=Foodie+Coverage',
    publishers: ['pub7', 'pub8', 'pub9']
  },
  {
    id: '4',
    name: 'Outdoor Enthusiasts',
    description: 'Publications covering hiking, camping, and outdoor recreational activities.',
    publisherCount: 27,
    thumbnail: '/placeholder.svg',
    coverageMapThumbnail: 'https://placehold.co/600x400/f0fff7/25A87E?text=Outdoor+Coverage',
    publishers: ['pub10', 'pub11', 'pub12']
  },
  {
    id: '5',
    name: 'Tech Hubs',
    description: 'Publishers focused on technology news and innovation in major tech regions.',
    publisherCount: 15,
    thumbnail: '/placeholder.svg',
    coverageMapThumbnail: 'https://placehold.co/600x400/f7f0ff/6A26CD?text=Tech+Coverage',
    publishers: ['pub13', 'pub14', 'pub15']
  }
];

// Mock seasonal events
export const mockSeasonalEvents: SeasonalEvent[] = [
  {
    id: 'event1',
    title: 'Summer Heatwave',
    description: 'Perfect timing for cold treats, beverages, and cooling products.',
    startDate: '2023-07-15',
    endDate: '2023-08-15',
    regions: ['Southwest', 'West Coast'],
    categories: ['Weather', 'Seasonal'],
    relevanceScore: 9,
    color: 'bg-red-100 text-red-600',
    icon: 'thermometer'
  },
  {
    id: 'event2',
    title: 'College Football Kickoff',
    description: 'Major engagement opportunity for sports-focused brands.',
    startDate: '2023-08-25',
    endDate: '2023-09-05',
    regions: ['Southeast', 'Midwest'],
    categories: ['Sports', 'Events'],
    relevanceScore: 8,
    color: 'bg-orange-100 text-orange-600'
  },
  {
    id: 'event3',
    title: 'Summer Festival Season',
    description: 'Local events and festivals drive community engagement.',
    startDate: '2023-06-01',
    endDate: '2023-08-31',
    regions: ['West Coast', 'Northeast'],
    categories: ['Events', 'Entertainment'],
    relevanceScore: 7,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'event4',
    title: 'Beach Season',
    description: 'Peak time for beach-related content and promotions.',
    startDate: '2023-06-15',
    endDate: '2023-09-15',
    regions: ['West Coast', 'Southeast', 'Northeast'],
    categories: ['Lifestyle', 'Seasonal'],
    relevanceScore: 8,
    color: 'bg-blue-100 text-blue-600',
    icon: 'sun'
  },
  {
    id: 'event5',
    title: 'Back to School',
    description: 'Major retail opportunity for school supplies and apparel.',
    startDate: '2023-08-01',
    endDate: '2023-09-15',
    regions: ['All'],
    categories: ['Retail', 'Family'],
    relevanceScore: 9,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 'event6',
    title: 'Fall Harvest Season',
    description: 'Food and agriculture content peaks during harvest.',
    startDate: '2023-09-15',
    endDate: '2023-10-31',
    regions: ['Midwest', 'Northwest'],
    categories: ['Food', 'Seasonal'],
    relevanceScore: 7,
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    id: 'event7',
    title: 'Hurricane Season',
    description: 'Weather awareness and preparation content.',
    startDate: '2023-06-01',
    endDate: '2023-11-30',
    regions: ['Southeast', 'Gulf Coast'],
    categories: ['Weather', 'Safety'],
    relevanceScore: 6,
    color: 'bg-cyan-100 text-cyan-600',
    icon: 'cloud'
  }
];

// Filter categories for seasonal events
export const eventCategories = [
  'Weather', 
  'Seasonal', 
  'Sports', 
  'Events', 
  'Entertainment', 
  'Lifestyle', 
  'Retail', 
  'Family', 
  'Food', 
  'Safety'
];

// Regions for filtering
export const eventRegions = [
  'West Coast', 
  'Southwest', 
  'Midwest', 
  'Southeast', 
  'Northeast', 
  'Gulf Coast', 
  'Northwest', 
  'All'
];
