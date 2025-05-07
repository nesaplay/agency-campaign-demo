import { Publisher } from "../network/types";

export interface QuickReply {
  id: string;
  text: string;
  value: string;
}

export interface Message {
  id: string;
  content: string | React.ReactNode;
  sender: 'user' | 'assistant';
  timestamp: Date;
  quickReplies?: QuickReply[];
  publishers?: Publisher[];
  showMap?: boolean;
  state?: string;
  showAddPublisherButton?: boolean;
  feedback?: 'positive' | 'negative';
  selectGeography?: { onSelect: (states: string[]) => void };
  attachments?: {
    id: string;
    name: string;
    type: string;
    size: number;
  }[];
}
