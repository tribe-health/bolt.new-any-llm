import OpenAI from 'openai';
import { BaseProvider, type GenerateOptions, type AIMessage } from './base';
import type { Message } from '~/types/message';

export class OpenAIProvider extends BaseProvider {
  private client: OpenAI;

  constructor(config: string | { apiKey: string; organization?: string }) {
    super(config);
    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      organization: this.config.organization,
      dangerouslyAllowBrowser: true
    });
  }

  async generate(messages: Message[], options: GenerateOptions) {
    try {
      const cleanedMessages = this.cleanMessages(messages);
      const completion = await this.client.chat.completions.create({
        model: options.model,
        messages: cleanedMessages.map(msg => ({
          role: msg.role,
          content: msg.content,
          ...(msg.name && { name: msg.name })
        })) as OpenAI.Chat.ChatCompletionMessageParam[],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens,
        stream: true
      });

      return completion;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }
}
