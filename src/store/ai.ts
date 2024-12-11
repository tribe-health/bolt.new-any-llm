import { create } from 'zustand'
import { type AIConfig } from '@/types/ai'

interface AIState {
  config: AIConfig
  setConfig: (config: Partial<AIConfig>) => void
  resetConfig: () => void
}

const DEFAULT_CONFIG: AIConfig = {
  provider: import.meta.env.VITE_DEFAULT_PROVIDER as AIConfig['provider'] || 'openai',
  model: import.meta.env.VITE_DEFAULT_MODEL || 'gpt-4',
  temperature: Number(import.meta.env.VITE_TEMPERATURE) || 0.7,
  maxTokens: Number(import.meta.env.VITE_MAX_TOKENS) || 4096,
  apiKey: import.meta.env[`${import.meta.env.VITE_DEFAULT_PROVIDER?.toUpperCase()}_API_KEY`] || ''
}

export const useAIStore = create<AIState>()((set) => ({
  config: DEFAULT_CONFIG,
  setConfig: (newConfig: Partial<AIConfig>) =>
    set((state) => ({
      config: { ...state.config, ...newConfig }
    })),
  resetConfig: () => set({ config: DEFAULT_CONFIG })
}))
