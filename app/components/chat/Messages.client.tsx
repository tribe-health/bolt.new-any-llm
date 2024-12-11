import type { Message } from 'ai';
import React from 'react';
import { classNames } from '~/utils/classNames';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';
import { useLocation } from '@remix-run/react';
import { db, chatId } from '~/lib/persistence/useChatHistory';
import { forkChat } from '~/lib/persistence/db';
import { toast } from 'react-toastify';
import WithTooltip from '~/components/ui/Tooltip';
import { convertToCustomMessage } from '~/types/message';

interface MessagesProps {
  id?: string;
  className?: string;
  isStreaming?: boolean;
  messages?: Message[];
  messageRef?: React.RefCallback<HTMLDivElement>;
  scrollRef?: React.RefCallback<HTMLDivElement>;
}

export const Messages = React.forwardRef<HTMLDivElement, MessagesProps>((props: MessagesProps, ref) => {
  const { id, isStreaming = false, messages = [], messageRef, scrollRef } = props;
  const location = useLocation();

  const handleRewind = (messageId: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('rewindTo', messageId);
    window.location.search = searchParams.toString();
  };

  const handleFork = async (messageId: string) => {
    try {
      if (!db || !chatId.get()) {
        toast.error('Chat persistence is not available');
        return;
      }

      const urlId = await forkChat(db, chatId.get()!, messageId);
      window.location.href = `/chat/${urlId}`;
    } catch (error) {
      toast.error('Failed to fork chat: ' + (error as Error).message);
    }
  };

  return (
    <div 
      id={id} 
      ref={ref} 
      className={classNames('w-full space-y-4 overflow-y-auto px-4', props.className)}
    >
      {messages.length > 0
        ? messages.map((message, index) => {
            const { role, content, id: messageId } = message;
            const isUserMessage = role === 'user';
            const isFirst = index === 0;
            const isLast = index === messages.length - 1;

            return (
              <div
                key={index}
                ref={isLast ? messageRef : undefined}
                className={classNames('flex gap-4 p-6 w-full rounded-lg', {
                  'bg-bolt-elements-messages-background': isUserMessage || !isStreaming || (isStreaming && !isLast),
                  'bg-gradient-to-b from-bolt-elements-messages-background from-30% to-transparent':
                    isStreaming && isLast,
                  'mt-4': !isFirst,
                })}
              >
                {isUserMessage && (
                  <div className="flex items-center justify-center w-[34px] h-[34px] overflow-hidden bg-white text-gray-600 rounded-full shrink-0 self-start">
                    <div className="i-ph:user-fill text-xl" aria-label="User avatar" />
                  </div>
                )}
                <div className="grid grid-col-1 w-full">
                  {isUserMessage ? <UserMessage content={content} /> : <AssistantMessage content={content} />}
                </div>
                {!isUserMessage && messageId && (
                  <div className="flex gap-2 flex-col lg:flex-row">
                    <WithTooltip tooltip="Revert to this message">
                      <button
                        onClick={() => handleRewind(messageId)}
                        className={classNames(
                          'i-ph:arrow-u-up-left',
                          'text-xl text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors',
                        )}
                        aria-label="Revert to this message"
                        title="Revert to this message"
                      >
                        <span className="sr-only">Revert to this message</span>
                      </button>
                    </WithTooltip>

                    <WithTooltip tooltip="Fork chat from this message">
                      <button
                        onClick={() => handleFork(messageId)}
                        className={classNames(
                          'i-ph:git-fork',
                          'text-xl text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors',
                        )}
                        aria-label="Fork chat from this message"
                        title="Fork chat from this message"
                      >
                        <span className="sr-only">Fork chat from this message</span>
                      </button>
                    </WithTooltip>
                  </div>
                )}
              </div>
            );
          })
        : null}
      {isStreaming && (
        <div 
          className="text-center w-full text-bolt-elements-textSecondary i-svg-spinners:3-dots-fade text-4xl mt-4" 
          aria-label="Loading messages"
        />
      )}
    </div>
  );
});
