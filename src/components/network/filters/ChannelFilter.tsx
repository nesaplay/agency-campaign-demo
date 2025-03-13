
import React from 'react';
import FilterSection from './FilterSection';

interface ChannelFilterProps {
  selectedChannels: string[];
  toggleChannel: (channel: string) => void;
  expandedSections: { [key: string]: boolean };
  toggleSection: (section: string) => void;
}

// Channel types
const CHANNEL_TYPES = [
  'Digital Display',
  'Email Newsletter',
  'Social Media',
  'Events',
  'Podcast',
  'Print',
  'Video'
];

const ChannelFilter: React.FC<ChannelFilterProps> = ({
  selectedChannels,
  toggleChannel,
  expandedSections,
  toggleSection
}) => {
  return (
    <FilterSection 
      title="Available Channels" 
      isExpanded={expandedSections.channels} 
      toggleSection={() => toggleSection('channels')}
    >
      <div className="grid grid-cols-2 gap-2">
        {CHANNEL_TYPES.map(channel => (
          <label key={channel} className="flex items-center gap-2 cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input 
              type="checkbox" 
              className="rounded text-empowerlocal-green focus:ring-empowerlocal-green" 
              checked={selectedChannels.includes(channel)} 
              onChange={() => toggleChannel(channel)} 
            />
            <span className="text-sm">{channel}</span>
          </label>
        ))}
      </div>
    </FilterSection>
  );
};

export default ChannelFilter;
