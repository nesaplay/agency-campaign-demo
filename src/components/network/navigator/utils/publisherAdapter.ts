
import { Publisher as NetworkPublisher } from '../../types';
import { Publisher as ConversationPublisher } from '@/components/conversations/types';

/**
 * Converts a publisher from the Conversation component format to the Network component format.
 */
export const adaptConversationPublisher = (publisher: ConversationPublisher): NetworkPublisher => {
  return {
    id: publisher.id,
    name: publisher.name,
    logo: publisher.image,
    location: publisher.location,
    coverage: publisher.location,
    subscribers: publisher.reach,
    engagement: "4.0%", // Default values for required fields
    cpm: "$15",
    categories: ["News"],
    performance: "Good",
    latitude: 0,
    longitude: 0,
    audienceSize: parseInt(publisher.reach.replace(/[^0-9]/g, '')) || 10000
  };
};
