import { getModel } from '~/lib/.server/llm/model';
import { MAX_TOKENS } from './constants';
import { getSystemPrompt } from './prompts';
import { DEFAULT_MODEL, PROVIDER_LIST, getModelList, MODEL_REGEX, PROVIDER_REGEX } from '~/utils/constants';
import type {
  Message,
  Messages,
  StreamingOptions,
  ExtendedMessage,
  ContentPartText,
} from './types';
import type {
  LanguageModelV1,
  LanguageModelV1CallOptions,
  LanguageModelV1Message,
  LanguageModelV1Prompt,
  LanguageModelV1ProviderMetadata,
} from '@ai-sdk/provider';

const DEFAULT_PROVIDER = PROVIDER_LIST[0];

function extractPropertiesFromMessage(message: ExtendedMessage): { model: string; provider: string; content: string } {
  const textContent = typeof message.content === 'string'
    ? message.content
    : Array.isArray(message.content)
      ? message.content.find((item): item is ContentPartText => item.type === 'text')?.text || ''
      : '';

  const modelMatch = textContent.match(MODEL_REGEX);
  const providerMatch = textContent.match(PROVIDER_REGEX);

  const model = modelMatch ? modelMatch[1] : DEFAULT_MODEL;
  const provider = providerMatch ? providerMatch[1] : DEFAULT_PROVIDER.name;

  const cleanedContent = typeof message.content === 'string'
    ? message.content.replace(MODEL_REGEX, '').replace(PROVIDER_REGEX, '')
    : Array.isArray(message.content)
      ? message.content.map(item => {
          if (item.type === 'text') {
            return {
              type: 'text' as const,
              text: item.text.replace(MODEL_REGEX, '').replace(PROVIDER_REGEX, '')
            };
          }
          return item;
        })
      : textContent.replace(MODEL_REGEX, '').replace(PROVIDER_REGEX, '');

  return { model, provider, content: typeof cleanedContent === 'string' ? cleanedContent : JSON.stringify(cleanedContent) };
}

function createTextPart(text: string) {
  return {
    type: 'text' as const,
    text
  };
}

function convertToProviderMessages(messages: Messages): LanguageModelV1Prompt {
  const convertedMessages: LanguageModelV1Message[] = [];

  // Add system message
  const systemPrompt = getSystemPrompt();
  if (systemPrompt) {
    convertedMessages.push({
      role: 'system',
      content: systemPrompt,
      providerMetadata: {} as LanguageModelV1ProviderMetadata
    } as LanguageModelV1Message);
  }

  // Add user and assistant messages
  messages.forEach(message => {
    // Skip empty messages
    if (!message.content) return;

    const content = typeof message.content === 'string'
      ? message.content
      : JSON.stringify(message.content);

    // Only add message if content is not empty
    if (content.trim()) {
      convertedMessages.push({
        role: message.role,
        content: content,
        providerMetadata: {} as LanguageModelV1ProviderMetadata
      } as LanguageModelV1Message);
    }
  });

  // Debug log
  console.log('Converted messages:', JSON.stringify(convertedMessages, null, 2));

  // Validate messages
  if (convertedMessages.length === 0 || !convertedMessages.some(msg => msg.role === 'user' && msg.content)) {
    throw new Error('Messages must contain at least one non-empty user message');
  }

  return convertedMessages;
}

export async function streamText(
  messages: Messages,
  env: Env,
  options?: StreamingOptions,
  apiKeys?: Record<string, string>,
): Promise<ReadableStream> {
  let currentModel = DEFAULT_MODEL;
  let currentProvider = DEFAULT_PROVIDER.name;
  const MODEL_LIST = await getModelList(apiKeys || {});
  const processedMessages = messages.map((message) => {
    if (message.role === 'user') {
      const { model, provider, content } = extractPropertiesFromMessage(message);

      if (MODEL_LIST.find((m) => m.name === model)) {
        currentModel = model;
      }

      currentProvider = provider;

      return { ...message, content };
    }

    return message;
  });

  const modelDetails = MODEL_LIST.find((m) => m.name === currentModel);
  const dynamicMaxTokens = modelDetails && modelDetails.maxTokenAllowed ? modelDetails.maxTokenAllowed : MAX_TOKENS;

  const model = getModel(currentProvider, currentModel, env, apiKeys) as LanguageModelV1;

  try {
    // Base options that work for all providers
    const streamOptions: LanguageModelV1CallOptions = {
      inputFormat: 'messages', // All modern LLMs support message-based chat
      mode: {
        type: 'regular'
      },
      prompt: convertToProviderMessages(processedMessages),
      maxTokens: dynamicMaxTokens,
      temperature: options?.temperature ?? undefined,
      // ... other options
    };

    // Let the model's implementation handle provider-specific adaptations
    const response = await model.doStream(streamOptions);

    // Transform the response into OpenAI-compatible format for consistency
    const encoder = new TextEncoder();
    const transform = new TransformStream({
      start(controller) {
        // Send initial role message
        const message = {
          id: `chatcmpl-${Date.now()}`,
          object: 'chat.completion.chunk',
          created: Date.now(),
          model: currentModel,
          choices: [{
            index: 0,
            delta: { role: 'assistant' },
            finish_reason: null
          }]
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\r\n\r\n`));
      },
      transform(chunk, controller) {
        try {
          if (typeof chunk === 'object' && chunk !== null && 'type' in chunk) {
            if (chunk.type === 'text-delta' && 'textDelta' in chunk) {
              const content = chunk.textDelta;
              if (content !== '') {
                const message = {
                  id: `chatcmpl-${Date.now()}`,
                  object: 'chat.completion.chunk',
                  created: Date.now(),
                  model: currentModel,
                  choices: [{
                    index: 0,
                    delta: { content },
                    finish_reason: null
                  }]
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\r\n\r\n`));
              }
            } else if (chunk.type === 'finish') {
              const message = {
                id: `chatcmpl-${Date.now()}`,
                object: 'chat.completion.chunk',
                created: Date.now(),
                model: currentModel,
                choices: [{
                  index: 0,
                  delta: {},
                  finish_reason: 'stop'
                }]
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\r\n\r\n`));
              controller.enqueue(encoder.encode('data: [DONE]\r\n\r\n'));
            }
          } else if (typeof chunk === 'string') {
            const message = {
              id: `chatcmpl-${Date.now()}`,
              object: 'chat.completion.chunk',
              created: Date.now(),
              model: currentModel,
              choices: [{
                index: 0,
                delta: { content: chunk },
                finish_reason: null
              }]
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\r\n\r\n`));
          }
        } catch (error) {
          console.error('Transform error:', error);
          controller.error(error);
        }
      }
    });

    response.stream.pipeTo(transform.writable).catch((error) => {
      console.error('Stream error:', error);
      transform.writable.abort(error);
    });

    return transform.readable;
  } catch (error) {
    console.error('Error in streamText:', error);
    throw error;
  }
}
