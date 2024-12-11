import { useState, useCallback, useRef } from 'react'
import { type Message, type AIConfig, AIError } from '@/types/ai'
import { AIService } from '@/lib/ai-service'
import { randomUUID } from 'crypto'

interface UseAIOptions {
  initialConfig: AIConfig
  onError?: (error: AIError | Error) => void
}

export function useAI({ initialConfig, onError }: UseAIOptions) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const abortControllerRef = useRef<AbortController>()
  const serviceRef = useRef<AIService>(new AIService({ config: initialConfig, onError }))

  const updateConfig = useCallback((config: Partial<AIConfig>) => {
    serviceRef.current.updateConfig(config as AIConfig)
  }, [])

  const registerTool = useCallback(
    (
      name: string,
      description: string,
      parameters: Record<string, unknown>,
      execute: (params: Record<string, unknown>) => Promise<unknown>
    ) => {
      serviceRef.current.registerTool(
        { name, description, parameters, execute }
      )
    },
    []
  )

  const sendMessage = useCallback(
    async (content: string, stream = true) => {
      try {
        setIsLoading(true)

        // Abort previous request if exists
        abortControllerRef.current?.abort()
        abortControllerRef.current = new AbortController()

        const newMessages: Message[] = [
          ...messages,
          { role: 'user', content }
        ]
        setMessages(newMessages)

        if (stream) {
          const stream = await serviceRef.current.generateStream(newMessages, initialConfig)
          const reader = stream.getReader()
          let accumulatedContent = ''

          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              break
            }

            accumulatedContent += value.content
            setMessages(prev => [
              ...prev.slice(0, -1),
              {
                role: 'assistant',
                content: accumulatedContent
              }
            ])
          }
        } else {
          const response = await serviceRef.current.generate(newMessages, initialConfig)
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: response.content
            }
          ])
        }

        // Process any tool calls
        const updatedMessages = await serviceRef.current.processToolCalls(
          messages.map((m) => {
            return {
              id: randomUUID(),
              type: 'function',
              function: {
                name: m.function_call?.name || '',
                arguments: typeof m.function_call?.parameters?.arguments === 'string' ? m.function_call.parameters.arguments : "",
              }
            }
          })
        )
        if (updatedMessages.length > messages.length) {
          setMessages(updatedMessages as Message[])
        }
      } catch (error) {
        if (error instanceof AIError) {
          onError?.(error)
        } else {
          onError?.(
            new AIError(
              'An unexpected error occurred',
              'UNKNOWN_ERROR'
            )
          )
        }
      } finally {
        setIsLoading(false)
      }
    },
    [messages, onError]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    updateConfig,
    registerTool
  }
}
