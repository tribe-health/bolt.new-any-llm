import { type AIConfig, type Message, type Tool, type ToolCall } from '@/types/ai'
import { OpenAIProvider } from '@/lib/providers/openai'

interface AIServiceOptions {
  config: AIConfig
  tools?: Tool[]
  onError?: (error: Error) => void
}

interface LastMessage {
  function_call?: {
    name: string;
    arguments: any;
  };
  content: string;
}

export class AIService {
  private provider
  private tools: Map<string, Tool>

  constructor(options: AIServiceOptions) {
    this.provider = this.createProvider(options.config)
    this.tools = new Map()
    options.tools?.forEach(tool => {
      this.tools.set(tool.name, tool)
    })
  }

  private createProvider(config: AIConfig) {
    switch (config.provider) {
      case 'openai':
        return new OpenAIProvider(config.apiKey || '')
      // Add other providers here
      default:
        throw new Error(`Unsupported provider: ${config.provider}`)
    }
  }

  async processToolCall(toolCall: ToolCall): Promise<unknown> {
    const tool = this.tools.get(toolCall.function.name)
    if (!tool) {
      throw new Error(`Tool not found: ${toolCall.function.name}`)
    }

    try {
      const args = JSON.parse(toolCall.function.arguments)
      return await tool.execute(args)
    } catch (error) {
      throw new Error(`Failed to execute tool ${toolCall.function.name}: ${error}`)
    }
  }

  async processMessage(message: Message, config: AIConfig): Promise<Message> {
    const response = await this.provider.generate([message], {
      ...config,
      functions: Array.from(this.tools.values()).map(tool => ({
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
      }))
    })

    const lastMessage: LastMessage = response.content as unknown as LastMessage;
    if (lastMessage.function_call) {
      const result = await this.processToolCall({
        id: crypto.randomUUID(),
        type: 'function',
        function: {
          name: lastMessage.function_call.name,
          arguments: JSON.stringify(lastMessage.function_call.arguments)
        }
      })

      return {
        role: 'function',
        name: lastMessage.function_call.name,
        content: JSON.stringify(result)
      }
    }

    return {
      role: 'assistant',
      content: response.content
    }
  }

  registerTool(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  unregisterTool(toolName: string): void {
    this.tools.delete(toolName);
  }

  updateConfig(newConfig: AIConfig) {
    this.provider = this.createProvider(newConfig);
    // Update any other necessary properties or states
  }

  generateStream(messages: Message[], config: AIConfig) {
    return this.provider.generateStream(messages, config)
  }

  async generate(messages: Message[], config: AIConfig) {
    return await  this.provider.generate(messages, config)
  }

  async processToolCalls(toolCalls: ToolCall[]) {
    return Promise.all(toolCalls.map(toolCall => this.processToolCall(toolCall)))
  }
}
