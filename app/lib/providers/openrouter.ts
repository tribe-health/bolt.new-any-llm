import { BaseProvider, type GenerateOptions } from './base';
import type { Message } from '~/types/message';

export class OpenRouterProvider extends BaseProvider {
  async generate(messages: Message[], options: GenerateOptions): Promise<any> {
    try {
      const cleanedMessages = this.cleanMessages(messages);
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'HTTP-Referer': window.location.origin,
        },
        body: JSON.stringify({
          model: options.model,
          messages: cleanedMessages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens,
          stream: true
        }),
      });

      return response.body;
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      throw error;
    }
  }
}
