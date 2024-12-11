import { useState, useEffect } from 'react';
import { Dialog, DialogTitle } from '~/components/ui/Dialog';
import { IconButton } from '~/components/ui/IconButton';
import { PROVIDER_LIST } from '~/utils/constants';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<'providers' | 'features'>('providers');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>(() => {
    const savedApiKeys = Cookies.get('apiKeys');
    try {
      return savedApiKeys ? JSON.parse(savedApiKeys) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const savedApiKeys = Cookies.get('apiKeys');
    if (savedApiKeys) {
      try {
        const parsedKeys = JSON.parse(savedApiKeys);
        setApiKeys(parsedKeys);
      } catch (error) {
        console.error('Failed to parse API keys:', error);
      }
    }
  }, []);

  const handleApiKeyChange = (provider: string, value: string) => {
    const newApiKeys = { ...apiKeys, [provider.toLowerCase()]: value };
    setApiKeys(newApiKeys);
    Cookies.set('apiKeys', JSON.stringify(newApiKeys));
    toast.success(`${provider} API key updated`);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="flex h-full">
        <div className="w-48 border-r border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 p-4">
          <DialogTitle className="mb-4">Settings</DialogTitle>
          <div className="flex flex-col gap-2">
            <button
              className={`flex items-center gap-2 p-2 rounded-lg ${
                activeTab === 'providers'
                  ? 'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent'
                  : 'hover:bg-bolt-elements-item-backgroundHover'
              }`}
              onClick={() => setActiveTab('providers')}
            >
              <div className="i-ph:key" />
              Providers
            </button>
            <button
              className={`flex items-center gap-2 p-2 rounded-lg ${
                activeTab === 'features'
                  ? 'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent'
                  : 'hover:bg-bolt-elements-item-backgroundHover'
              }`}
              onClick={() => setActiveTab('features')}
            >
              <div className="i-ph:star" />
              Features
            </button>
          </div>
        </div>

        <div className="flex-1 p-6">
          {activeTab === 'providers' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">API Keys</h2>
              {PROVIDER_LIST.map((provider) => (
                <div key={provider.name} className="space-y-2">
                  <label className="block text-sm font-medium">
                    {provider.name}
                    {provider.getApiKeyLink && (
                      <a
                        href={provider.getApiKeyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-xs text-bolt-elements-textTertiary hover:text-bolt-elements-textSecondary"
                      >
                        Get API Key
                      </a>
                    )}
                  </label>
                  <input
                    type="password"
                    value={apiKeys[provider.name.toLowerCase()] || ''}
                    onChange={(e) => handleApiKeyChange(provider.name, e.target.value)}
                    className="w-full p-2 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1"
                    placeholder={`Enter ${provider.name} API Key`}
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'features' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Features</h2>
              <p className="text-bolt-elements-textSecondary">Feature settings coming soon...</p>
            </div>
          )}
        </div>

        <IconButton
          className="absolute top-[10px] right-[10px]"
          onClick={onClose}
        >
          <div className="i-ph:x text-lg" />
        </IconButton>
      </div>
    </Dialog>
  );
}
