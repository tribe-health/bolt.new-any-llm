import { type Tool, type ToolCall, AIError } from '@/types/ai'

export class ToolSystem {
  private tools: Map<string, Tool>

  constructor() {
    this.tools = new Map()
  }

  registerTool(tool: Tool): void {
    if (this.tools.has(tool.name)) {
      throw new AIError(
        `Tool ${tool.name} is already registered`,
        'DUPLICATE_TOOL'
      )
    }
    this.tools.set(tool.name, tool)
  }

  async executeTool(call: ToolCall): Promise<unknown> {
    const tool = this.tools.get(call.function.name)

    if (!tool) {
      throw new AIError(
        `Tool ${call.function.name} not found`,
        'TOOL_NOT_FOUND'
      )
    }

    try {
      const args = JSON.parse(call.function.arguments)
      return await tool.execute(args)
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new AIError(
          'Invalid tool arguments format',
          'INVALID_TOOL_ARGS'
        )
      }
      throw new AIError(
        `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'TOOL_EXECUTION_ERROR'
      )
    }
  }

  getToolDescriptions(): Array<{
    name: string
    description: string
    parameters: Record<string, unknown>
  }> {
    return Array.from(this.tools.values()).map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }))
  }

  clearTools(): void {
    this.tools.clear()
  }
}
