import { type AIProvider, type ProviderConfig } from './base';
import { OpenAIProvider } from './openai';
import { OpenRouterProvider } from './openrouter';
import { AzureOpenAIProvider } from './azure-openai';

export function createProvider(providerName: string, config: string | ProviderConfig): AIProvider {
  switch (providerName.toLowerCase()) {
    case 'openai':
      return new OpenAIProvider(config);
    case 'azure-openai':
      if (typeof config === 'string') {
        throw new Error('Azure OpenAI requires endpoint and apiVersion configuration');
      }
      return new AzureOpenAIProvider(config);
    case 'openrouter':
      return new OpenRouterProvider(config);
    // TODO: Implement other providers
    // case 'anthropic':
    // case 'groq':
    // case 'mistral':
    // case 'together':
    // case 'google':
    // case 'huggingface':
    // case 'cohere':
    // case 'deepseek':
    // case 'lmstudio':
    // case 'ollama':
    default:
      throw new Error(`Unsupported provider: ${providerName}`);
  }
}
