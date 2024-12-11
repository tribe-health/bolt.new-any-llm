import { type ChatCompletionCreateParams } from 'openai/resources/chat/completions'

export type ModelProvider = 'openai' | 'anthropic' | 'local' | 'groq' | 'mistral' | 'huggingface' | 'openrouter' | 'ollama'

export type ModelType =
  | 'gpt-4'
  | 'gpt-3.5-turbo'
  | 'claude-2'
  | 'claude-instant'
  | 'mixtral-8x7b'
  | 'llama2'
  | 'codellama'
  | 'mistral-medium'
  | 'mistral-small'
  | 'mistral-tiny'

export interface Message {
  role: 'system' | 'user' | 'assistant' | 'function'
  content: string
  name?: string
  function_call?: ChatCompletionCreateParams.Function
}

export interface AIConfig {
  provider: ModelProvider
  model: ModelType
  temperature?: number
  maxTokens?: number
  apiKey?: string
  functions?: Array<{
    name: string
    description: string
    parameters: Record<string, unknown>
  }>
}

export interface StreamChunk {
  id: string
  content: string
  done: boolean
}

export interface AIResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface AIProvider {
  generateStream(messages: Message[], config: AIConfig): Promise<ReadableStream<StreamChunk>>
  generate(messages: Message[], config: AIConfig): Promise<AIResponse>
}

export interface Tool {
  name: string
  description: string
  parameters: Record<string, unknown>
  execute: (params: Record<string, unknown>) => Promise<unknown>
}

export interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

export class AIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'AIError'
  }
}

export interface ProviderCapabilities {
  streaming: boolean
  functionCalling: boolean
  systemMessages: boolean
  modelSelection: boolean
  maxTokens: number
}

export interface AuthConfig {
  type: 'apiKey' | 'oauth' | 'none'
  required: boolean
  configKey?: string
}

export interface JSONSchema {
  type: string
  properties?: Record<string, JSONSchema>
  required?: string[]
  enum?: string[]
  description?: string
}
