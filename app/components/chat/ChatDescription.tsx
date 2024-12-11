import { memo } from 'react';

interface ChatDescriptionProps {
  description?: string;
}

export const ChatDescription = memo(function ChatDescription({ description }: ChatDescriptionProps) {
  if (!description) return null;

  return (
    <div className="text-center text-bolt-elements-textSecondary text-sm mt-2">
      {description}
    </div>
  );
});
