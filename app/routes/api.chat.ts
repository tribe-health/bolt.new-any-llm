import { json } from '@remix-run/cloudflare'
import { type ActionFunctionArgs } from '@remix-run/cloudflare'
import { createProvider } from '~/lib/providers/factory'
import { type Message, isMessageContentArray, type MessageContent } from '~/types/message'
import { type ProviderConfig } from '~/lib/providers/base'

interface ChatRequest {
  messages: Message[]
  apiKeys: { [key: string]: string | ProviderConfig }
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json() as ChatRequest
    const { messages, apiKeys } = body
    
    if (!Array.isArray(messages) || !messages.length) {
      return json({ error: 'Invalid messages array' }, { status: 400 })
    }

    // Extract provider and model from the last message
    const lastMessage = messages[messages.length - 1];
    let messageText = '';
    
    if (isMessageContentArray(lastMessage.content)) {
      const textContent = lastMessage.content.find((c: MessageContent) => c.type === 'text');
      messageText = textContent?.text || '';
    } else {
      messageText = lastMessage.content;
    }

    // Parse provider and model from the message
    const providerMatch = messageText.match(/\[Provider: (.+?)\]/);
    const modelMatch = messageText.match(/\[Model: (.+?)\]/);
    
    if (!providerMatch || !modelMatch) {
      return json({ error: 'Provider or model not specified in message' }, { status: 400 });
    }

    const providerName = providerMatch[1].toLowerCase();
    const modelName = modelMatch[1];

    // Get the API key or config for the selected provider
    const providerConfig = apiKeys[providerName];
    
    if (!providerConfig) {
      return json({ error: `API key not found for provider: ${providerName}` }, { status: 400 });
    }

    // Create provider instance using the factory
    const provider = createProvider(providerName, providerConfig);

    // Clean the messages by removing the provider/model tags from the last message
    const cleanedMessages = [...messages];
    const cleanedContent = messageText.replace(/\[Provider: .+?\]/, '').replace(/\[Model: .+?\]/, '').trim();
    const lastCleanedMessage = cleanedMessages[cleanedMessages.length - 1];
    
    if (isMessageContentArray(lastCleanedMessage.content)) {
      const textContent = lastCleanedMessage.content.find((c: MessageContent) => c.type === 'text');
      if (textContent) {
        textContent.text = cleanedContent;
      }
    } else {
      lastCleanedMessage.content = cleanedContent;
    }

    const response = await provider.generate(cleanedMessages, {
      provider: providerName,
      model: modelName,
      temperature: 0.7,
      maxTokens: 4096
    })

    return json(response)
  } catch (error) {
    console.error('Chat API Error:', error)
    return json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
