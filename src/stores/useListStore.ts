import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PublisherList } from '@/components/lists/types';
import { Publisher } from '@/components/network/types'; // Assuming network Publisher type is used
import { mockLists } from '@/components/lists/mockListsData';

interface ListState {
  lists: PublisherList[];
  addList: (listData: {
    name: string;
    description?: string;
    publishers: Publisher[];
    visibility?: 'private' | 'team' | 'public';
  }) => PublisherList;
  updateList: (updatedList: PublisherList) => void;
  removePublisherFromList: (listId: string, publisherId: string) => void;
  addPublisherToList: (listId: string, publisherId: string) => void;
}

const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      lists: mockLists,
      addList: (listData) => {
        const newList: PublisherList = {
          id: `list_${Date.now()}`,
          name: listData.name,
          description: listData.description || 'Generated from campaign summary',
          publishers: listData.publishers.map(p => p.id),
          publisherCount: listData.publishers.length,
          coverImage: listData.publishers[0]?.logo || 'https://placehold.co/600x400/e2e8f0/cbd5e0?text=List', // Use first pub logo or fallback
          lastUpdated: new Date(),
          visibility: listData.visibility || 'private',
          isShared: listData.visibility === 'team' || listData.visibility === 'public',
          createdBy: 'You',
          category: 'uncategorized',
          totalReach: listData.publishers.reduce((sum, p) => sum + (p.audienceSize || 0), 0).toLocaleString(),
        };
        set({ lists: [newList, ...get().lists] });
        return newList;
      },
      updateList: (updatedList) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === updatedList.id ? { ...updatedList, lastUpdated: new Date() } : list 
          ),
        }));
      },
      removePublisherFromList: (listId, publisherId) => {
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id === listId) {
              const updatedPublisherIds = list.publishers.filter(id => id !== publisherId);
              return {
                ...list,
                publishers: updatedPublisherIds,
                publisherCount: updatedPublisherIds.length,
                lastUpdated: new Date(),
                // Note: coverImage and totalReach might need recalculation here 
                // depending on requirements, but keeping simple for now.
              };
            }
            return list;
          }),
        }));
      },
      addPublisherToList: (listId, publisherId) => {
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id === listId) {
              if (list.publishers.includes(publisherId)) {
                return list;
              }
              const updatedPublisherIds = [...list.publishers, publisherId];
              return {
                ...list,
                publishers: updatedPublisherIds,
                publisherCount: updatedPublisherIds.length,
                lastUpdated: new Date(),
              };
            }
            return list;
          }),
        }));
      },
    }),
    {
      name: 'publisher-list-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useListStore; 