import type { Message as AIMessage } from 'ai';

export type MessageContent = {
  type: 'text' | 'image';
  text?: string;
  image?: string;
};

// Our custom message type for display purposes
export interface CustomMessage {
  role: AIMessage['role'];
  content: string | MessageContent[];
  id: string;
}

// Type for messages used with the AI SDK
export type Message = AIMessage & {
  id: string;
};

// Type for messages in chat history
export interface ChatMessage extends Message {
  createdAt?: Date;
  updatedAt?: Date;
}

// Helper function to convert between message types
export function convertToCustomMessage(message: Message): CustomMessage {
  return {
    role: message.role,
    content: message.content,
    id: message.id,
  };
}

// Helper function to check if content is MessageContent array
export function isMessageContentArray(content: string | MessageContent[]): content is MessageContent[] {
  return Array.isArray(content);
}
