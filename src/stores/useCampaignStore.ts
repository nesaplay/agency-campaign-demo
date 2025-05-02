import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Campaign } from '@/types/campaign';

interface CampaignState {
  campaigns: Campaign[];
  addCampaign: (campaignData: Omit<Campaign, 'id' | 'name' | 'createdAt'>) => void;
}

const useCampaignStore = create<CampaignState>()(
  persist(
    (set, get) => ({
      campaigns: [],
      addCampaign: (campaignData) => {
        const newCampaign: Campaign = {
          ...campaignData,
          id: `campaign_${Date.now()}`,
          name: `Campaign - ${new Date().toLocaleDateString()}`,
          createdAt: new Date().toISOString(),
        };
        set({ campaigns: [...get().campaigns, newCampaign] });
      },
    }),
    {
      name: 'campaign-storage', // Name of the item in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    }
  )
);

export default useCampaignStore; 