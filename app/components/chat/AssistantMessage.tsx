import { memo } from 'react';
import { Markdown } from './Markdown';
import type { MessageContent } from '~/types/message';

interface AssistantMessageProps {
  content: string | MessageContent[];
}

export const AssistantMessage = memo(function AssistantMessage({ content }: AssistantMessageProps) {
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
                alt="Assistant generated image"
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
