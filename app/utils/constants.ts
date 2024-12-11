import type { ModelInfo, ProviderInfo } from '~/utils/types';
import Cookies from 'js-cookie';

export const WORK_DIR_NAME = 'project';
export const WORK_DIR = `/home/${WORK_DIR_NAME}`;
export const MODIFICATIONS_TAG_NAME = 'bolt_file_modifications';
export const MODEL_REGEX = /^\[Model: (.*?)\]\n\n/;
export const PROVIDER_REGEX = /\[Provider: (.*?)\]\n\n/;
export const DEFAULT_MODEL = 'anthropic/claude-3.5-sonnet';
export const PROMPT_COOKIE_KEY = 'cachedPrompt';

export const PROVIDER_LIST: ProviderInfo[] = [
  {
    name: 'OpenRouter',
    staticModels: [
      { name: 'gpt-4', label: 'GPT-4', provider: 'OpenRouter', maxTokenAllowed: 8000 },
      { name: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', provider: 'OpenRouter', maxTokenAllowed: 4000 },
      { name: 'anthropic/claude-3-opus', label: 'Claude 3 Opus', provider: 'OpenRouter', maxTokenAllowed: 16000 },
      { name: 'anthropic/claude-3-sonnet', label: 'Claude 3 Sonnet', provider: 'OpenRouter', maxTokenAllowed: 8000 },
      { name: 'anthropic/claude-2.1', label: 'Claude 2.1', provider: 'OpenRouter', maxTokenAllowed: 8000 },
      { name: 'meta-llama/llama-2-70b-chat', label: 'Llama 2 70B', provider: 'OpenRouter', maxTokenAllowed: 4000 },
      { name: 'google/gemini-pro', label: 'Gemini Pro', provider: 'OpenRouter', maxTokenAllowed: 8000 },
      { name: 'mistral/mistral-medium', label: 'Mistral Medium', provider: 'OpenRouter', maxTokenAllowed: 8000 }
    ],
    getApiKeyLink: 'https://openrouter.ai/settings/keys',
  },
  {
    name: 'OpenAI',
    staticModels: [
      { name: 'gpt-4', label: 'GPT-4', provider: 'OpenAI', maxTokenAllowed: 8000 },
      { name: 'gpt-4-turbo', label: 'GPT-4 Turbo', provider: 'OpenAI', maxTokenAllowed: 128000 },
      { name: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', provider: 'OpenAI', maxTokenAllowed: 4000 },
    ],
    getApiKeyLink: 'https://platform.openai.com/api-keys',
  },
  {
    name: 'Anthropic',
    staticModels: [
      { name: 'claude-3-opus', label: 'Claude 3 Opus', provider: 'Anthropic', maxTokenAllowed: 16000 },
      { name: 'claude-3-sonnet', label: 'Claude 3 Sonnet', provider: 'Anthropic', maxTokenAllowed: 8000 },
      { name: 'claude-2.1', label: 'Claude 2.1', provider: 'Anthropic', maxTokenAllowed: 8000 },
    ],
    getApiKeyLink: 'https://console.anthropic.com/settings/keys',
  },
  {
    name: 'Google',
    staticModels: [
      { name: 'gemini-pro', label: 'Gemini Pro', provider: 'Google', maxTokenAllowed: 8000 },
      { name: 'gemini-pro-vision', label: 'Gemini Pro Vision', provider: 'Google', maxTokenAllowed: 8000 },
    ],
    getApiKeyLink: 'https://makersuite.google.com/app/apikey',
  },
];

// Ensure we always have a valid default provider
export const DEFAULT_PROVIDER: ProviderInfo = PROVIDER_LIST[0];

// Get all static models from providers
export const MODEL_LIST: ModelInfo[] = PROVIDER_LIST.flatMap(provider => 
  provider.staticModels.map(model => ({
    ...model,
    provider: provider.name,
  }))
);

export async function initializeModelList(): Promise<ModelInfo[]> {
  let apiKeys: Record<string, string> = {};

  try {
    const storedApiKeys = Cookies.get('apiKeys');

    if (storedApiKeys) {
      const parsedKeys = JSON.parse(storedApiKeys);

      if (typeof parsedKeys === 'object' && parsedKeys !== null) {
        apiKeys = parsedKeys;
      }
    }
  } catch (error: any) {
    console.warn(`Failed to fetch apikeys from cookies:${error?.message}`);
  }

  // For now, just return the static model list
  // In the future, this could fetch dynamic models from providers
  return MODEL_LIST;
}
