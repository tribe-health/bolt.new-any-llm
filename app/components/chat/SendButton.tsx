import { IconButton } from '../ui/IconButton';

interface SendButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function SendButton({ onClick, disabled }: SendButtonProps) {
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      className="absolute right-2 bottom-2 text-zeus-light-text-secondary hover:text-zeus-lightning dark:text-zeus-dark-text-secondary"
      title="Send message"
    >
      <div className="i-ph:paper-plane-right-fill text-xl" aria-hidden="true" />
      <span className="sr-only">Send message</span>
    </IconButton>
  );
}
