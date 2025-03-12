
export interface QuickReply {
  id: string;
  text: string;
  value: string;
}

export interface Publisher {
  id: string;
  name: string;
  image: string;
  location: string;
  reach: string;
  rating: number;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  quickReplies?: QuickReply[];
  publishers?: Publisher[];
  showMap?: boolean;
}
