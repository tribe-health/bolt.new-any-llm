import { useState, useCallback } from 'react'
import { type Message, type AIConfig, type AIProvider } from '@/types/ai'
import { OpenAIProvider } from '@/lib/providers/openai'
import { useAIStore } from '@/store/ai'

interface UseAIChatOptions {
  onResponse?: (message: Message) => void
  onError?: (error: Error) => void
}

export function useAIChat(options: UseAIChatOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const config = useAIStore((state) => state.config)
  const provider = useProvider(config)

  const sendMessage = useCallback(
    async (message: Message) => {
      if (!provider) {
        throw new Error('No AI provider configured')
      }

      setIsLoading(true)
      try {
        const stream = await provider.generateStream([message], config)
        const reader = stream.getReader()
        let content = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          content += value.content
          options.onResponse?.({
            role: 'assistant',
            content
          })
        }
      } catch (error) {
        options.onError?.(error as Error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [provider, config, options]
  )

  return {
    isLoading,
    sendMessage
  }
}

function useProvider(config: AIConfig): AIProvider | null {
  return useCallback(() => {
    switch (config.provider) {
      case 'openai':
        return new OpenAIProvider(config.apiKey || '')
      // Add other providers here
      default:
        return null
    }
  }, [config])()
}
