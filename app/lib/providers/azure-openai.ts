import { BaseProvider, type ProviderConfig, type GenerateOptions } from './base';
import type { Message } from '~/types/message';

export class AzureOpenAIProvider extends BaseProvider {
  async generate(messages: Message[], options: GenerateOptions): Promise<any> {
    if (!this.config.endpoint || !this.config.apiVersion) {
      throw new Error('Azure OpenAI requires endpoint and apiVersion configuration');
    }

    const endpoint = this.config.endpoint.replace(/\/$/, '');
    const deploymentId = options.model;

    const response = await fetch(
      `${endpoint}/openai/deployments/${deploymentId}/chat/completions?api-version=${this.config.apiVersion}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.config.apiKey
        },
        body: JSON.stringify({
          messages: this.cleanMessages(messages),
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens,
          stream: true
        })
      }
    );

    return response.body;
  }
}
