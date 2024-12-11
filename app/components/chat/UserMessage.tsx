import { memo } from 'react';
import { Markdown } from './Markdown';
import type { MessageContent } from '~/types/message';

interface UserMessageProps {
  content: string | MessageContent[];
}

export const UserMessage = memo(function UserMessage({ content }: UserMessageProps) {
  if (typeof content === 'string') {
    return <Markdown content={content} />;
  }

  if (Array.isArray(content)) {
    return (
      <div className="flex flex-col gap-4">
        {content.map((part, index) => {
          if (part.type === 'text' && part.text) {
            return <Markdown key={index} content={part.text} />;
          }
          if (part.type === 'image' && part.image) {
            return (
              <img
                key={index}
                src={part.image}
                alt="User uploaded image"
                className="max-w-full h-auto rounded-lg"
              />
            );
          }
          return null;
        })}
      </div>
    );
  }

  return null;
});
