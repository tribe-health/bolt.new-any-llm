import type {
  ChatCompletionCreateParams,
  ChatCompletionMessageParam,
  ChatCompletionTool,
  ChatCompletionToolChoiceOption,
  ChatCompletionAssistantMessageParam,
  ChatCompletionUserMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionContentPart,
  ChatCompletionContentPartText,
  ChatCompletionContentPartImage,
} from 'openai/resources/chat/completions';
import type { LanguageModelV1Message, LanguageModelV1Prompt, LanguageModelV1CallOptions } from '@ai-sdk/provider';

// Re-export OpenAI types as our canonical types
export type Message = ChatCompletionMessageParam;
export type UserMessage = ChatCompletionUserMessageParam;
export type AssistantMessage = ChatCompletionAssistantMessageParam;
export type SystemMessage = ChatCompletionSystemMessageParam;
export type Tool = ChatCompletionTool;
export type ToolChoice = ChatCompletionToolChoiceOption;
export type ContentPart = ChatCompletionContentPart;
export type ContentPartText = ChatCompletionContentPartText;
export type ContentPartImage = ChatCompletionContentPartImage;

// Our streaming options, based on OpenAI's parameters
export type StreamingOptions = Pick<
  ChatCompletionCreateParams,
  'temperature' | 'top_p' | 'frequency_penalty' | 'presence_penalty' | 'seed' | 'tool_choice'
>;

// Tool result type for handling function/tool calls
export interface ToolResult<Name extends string = string, Args = unknown, Result = unknown> {
  toolCallId: string;
  toolName: Name;
  args: Args;
  result: Result;
}

// Provider-agnostic message type that includes our extensions
export interface ExtendedMessage extends Omit<Message, 'tool_calls'> {
  toolInvocations?: ToolResult[];
  model?: string;
}

export type Messages = ExtendedMessage[];

// Provider adapter interface
export interface ProviderAdapter {
  convertToProviderMessage(message: ExtendedMessage): Message;
  convertFromProviderMessage(message: Message): ExtendedMessage;
  convertToProviderOptions(options: StreamingOptions): Record<string, unknown>;
}

// Stream response type
export interface StreamResponse {
  text?: string;
  toolCalls?: ToolResult[];
  isComplete: boolean;
}

// Language model types for internal use
export interface LanguageModelMessage {
  role: 'system' | 'user' | 'assistant';
  content: { type: 'text'; text: string }[];
}

export interface LanguageModelOptions {
  inputFormat: 'messages';
  mode: {
    type: 'regular';
    toolChoice?: { type: 'none' | 'auto' };
  };
  prompt: LanguageModelMessage[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  seed?: number;
}
