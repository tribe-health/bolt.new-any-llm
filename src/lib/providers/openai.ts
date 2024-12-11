import OpenAI from 'openai'
import {
  type AIConfig,
  type AIProvider,
  type AIResponse,
  type Message,
  type StreamChunk,
  AIError
} from '@/types/ai'

export class OpenAIProvider implements AIProvider {
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey })
  }

  async generateStream(
    messages: Message[],
    config: AIConfig
  ): Promise<ReadableStream<StreamChunk>> {
    try {
      const response = await this.client.chat.completions.create({
        model: config.model,
        messages: messages as any[],
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens,
        stream: true
      })

      return new ReadableStream({
        async start(controller) {
          try {
            for await (const part of response) {
              const content = part.choices[0]?.delta?.content || ''
              if (content) {
                controller.enqueue({
                  id: part.id,
                  content,
                  done: part.choices[0]?.finish_reason === 'stop'
                })
              }
            }
            controller.close()
          } catch (error) {
            controller.error(error)
          }
        },
        cancel() {
          // Abort the response if the stream is cancelled
          response.controller.abort()
        }
      })
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw new AIError(
          error.message,
          'OPENAI_API_ERROR',
          error.status
        )
      }
      throw new AIError(
        'Failed to generate stream',
        'UNKNOWN_ERROR'
      )
    }
  }

  async generate(
    messages: Message[],
    config: AIConfig
  ): Promise<AIResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: config.model,
        messages: messages as any[],
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens,
      })

      return {
        content: response.choices[0]?.message?.content || '',
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0
        }
      }
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw new AIError(
          error.message,
          'OPENAI_API_ERROR',
          error.status
        )
      }
      throw new AIError(
        'Failed to generate response',
        'UNKNOWN_ERROR'
      )
    }
  }
}
