import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { streamText, type LanguageModelV1 } from 'ai';
import { getModel } from '~/lib/.server/llm/model';
import { stripIndents } from '~/utils/stripIndent';
import type { ProviderInfo } from '~/types/model';
import { getSystemPrompt } from '~/lib/.server/llm/prompts';

interface EnhancerRequest {
  message: string;
  model: string;
  provider: ProviderInfo;
  apiKeys?: Record<string, string>;
}

export async function action(args: ActionFunctionArgs) {
  return enhancerAction(args);
}

async function enhancerAction({ context, request }: ActionFunctionArgs): Promise<Response> {
  const { message, model, provider, apiKeys } = await request.json<EnhancerRequest>();

  const { name: providerName } = provider;

  // validate 'model' and 'provider' fields
  if (!model || typeof model !== 'string') {
    throw new Response('Invalid or missing model', {
      status: 400,
      statusText: 'Bad Request',
    });
  }

  if (!providerName || typeof providerName !== 'string') {
    throw new Response('Invalid or missing provider', {
      status: 400,
      statusText: 'Bad Request',
    });
  }

  try {
    const llm = getModel(providerName, model, context.cloudflare.env, apiKeys) as LanguageModelV1;

    const stream = await streamText({
      model: llm,
      messages: [
        {
          role: 'user' as const,
          content:
            `[Model: ${model}]\n\n[Provider: ${providerName}]\n\n` +
            stripIndents`
            You are a professional prompt engineer specializing in crafting precise, effective prompts.
            Your task is to enhance prompts by making them more specific, actionable, and effective.

            I want you to improve the user prompt that is wrapped in \`<original_prompt>\` tags.

            For valid prompts:
            - Make instructions explicit and unambiguous
            - Add relevant context and constraints
            - Remove redundant information
            - Maintain the core intent
            - Ensure the prompt is self-contained
            - Use professional language

            For invalid or unclear prompts:
            - Respond with a clear, professional guidance message
            - Keep responses concise and actionable
            - Maintain a helpful, constructive tone
            - Focus on what the user should provide
            - Use a standard template for consistency

            IMPORTANT: Your response must ONLY contain the enhanced prompt text.
            Do not include any explanations, metadata, or wrapper tags.

            <original_prompt>
              ${message}
            </original_prompt>
          `,
        },
      ],
      system: getSystemPrompt(),
    });

    // Return the streaming response
    return new Response(stream.toDataStream(), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });

  } catch (error: unknown) {
    console.error('Enhancer error:', error);

    if (error instanceof Error && error.message?.includes('API key')) {
      throw new Response('Invalid or missing API key', {
        status: 401,
        statusText: 'Unauthorized',
      });
    }

    throw new Response('Internal server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}
