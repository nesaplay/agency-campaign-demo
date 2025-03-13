
import React from 'react';
import { Lightbulb, Book, Star, Network, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DiscoveryCard from './DiscoveryCard';

// Example content types for discovery cards
const discoveryCards = [
  {
    id: 'disc-1',
    type: 'publisher-spotlight',
    icon: <Star className="h-5 w-5" />,
    title: 'Publisher Spotlight',
    subtitle: 'Local News Network',
    description: 'This Midwest publisher consistently achieves 35% higher CTR than average across retail campaigns.',
    image: '/placeholder.svg',
    cta: 'View Publisher',
    ctaLink: '/network-navigator',
    isNew: true,
    color: 'bg-blue-50 text-blue-600'
  },
  {
    id: 'disc-2',
    type: 'platform-tip',
    icon: <Lightbulb className="h-5 w-5" />,
    title: 'Platform Tip',
    subtitle: 'Campaign Targeting',
    description: 'Use our new audience segment builder to create custom targeting profiles based on historical performance.',
    image: '/placeholder.svg',
    cta: 'Try It Now',
    ctaLink: '/campaigns',
    isNew: true,
    color: 'bg-amber-50 text-amber-600'
  },
  {
    id: 'disc-3',
    type: 'success-story',
    icon: <Book className="h-5 w-5" />,
    title: 'Success Story',
    subtitle: 'Tourism Campaign',
    description: 'How a regional tourism board achieved 240% ROI by targeting seasonal travelers across 8 markets.',
    image: '/placeholder.svg',
    cta: 'Read Case Study',
    ctaLink: '/resources',
    isNew: false,
    color: 'bg-green-50 text-green-600'
  },
  {
    id: 'disc-4',
    type: 'network-update',
    icon: <Network className="h-5 w-5" />,
    title: 'Network Update',
    subtitle: '12 New Publishers',
    description: 'We\'ve added 12 new publishers across the Southwest region specializing in hispanic audiences.',
    image: '/placeholder.svg',
    cta: 'Explore New Publishers',
    ctaLink: '/network-navigator',
    isNew: true,
    color: 'bg-purple-50 text-purple-600'
  }
];

const PersonalizedDiscovery: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h2 id="personalized-discovery-heading" className="text-xl font-semibold text-empowerlocal-navy flex items-center">
              Discover & Learn
              <Badge className="ml-2 bg-empowerlocal-blue text-white">For You</Badge>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Resources and insights customized to your interests and activity
            </p>
          </div>
          <Button variant="outline" size="sm">
            Customize <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {discoveryCards.map(card => (
            <DiscoveryCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalizedDiscovery;
