
import { Publisher, RetailLocation } from './types';

// Mock publisher data
export const mockPublishers: Publisher[] = [
  {
    id: '1',
    name: 'Phoenix Sun',
    logo: 'https://placehold.co/200x100/f4f4f4/999999?text=Phoenix+Sun',
    location: 'Phoenix, AZ',
    coverage: 'Greater Phoenix Area',
    subscribers: '85,000',
    engagement: '4.2%',
    cpm: '$15',
    categories: ['News', 'Politics', 'Local Events'],
    performance: 'Excellent',
    latitude: 55,
    longitude: 38,
    audienceSize: 85000
  },
  {
    id: '2',
    name: 'LA Weekly',
    logo: 'https://placehold.co/200x100/f4f4f4/999999?text=LA+Weekly',
    location: 'Los Angeles, CA',
    coverage: 'Los Angeles County',
    subscribers: '120,000',
    engagement: '3.8%',
    cpm: '$18',
    categories: ['Entertainment', 'Lifestyle', 'Food', 'Events'],
    performance: 'Excellent',
    latitude: 45,
    longitude: 20,
    audienceSize: 120000
  },
  {
    id: '3',
    name: 'West Coast Lifestyle',
    logo: 'https://placehold.co/200x100/f4f4f4/999999?text=West+Coast+Lifestyle',
    location: 'San Diego, CA',
    coverage: 'San Diego Metro',
    subscribers: '65,000',
    engagement: '5.1%',
    cpm: '$14',
    categories: ['Lifestyle', 'Travel', 'Food', 'Health'],
    performance: 'Good',
    latitude: 58,
    longitude: 22,
    audienceSize: 65000
  },
  {
    id: '4',
    name: 'Pacific Northwest Times',
    logo: 'https://placehold.co/200x100/f4f4f4/999999?text=PNW+Times',
    location: 'Seattle, WA',
    coverage: 'Seattle Metro Area',
    subscribers: '95,000',
    engagement: '4.0%',
    cpm: '$16',
    categories: ['News', 'Tech', 'Environment', 'Events'],
    performance: 'Good',
    latitude: 30,
    longitude: 28,
    audienceSize: 95000
  },
  {
    id: '5',
    name: 'Bay Area Gazette',
    logo: 'https://placehold.co/200x100/f4f4f4/999999?text=Bay+Area+Gazette',
    location: 'San Francisco, CA',
    coverage: 'San Francisco Bay Area',
    subscribers: '110,000',
    engagement: '3.5%',
    cpm: '$22',
    categories: ['News', 'Tech', 'Business', 'Culture'],
    performance: 'Good',
    latitude: 35,
    longitude: 16,
    audienceSize: 110000
  },
  {
    id: '6',
    name: 'Portland Perspective',
    logo: 'https://placehold.co/200x100/f4f4f4/999999?text=Portland+Perspective',
    location: 'Portland, OR',
    coverage: 'Portland Metro',
    subscribers: '72,000',
    engagement: '4.7%',
    cpm: '$13',
    categories: ['News', 'Culture', 'Food', 'Outdoors'],
    performance: 'Excellent',
    latitude: 28,
    longitude: 24,
    audienceSize: 72000
  },
  {
    id: '7',
    name: 'Vegas Insider',
    logo: 'https://placehold.co/200x100/f4f4f4/999999?text=Vegas+Insider',
    location: 'Las Vegas, NV',
    coverage: 'Las Vegas Valley',
    subscribers: '68,000',
    engagement: '4.0%',
    cpm: '$17',
    categories: ['Entertainment', 'Casinos', 'Events', 'Food'],
    performance: 'Average',
    latitude: 46,
    longitude: 32,
    audienceSize: 68000
  },
  {
    id: '8',
    name: 'Desert Chronicle',
    logo: 'https://placehold.co/200x100/f4f4f4/999999?text=Desert+Chronicle',
    location: 'Tucson, AZ',
    coverage: 'Southern Arizona',
    subscribers: '45,000',
    engagement: '3.2%',
    cpm: '$11',
    categories: ['News', 'Local Events', 'Community'],
    performance: 'Average',
    latitude: 62,
    longitude: 42,
    audienceSize: 45000
  },
  {
    id: '9',
    name: 'SoCal Sports',
    logo: 'https://placehold.co/200x100/f4f4f4/999999?text=SoCal+Sports',
    location: 'Anaheim, CA',
    coverage: 'Orange County, CA',
    subscribers: '55,000',
    engagement: '6.4%',
    cpm: '$15',
    categories: ['Sports', 'Local Teams', 'Fitness'],
    performance: 'Excellent',
    latitude: 48,
    longitude: 22,
    audienceSize: 55000
  },
  {
    id: '10',
    name: 'Mountain View Observer',
    logo: 'https://placehold.co/200x100/f4f4f4/999999?text=Mountain+Observer',
    location: 'Denver, CO',
    coverage: 'Denver Metro Area',
    subscribers: '79,000',
    engagement: '3.9%',
    cpm: '$14',
    categories: ['News', 'Outdoors', 'Sports', 'Environment'],
    performance: 'Good',
    latitude: 38,
    longitude: 50,
    audienceSize: 79000
  }
];

// Mock retail locations for Dr. Bombay
export const retailLocations: RetailLocation[] = [
  {
    id: '1',
    name: "Dr. Bombay's - Downtown Phoenix",
    address: '123 Main St, Phoenix, AZ',
    latitude: 55,
    longitude: 42
  },
  {
    id: '2',
    name: "Dr. Bombay's - Santa Monica",
    address: '456 Ocean Ave, Santa Monica, CA',
    latitude: 45,
    longitude: 16
  },
  {
    id: '3',
    name: "Dr. Bombay's - La Jolla",
    address: '789 Coast Blvd, La Jolla, CA',
    latitude: 58,
    longitude: 18
  },
  {
    id: '4',
    name: "Dr. Bombay's - Las Vegas Strip",
    address: '1111 Las Vegas Blvd, Las Vegas, NV',
    latitude: 46,
    longitude: 36
  }
];
