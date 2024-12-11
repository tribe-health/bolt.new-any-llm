import { forwardRef } from 'react';
import { ModelSelector } from './ModelSelector';
import { ChatInput } from './ChatInput';
import type { ProviderInfo } from '~/utils/types';
import type { Message } from '~/types/message';
import { MessageList } from './MessageList';
import { ExamplePrompts } from './ExamplePrompts';

interface BaseChatProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  model: string;
  setModel: (model: string) => void;
  provider: ProviderInfo;
  setProvider: (provider: ProviderInfo) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  apiKeys?: Record<string, string>;
  chatStarted: boolean;
  sendMessage: (event: React.UIEvent, messageInput?: string) => Promise<void>;
  modelsLoading: boolean;
  messageRef?: React.RefObject<HTMLDivElement>;
  scrollRef?: React.RefObject<HTMLDivElement>;
  handleStop: () => void;
  description?: string; 
  importChat?: (description: string, messages: Message[]) => Promise<void>;
  exportChat?: () => void;
  enhancePrompt?: () => void;
  uploadedFiles?: File[];
  setUploadedFiles?: (files: File[]) => void;
  imageDataList?: string[];
  setImageDataList?: (data: string[]) => void;
}

export const BaseChat = forwardRef<HTMLDivElement, BaseChatProps>(function BaseChat(
  {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    model,
    setModel,
    provider,
    setProvider,
    textareaRef,
    apiKeys,
    chatStarted,
    sendMessage,
    modelsLoading,
  },
  ref
) {
  return (
    <div ref={ref} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {!chatStarted ? (
          <>
            <div className="relative flex min-h-[400px] flex-col items-center justify-center bg-zeus-pattern bg-cover bg-center bg-no-repeat p-8">
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 text-center">
                <h1 className="mb-2 text-4xl font-bold text-zeus-dark-text-accent dark:text-zeus-lightning">
                  Welcome to Zeus
                </h1>
                <p className="mb-8 text-lg text-zeus-dark-text-secondary dark:text-zeus-dark-text-primary">
                  Your AI-powered coding assistant, powered by Prometheus AI
                </p>
                <div className="space-y-4">
                  <p className="text-zeus-dark-text-secondary dark:text-zeus-dark-text-primary">
                    Build full stack applications with:
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    {['Next.js', 'Svelte', 'React', 'Remix', 'Flutter'].map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-zeus-dark-surface px-4 py-2 text-zeus-lightning shadow-zeus"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <h2 className="mb-6 text-center text-2xl font-semibold text-zeus-light-text-primary dark:text-zeus-dark-text-primary">
                Get Started with Example Prompts
              </h2>
              <ExamplePrompts sendMessage={sendMessage} />
            </div>
          </>
        ) : (
          <MessageList messages={messages} />
        )}
      </div>

      <div className="flex-none px-4 py-2 bg-zeus-dark-surface border-t border-zeus-dark-border">
        <ModelSelector
          model={model}
          setModel={setModel}
          provider={provider}
          setProvider={setProvider}
          apiKeys={apiKeys}
          isLoading={modelsLoading}
        />
      </div>

      <form onSubmit={handleSubmit} className="flex-none px-4 py-2">
        <ChatInput
          value={input}
          onChange={handleInputChange}
          onSend={() => handleSubmit({} as React.FormEvent<HTMLFormElement>)}
          disabled={isLoading || modelsLoading}
          textareaRef={textareaRef}
        />
      </form>
    </div>
  );
});
