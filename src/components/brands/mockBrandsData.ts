import { Brand } from './types';

export const mockBrands: Brand[] = [
  {
    id: '1',
    name: 'Riverside Retail',
    description: 'Multi-location retail chain specializing in outdoor equipment',
    logoUrl: '/placeholder.svg',
    campaignCount: 5,
    color: '#4CAF50',
    isActive: true,
    attachments: [],
    metrics: {
      targetAudience: {
        primary: 'Adults 25-55',
        interests: ['Hiking', 'Camping', 'Local Events'],
        locations: ['Urban', 'Suburban']
      },
      objectives: [
        'Increase foot traffic by 15%',
        'Boost online sales for new gear',
        'Improve brand visibility in local parks'
      ],
      performance: [
        { label: 'Awareness', value: 78, color: 'bg-blue-500' },
        { label: 'Engagement', value: 62, color: 'bg-green-500' },
        { label: 'Conversion', value: 45, color: 'bg-amber-500' }
      ]
    }
  },
  {
    id: '2',
    name: 'Summit Health',
    description: 'Healthcare provider network with 12 locations across the region',
    logoUrl: '/placeholder.svg',
    campaignCount: 3,
    color: '#2196F3',
    isActive: false,
    attachments: [
        {
          id: '1',
          name: 'Brand Guidelines.pdf',
          url: '/placeholder.pdf',
          type: 'application/pdf',
          size: 1024
        },
        {
          id: '2',
          name: 'Logo Pack.zip',
          url: '/placeholder.zip',
          type: 'application/zip',
          size: 2048
        },
        {
          id: '3',
          name: 'Onboarding Doc.docx',
          url: '/placeholder.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: 1536
        }
    ],
    metrics: {
      targetAudience: {
        primary: 'Seniors 65+, Families',
        interests: ['Health & Wellness', 'Community Programs'],
        locations: ['Regional']
      },
      objectives: [
        'Promote new telehealth services',
        'Increase patient portal sign-ups',
        'Run community health workshops'
      ],
      performance: [
        { label: 'Awareness', value: 60, color: 'bg-blue-500' },
        { label: 'Engagement', value: 55, color: 'bg-green-500' },
        { label: 'Conversion', value: 30, color: 'bg-amber-500' }
      ]
    }
  },
  {
    id: '3',
    name: 'Metro Dining Group',
    description: 'Restaurant group managing 8 different dining concepts',
    logoUrl: '/placeholder.svg',
    campaignCount: 7,
    color: '#FF9800',
    isActive: false,
    attachments: [],
    metrics: {
      targetAudience: {
        primary: 'Young Professionals 21-35',
        interests: ['Dining Out', 'Nightlife', 'Food Trends'],
        locations: ['Downtown', 'Entertainment Districts']
      },
      objectives: [
        'Launch new seasonal menu',
        'Increase weekend reservations',
        'Partner with local delivery apps'
      ],
      performance: [
        { label: 'Awareness', value: 85, color: 'bg-blue-500' },
        { label: 'Engagement', value: 70, color: 'bg-green-500' },
        { label: 'Conversion', value: 50, color: 'bg-amber-500' }
      ]
    }
  },
  {
    id: '4',
    name: 'Oakwood Properties',
    description: 'Real estate development firm focusing on commercial properties',
    logoUrl: '/placeholder.svg',
    campaignCount: 2,
    color: '#9C27B0',
    isActive: false,
    attachments: [{
      id: '4',
      name: 'Property Map.png',
      url: '/placeholder.png',
      type: 'image/png',
      size: 512
    }],
    metrics: {
      targetAudience: {
        primary: 'Businesses, Investors',
        interests: ['Commercial Real Estate', 'Development'],
        locations: ['Growth Corridors']
      },
      objectives: [
        'Lease new office spaces',
        'Attract anchor tenants for retail center',
        'Showcase sustainability features'
      ],
      performance: [
        { label: 'Awareness', value: 50, color: 'bg-blue-500' },
        { label: 'Engagement', value: 40, color: 'bg-green-500' },
        { label: 'Conversion', value: 25, color: 'bg-amber-500' }
      ]
    }
  },
  {
    id: '5',
    name: 'Velocity Auto',
    description: 'Automobile dealership with service centers',
    logoUrl: '/placeholder.svg',
    campaignCount: 4,
    color: '#E91E63',
    isActive: false,
    attachments: [],
    metrics: {
      targetAudience: {
        primary: 'Adults 30-60',
        interests: ['Cars', 'Local Sports', 'Family Activities'],
        locations: ['Citywide']
      },
      objectives: [
        'Promote end-of-year sales event',
        'Increase service department bookings',
        'Highlight new electric vehicle models'
      ],
      performance: [
        { label: 'Awareness', value: 70, color: 'bg-blue-500' },
        { label: 'Engagement', value: 65, color: 'bg-green-500' },
        { label: 'Conversion', value: 48, color: 'bg-amber-500' }
      ]
    }
  },
  {
    id: '6',
    name: 'NorthStar Education',
    description: 'Private education institution with multiple campuses',
    logoUrl: '/placeholder.svg',
    campaignCount: 1,
    color: '#673AB7',
    isActive: false,
    attachments: [],
    metrics: {
      targetAudience: {
        primary: 'Parents, High School Students',
        interests: ['Education', 'College Prep', 'STEM'],
        locations: ['Tri-county Area']
      },
      objectives: [
        'Increase applications for next school year',
        'Host successful open house events',
        'Promote scholarship opportunities'
      ],
      performance: [
        { label: 'Awareness', value: 68, color: 'bg-blue-500' },
        { label: 'Engagement', value: 75, color: 'bg-green-500' },
        { label: 'Conversion', value: 35, color: 'bg-amber-500' }
      ]
    }
  }
];
