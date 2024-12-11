import { memo, useState } from 'react';
import { IconButton } from '../ui/IconButton';
import { useStore } from '@nanostores/react';
import { chatStore } from '~/lib/stores/chat';
import { SettingsDialog } from '../settings/SettingsDialog';
import { useNavigate } from '@remix-run/react';

export const HeaderActionButtons = memo(function HeaderActionButtons() {
  const chat = useStore(chatStore);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  const handleClearChat = () => {
    chatStore.setKey('started', false);
    navigate('/', { replace: true });
  };

  const handleExportChat = () => {
    // Export functionality will be handled by the parent component
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <IconButton
          title="Clear chat"
          className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors"
          onClick={handleClearChat}
        >
          <div className="i-ph:trash text-xl" aria-hidden="true" />
          <span className="sr-only">Clear chat</span>
        </IconButton>
        <IconButton
          title="Export chat"
          className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors"
          onClick={handleExportChat}
        >
          <div className="i-ph:export text-xl" aria-hidden="true" />
          <span className="sr-only">Export chat</span>
        </IconButton>
        <IconButton
          title="Settings"
          className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors"
          onClick={() => setShowSettings(true)}
        >
          <div className="i-ph:gear text-xl" aria-hidden="true" />
          <span className="sr-only">Settings</span>
        </IconButton>
      </div>

      <SettingsDialog open={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
});
