import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import type { ProviderInfo } from '~/utils/types';
import { Button } from '../ui/button';

interface APIKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  provider: ProviderInfo;
  onSave: (config: Record<string, string>) => void;
}

export function APIKeyDialog({ isOpen, onClose, provider, onSave }: APIKeyDialogProps) {
  const [config, setConfig] = useState<Record<string, string>>({
    apiKey: '',
    baseUrl: '',
    apiVersion: '',
  });

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const needsBaseUrl = provider.name === 'OpenAI' || provider.name === 'Azure';
  const needsApiVersion = provider.name === 'Azure';

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-zeus-dark-surface p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-lg font-medium text-zeus-dark-text-primary">
                  Configure {provider.name}
                </Dialog.Title>
                <Button
                  onClick={onClose}
                  className="text-zeus-dark-text-secondary hover:text-zeus-dark-text-primary"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zeus-dark-text-secondary mb-1">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={config.apiKey}
                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    className="w-full px-3 py-2 bg-zeus-dark-background rounded-md border border-zeus-dark-border focus:border-zeus-lightning focus:ring-1 focus:ring-zeus-lightning"
                    placeholder="Enter API key"
                  />
                </div>

                {needsBaseUrl && (
                  <div>
                    <label className="block text-sm font-medium text-zeus-dark-text-secondary mb-1">
                      Base URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={config.baseUrl}
                      onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-zeus-dark-background rounded-md border border-zeus-dark-border focus:border-zeus-lightning focus:ring-1 focus:ring-zeus-lightning"
                      placeholder="https://api.openai.com/v1"
                    />
                  </div>
                )}

                {needsApiVersion && (
                  <div>
                    <label className="block text-sm font-medium text-zeus-dark-text-secondary mb-1">
                      API Version
                    </label>
                    <input
                      type="text"
                      value={config.apiVersion}
                      onChange={(e) => setConfig({ ...config, apiVersion: e.target.value })}
                      className="w-full px-3 py-2 bg-zeus-dark-background rounded-md border border-zeus-dark-border focus:border-zeus-lightning focus:ring-1 focus:ring-zeus-lightning"
                      placeholder="2024-02-15-preview"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-zeus-dark-text-primary hover:bg-zeus-dark-background rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!config.apiKey}
                  className="px-4 py-2 text-sm font-medium bg-zeus-lightning text-white rounded-md hover:bg-zeus-lightning/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
