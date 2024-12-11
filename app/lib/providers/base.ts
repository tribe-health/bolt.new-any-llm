import type { Message } from '~/types/message';

export interface ProviderConfig {
  apiKey: string;
  apiVersion?: string;  // For Azure OpenAI
  endpoint?: string;    // For Azure OpenAI and other configurable endpoints
  organization?: string; // For OpenAI organization
}

export interface GenerateOptions {
  provider: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
}

export interface AIProvider {
  generate(messages: Message[], options: GenerateOptions): Promise<any>;
}

export class BaseProvider implements AIProvider {
  protected config: ProviderConfig;

  constructor(config: string | ProviderConfig) {
    this.config = typeof config === 'string' ? { apiKey: config } : config;
  }

  async generate(messages: Message[], options: GenerateOptions): Promise<any> {
    throw new Error('Method not implemented');
  }

  protected cleanMessages(messages: Message[]): AIMessage[] {
    return messages.map(msg => ({
      role: msg.role as 'system' | 'user' | 'assistant' | 'function',
      content: Array.isArray(msg.content)
        ? msg.content.map(c => c.type === 'text' ? c.text : '').join('\n')
        : msg.content
    }));
  }
}
