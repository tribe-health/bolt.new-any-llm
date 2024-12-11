import { IconButton } from '../ui/IconButton';

export interface SendButtonProps {
  disabled: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  isStreaming: boolean;
  onStop: () => void;
}

export function SendButton({ disabled, onClick, isStreaming, onStop }: SendButtonProps) {
  return (
    <IconButton
      disabled={disabled}
      onClick={isStreaming ? onStop : onClick}
      className={`transition-colors ${
        disabled
          ? 'text-zeus-dark-text-secondary opacity-50'
          : isStreaming
          ? 'text-zeus-gold hover:text-zeus-gold/80'
          : 'text-zeus-lightning hover:text-zeus-lightning/80'
      }`}
      title={isStreaming ? 'Stop generating' : 'Send message'}
    >
      {isStreaming ? (
        <div className="i-ph:stop-circle text-xl" aria-hidden="true" />
      ) : (
        <div className="i-ph:paper-plane-right text-xl" aria-hidden="true" />
      )}
      <span className="sr-only">{isStreaming ? 'Stop generating' : 'Send message'}</span>
    </IconButton>
  );
}
