import { memo } from 'react';
import { IconButton } from '~/components/ui/IconButton';

interface ExportChatButtonProps {
  exportChat: () => void;
}

export const ExportChatButton = memo(function ExportChatButton({ exportChat }: ExportChatButtonProps) {
  return (
    <IconButton
      title="Export chat"
      className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors"
      onClick={exportChat}
    >
      <div className="i-ph:export text-xl" aria-hidden="true" />
      <span className="sr-only">Export chat</span>
    </IconButton>
  );
});
