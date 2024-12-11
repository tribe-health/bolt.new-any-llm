import { useState } from 'react';
import { MODEL_LIST, PROVIDER_LIST } from '~/utils/constants';
import type { ProviderInfo } from '~/utils/types';
import Cookies from 'js-cookie';
import { APIKeyDialog } from './APIKeyDialog';
import { Loader2 } from 'lucide-react';

export interface ModelSelectorProps {
  model: string;
  setModel: (model: string) => void;
  provider: ProviderInfo;
  setProvider: (provider: ProviderInfo) => void;
  modelList?: typeof MODEL_LIST;
  apiKeys?: Record<string, string>;
  isLoading?: boolean;
}

export function ModelSelector({
  model,
  setModel,
  provider,
  setProvider,
  modelList = MODEL_LIST,
  apiKeys = {},
  isLoading = false,
}: ModelSelectorProps) {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const filteredModels = modelList.filter((m) => m.provider === provider.name);

  const handleSaveApiKey = () => {
    const updatedKeys = { ...apiKeys, [provider.name]: apiKey };
    Cookies.set('apiKeys', JSON.stringify(updatedKeys));
    setShowApiKeyInput(false);
    setApiKey('');
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = PROVIDER_LIST.find(p => p.name === e.target.value);
    if (newProvider) {
      setProvider(newProvider);
      const firstModel = modelList.find(m => m.provider === newProvider.name);
      if (firstModel) {
        setModel(firstModel.name);
      }
    }
  };

  const handleApiKeySave = (config: Record<string, string>) => {
    // Handle saving API key configuration
    console.log('Saving API key config:', config);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto px-4">
      <div className="flex gap-4 w-full">
        <div className="flex-1">
          <label htmlFor="provider-select" className="text-sm text-zeus-dark-text-secondary">
            Provider
          </label>
          <select
            id="provider-select"
            value={provider.name}
            onChange={handleProviderChange}
            className="w-full mt-1 rounded-lg border border-zeus-dark-border bg-zeus-dark-background px-3 py-2 text-sm text-zeus-dark-text-primary focus:outline-none focus:ring-2 focus:ring-zeus-lightning"
            disabled={isLoading}
          >
            {PROVIDER_LIST.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="model-select" className="text-sm text-zeus-dark-text-secondary">
            Model
          </label>
          <select
            id="model-select"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full mt-1 rounded-lg border border-zeus-dark-border bg-zeus-dark-background px-3 py-2 text-sm text-zeus-dark-text-primary focus:outline-none focus:ring-2 focus:ring-zeus-lightning"
            disabled={isLoading}
          >
            {isLoading ? (
              <option value="">Loading models...</option>
            ) : (
              filteredModels.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.label}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="flex items-end">
          {!apiKeys[provider.name] ? (
            <button
              onClick={() => setIsDialogOpen(true)}
              className="w-32 rounded-lg border border-zeus-dark-border bg-zeus-dark-background px-3 py-2 text-sm text-zeus-dark-text-primary hover:bg-zeus-dark-background-hover"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Add API Key'
              )}
            </button>
          ) : (
            <button
              onClick={() => window.open(provider.getApiKeyLink, '_blank')}
              className="w-32 rounded-lg border border-zeus-dark-border bg-zeus-dark-background px-3 py-2 text-sm text-zeus-dark-text-primary hover:bg-zeus-dark-background-hover"
            >
              Get API Key
            </button>
          )}
        </div>
      </div>

      {showApiKeyInput && (
        <div className="flex gap-2">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter API Key"
            className="flex-1 rounded-lg border border-zeus-dark-border bg-zeus-dark-background px-3 py-2 text-sm text-zeus-dark-text-primary focus:outline-none focus:ring-2 focus:ring-zeus-lightning"
          />
          <button
            onClick={handleSaveApiKey}
            className="w-20 rounded-lg border border-zeus-dark-border bg-zeus-dark-background px-3 py-2 text-sm text-zeus-dark-text-primary hover:bg-zeus-dark-background-hover"
          >
            Save
          </button>
          <button
            onClick={() => setShowApiKeyInput(false)}
            className="w-20 rounded-lg border border-zeus-dark-border bg-zeus-dark-background px-3 py-2 text-sm text-zeus-dark-text-primary hover:bg-zeus-dark-background-hover"
          >
            Cancel
          </button>
        </div>
      )}

      <APIKeyDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        provider={provider}
        onSave={handleApiKeySave}
      />
    </div>
  );
}
