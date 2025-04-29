import { Publisher } from "../network/types";

export interface QuickReply {
  id: string;
  text: string;
  value: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  quickReplies?: QuickReply[];
  publishers?: Publisher[];
  showMap?: boolean;
  showAddPublisherButton?: boolean;
}
