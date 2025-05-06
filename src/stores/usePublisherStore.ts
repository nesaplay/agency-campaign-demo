import { create } from "zustand";
import { Publisher } from "@/components/network/types"; // Base type now includes colors
import { mockPublishers } from "@/components/network/mockData";

// Define the state structure and actions using the updated base Publisher type
interface PublisherState {
  publishers: Publisher[]; // Use base type
  getPublisherById: (id: string) => Publisher | undefined;
  updatePublisher: (id: string, updatedData: Partial<Publisher>) => void;
  addPublisher: (newPublisherData: Omit<Publisher, "id">) => Publisher;
}

// Add default colors during initialization
const initialPublishersWithColors: Publisher[] = mockPublishers.map(pub => ({
  ...pub,
  primaryColor: pub.primaryColor || '#442d9a', // Use existing color if mock data has it, else default
  secondaryColor: pub.secondaryColor || '#753363',
  accentColor: pub.accentColor || '#a29090',
  // headerImage: pub.headerImage || undefined, // Add if headerImage should have a default
}));

const usePublisherStore = create<PublisherState>((set, get) => ({
  // Use the processed initial state
  publishers: initialPublishersWithColors,

  // Actions now operate on the base Publisher type
  getPublisherById: (id) => {
    return get().publishers.find((p) => p.id === id);
  },

  updatePublisher: (id, updatedData) => {
    set((state) => ({
      publishers: state.publishers.map((publisher) => {
        if (publisher.id === id) {
          return { ...publisher, ...updatedData }; 
        }
        return publisher;
      }),
    }));
  },

  addPublisher: (newPublisherData) => {
    const newPublisher: Publisher = {
      id: `pub_${Date.now()}`,
      // Ensure new publishers also get default colors if not provided
      primaryColor: newPublisherData.primaryColor || '#442d9a',
      secondaryColor: newPublisherData.secondaryColor || '#753363',
      accentColor: newPublisherData.accentColor || '#a29090',
      ...newPublisherData, 
    };
    set((state) => ({ publishers: [newPublisher, ...state.publishers] }));
    return newPublisher;
  },
}));

export default usePublisherStore;
