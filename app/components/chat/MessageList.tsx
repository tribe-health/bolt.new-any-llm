import type { Message } from '~/types/message';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';

interface MessageListProps {
  messages: Message[];
}

export const MessageList = memo<MessageListProps>(function MessageList({ messages }) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`mb-4 flex ${
            message.role === 'assistant'
              ? 'justify-start'
              : 'justify-end'
          }`}
        >
          <div
            className={`max-w-3xl rounded-lg p-4 ${
              message.role === 'assistant'
                ? 'bg-zeus-dark-background'
                : 'bg-zeus-dark-surface'
            }`}
          >
            <div className="text-sm text-zeus-dark-text-secondary mb-1">
              {message.role === 'assistant' ? 'AI Assistant' : 'You'}
            </div>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
