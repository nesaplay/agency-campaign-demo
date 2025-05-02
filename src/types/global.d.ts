// Define the shape of a message object (might need adjustment based on MessageType)
interface ChatMessage {
  id: string;
  content: string | React.ReactNode; // Allow string or React nodes if widget handles them
  sender: 'user' | 'assistant';
  timestamp: Date;
  quickReplies?: { id: string; text: string; value: string }[];
  // Add other properties your widget might need (e.g., showMap, publishers)
}

// Define the expected shape of the response from the widget
interface WidgetResponse {
  type: 'message' | 'quickReply';
  payload: string | { text: string; value: string };
}

// Define the structure of the serializable step data sent to the widget
interface SerializableStep {
    id: string;
    triggers: string[];
    quickReplies?: { id: string; text: string; value: string }[];
}

// Define the interface for the ChatWidget API
interface ChatWidgetApi {
  init?: (selector: string) => void; 
  // Add sendData back - assuming it takes different payloads
  sendData?: (data: { type: 'config', payload: { steps: SerializableStep[] } } | { type: 'messages', payload: { messages: ChatMessage[] } }) => void; 
  destroy?: () => void; 
}

declare global {
  interface Window {
    ChatWidget?: ChatWidgetApi; 
    handleChatWidgetResponse?: (response: WidgetResponse) => void;
  }
}

// Export {} is needed to treat this file as a module and allow global augmentation
export {}; 