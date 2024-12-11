import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from '../chat/HeaderActionButtons.client';
import { ChatDescription } from '~/components/chat/ChatDescription';
import { useState } from 'react';
import { Link } from '@remix-run/react';
import { ChatHistoryDrawer } from '~/components/chat/ChatHistoryDrawer';

export function Header() {
  const chat = useStore(chatStore);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <>
      <header
        className={classNames(
          'flex items-center p-5 border-b h-[var(--header-height)]',
          {
            'border-transparent': !chat.started,
            'border-zeus-light-border dark:border-zeus-dark-border': chat.started,
          }
        )}
      >
        <div className="flex items-center gap-2 z-logo text-zeus-light-text-primary dark:text-zeus-dark-text-primary cursor-pointer">
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="p-2 hover:bg-zeus-dark-background-hover rounded-lg mr-2"
            aria-label="Open chat history"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-zeus-dark-text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
          <img src="/app_icon.png" alt="Zeus Logo" className="h-8 w-8" />
          <a href="/" className="text-2xl font-semibold flex items-center">
            <span className="text-zeus-lightning">Zeus</span>
            <span className="ml-2 text-sm text-zeus-light-text-secondary dark:text-zeus-dark-text-secondary">
              powered by Prometheus AI
            </span>
          </a>
        </div>
        {chat.started && (
          <>
            <span className="flex-1 px-4 truncate text-center text-zeus-light-text-primary dark:text-zeus-dark-text-primary">
              <ClientOnly>{() => <ChatDescription />}</ClientOnly>
            </span>
            <ClientOnly>
              {() => (
                <div className="mr-1">
                  <HeaderActionButtons />
                </div>
              )}
            </ClientOnly>
          </>
        )}
      </header>

      <ChatHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectChat={(chatId) => {
          // Handle chat selection
          setIsHistoryOpen(false);
        }}
      />
    </>
  );
}
