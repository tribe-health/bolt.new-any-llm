import { useStore } from '@nanostores/react';
import type { Message } from 'ai';
import { useChat } from 'ai/react';
import { useAnimate } from 'framer-motion';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { cssTransition, toast, ToastContainer } from 'react-toastify';
import { useMessageParser, usePromptEnhancer, useShortcuts, useSnapScroll } from '~/lib/hooks';
import { description, useChatHistory } from '~/lib/persistence';
import { chatStore } from '~/lib/stores/chat';
import { DEFAULT_MODEL, DEFAULT_PROVIDER, PROMPT_COOKIE_KEY, PROVIDER_LIST } from '~/utils/constants';
import { cubicEasingFn } from '~/utils/easings';
import { createScopedLogger, renderLogger } from '~/utils/logger';
import { BaseChat } from './BaseChat';
import Cookies from 'js-cookie';
import type { ProviderInfo } from '~/utils/types';
import { debounce } from '~/utils/debounce';

const toastAnimation = cssTransition({
  enter: 'animated fadeInRight',
  exit: 'animated fadeOutRight',
});

const logger = createScopedLogger('Chat');

interface ChatProps {
  type?: 'chat' | 'workbench';
  title?: string;
}

export const Chat = memo<ChatProps>(function Chat({ type = 'chat', title = 'Chat' }) {
  renderLogger.trace('Chat');

  const { ready, initialMessages, storeMessageHistory, importChat, exportChat } = useChatHistory();
  const chatTitle = useStore(description);

  if (!ready) return null;

  return (
    <>
      <ChatImpl
        description={chatTitle}
        initialMessages={initialMessages}
        exportChat={exportChat}
        importChat={importChat}
        storeMessageHistory={storeMessageHistory}
      />
      <ToastContainer
        closeButton={({ closeToast }) => (
          <button
            className="Toastify__close-button"
            onClick={closeToast}
            aria-label="Close notification"
          >
            <div className="i-ph:x text-lg" />
          </button>
        )}
        icon={({ type }) => {
          switch (type) {
            case 'success': {
              return <div className="i-ph:check-bold text-zeus-lightning text-2xl" />;
            }
            case 'error': {
              return <div className="i-ph:warning-circle-bold text-red-500 text-2xl" />;
            }
            default:
              return null;
          }
        }}
        position="bottom-right"
        pauseOnFocusLoss
        transition={toastAnimation}
      />
    </>
  );
});

interface ChatImplProps {
  initialMessages: Message[];
  storeMessageHistory: (messages: Message[]) => Promise<void>;
  importChat: (description: string, messages: Message[]) => Promise<void>;
  exportChat: () => void;
  description?: string;
}

const ChatImpl = memo<ChatImplProps>(function ChatImpl({ description, initialMessages, storeMessageHistory, importChat, exportChat }) {
  useShortcuts();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [chatStarted, setChatStarted] = useState(initialMessages.length > 0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [imageDataList, setImageDataList] = useState<string[]>([]);

  const [model, setModel] = useState(() => {
    const savedModel = Cookies.get('selectedModel');
    return savedModel || DEFAULT_MODEL;
  });

  const [provider, setProvider] = useState<ProviderInfo>(DEFAULT_PROVIDER);

  useEffect(() => {
    const savedProvider = Cookies.get('selectedProvider');
    if (savedProvider) {
      const foundProvider = PROVIDER_LIST.find((p) => p.name === savedProvider);
      if (foundProvider) {
        setProvider(foundProvider);
      }
    }
  }, []);

  const { showChat } = useStore(chatStore);

  const [animationScope, animate] = useAnimate();

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

  const { messages, isLoading, input, handleInputChange, setInput, stop, append } = useChat({
    api: '/api/chat',
    body: {
      apiKeys: {
        [provider.name.toLowerCase()]: apiKeys[provider.name.toLowerCase()],
      },
    },
    onError(error) {
      logger.error('Request failed\n\n', error);
      toast.error(
        'There was an error processing your request: ' + (error.message ? error.message : 'No details were returned'),
      );
    },
    onFinish() {
      logger.debug('Finished streaming');
    },
    initialMessages,
    initialInput: Cookies.get(PROMPT_COOKIE_KEY) || '',
  });

  const { enhancingPrompt, promptEnhanced, enhancePrompt, resetEnhancer } = usePromptEnhancer();
  const { parsedMessages, parseMessages } = useMessageParser();

  const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;

  useEffect(() => {
    chatStore.setKey('started', initialMessages.length > 0);
  }, []);

  useEffect(() => {
    parseMessages(messages as Message[], isLoading);

    if (messages.length > initialMessages.length) {
      storeMessageHistory(messages).catch((error) => toast.error(error.message));
    }
  }, [messages, isLoading, parseMessages]);

  const scrollTextArea = () => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  };

  const abort = () => {
    stop();
    chatStore.setKey('aborted', true);
  };

  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = 'auto';

      const scrollHeight = textarea.scrollHeight;

      textarea.style.height = `${Math.min(scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
      textarea.style.overflowY = scrollHeight > TEXTAREA_MAX_HEIGHT ? 'auto' : 'hidden';
    }
  }, [input, textareaRef]);

  const runAnimation = async () => {
    if (chatStarted) {
      return;
    }

    await Promise.all([
      animate('#examples', { opacity: 0, display: 'none' }, { duration: 0.1 }),
      animate('#intro', { opacity: 0, flex: 1 }, { duration: 0.2, ease: cubicEasingFn }),
    ]);

    chatStore.setKey('started', true);
    setChatStarted(true);
  };

  const sendMessage = async (_event: React.UIEvent, messageInput?: string) => {
    const _input = messageInput || input;

    if (_input.length === 0 || isLoading) {
      return;
    }

    // Check if API key is available for the selected provider
    if (!apiKeys[provider.name.toLowerCase()]) {
      toast.error(`Please set up your ${provider.name} API key in settings first.`);
      return;
    }

    chatStore.setKey('aborted', false);

    runAnimation();

    append({
      role: 'user',
      content: [
        {
          type: 'text',
          text: `[Model: ${model}]\n\n[Provider: ${provider.name}]\n\n${_input}`,
        },
        ...imageDataList.map((imageData) => ({
          type: 'image',
          image: imageData,
        })),
      ] as any,
    });

    setInput('');
    Cookies.remove(PROMPT_COOKIE_KEY);

    setUploadedFiles([]);
    setImageDataList([]);

    resetEnhancer();

    textareaRef.current?.blur();
  };

  const onTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(event);
  };

  const debouncedCachePrompt = useCallback(
    debounce((event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const trimmedValue = event.target.value.trim();
      Cookies.set(PROMPT_COOKIE_KEY, trimmedValue, { expires: 30 });
    }, 1000),
    []
  );

  const [messageRef, scrollRef] = useSnapScroll();

  const handleModelChange = (newModel: string) => {
    setModel(newModel);
    Cookies.set('selectedModel', newModel, { expires: 30 });
  };

  const handleProviderChange = (newProvider: ProviderInfo) => {
    setProvider(newProvider);
    Cookies.set('selectedProvider', newProvider.name, { expires: 30 });
  };

  return (
    <BaseChat
      ref={animationScope}
      textareaRef={textareaRef}
      messages={messages}
      input={input}
      handleInputChange={onTextareaChange}
      handleSubmit={(e) => sendMessage(e as any, input)}
      isLoading={isLoading}
      model={model}
      setModel={handleModelChange}
      provider={provider}
      setProvider={handleProviderChange}
      apiKeys={apiKeys}
      chatStarted={chatStarted}
      sendMessage={sendMessage}
      messageRef={messageRef as any}
      scrollRef={scrollRef as any}
      handleStop={abort}
      description={description}
      importChat={importChat}
      exportChat={exportChat}
      enhancePrompt={() => {
        enhancePrompt(
          input,
          (input) => {
            setInput(input);
            scrollTextArea();
          },
          model,
          provider,
          apiKeys,
        );
      }}
      uploadedFiles={uploadedFiles}
      setUploadedFiles={setUploadedFiles}
      imageDataList={imageDataList}
      setImageDataList={setImageDataList}
      modelsLoading={isLoading}
    />
  );
});
