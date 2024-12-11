import { type AIConfig, type AIProvider, AIError } from '@/types/ai'
import { OpenAIProvider } from './providers/openai'

export class AIFactory {
  private static providers: Map<string, AIProvider> = new Map()

  static getProvider(config: AIConfig): AIProvider {
    const key = `${config.provider}-${config.apiKey}`

    if (this.providers.has(key)) {
      return this.providers.get(key)!
    }

    let provider: AIProvider

    switch (config.provider) {
      case 'openai':
        if (!config.apiKey) {
          throw new AIError(
            'OpenAI API key is required',
            'MISSING_API_KEY'
          )
        }
        provider = new OpenAIProvider(config.apiKey)
        break

      // Add other providers here
      default:
        throw new AIError(
          `Provider ${config.provider} is not supported`,
          'UNSUPPORTED_PROVIDER'
        )
    }

    this.providers.set(key, provider)
    return provider
  }

  static clearProviders(): void {
    this.providers.clear()
  }
}
