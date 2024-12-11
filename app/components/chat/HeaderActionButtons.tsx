import { memo } from 'react';
import { IconButton } from '../ui/IconButton';

export const HeaderActionButtons = memo(() => {
  return (
    <div className="flex items-center gap-2">
      <IconButton 
        title="Clear chat" 
        className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors"
      >
        <div className="i-ph:trash text-xl" aria-hidden="true" />
        <span className="sr-only">Clear chat</span>
      </IconButton>
      <IconButton 
        title="Export chat" 
        className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors"
      >
        <div className="i-ph:export text-xl" aria-hidden="true" />
        <span className="sr-only">Export chat</span>
      </IconButton>
      <IconButton 
        title="Settings" 
        className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors"
      >
        <div className="i-ph:gear text-xl" aria-hidden="true" />
        <span className="sr-only">Settings</span>
      </IconButton>
    </div>
  );
});

HeaderActionButtons.displayName = 'HeaderActionButtons';
