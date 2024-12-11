import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Button } from '../ui/button';

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

interface ChatHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (chatId: string) => void;
}

export function ChatHistoryDrawer({ isOpen, onClose, onSelectChat }: ChatHistoryDrawerProps) {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);

  useEffect(() => {
    const loadChatHistory = () => {
      const history = Cookies.get('chatHistory');
      if (history) {
        setChatHistory(JSON.parse(history));
      }
    };

    if (isOpen) {
      loadChatHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-zeus-dark-background border-r border-zeus-dark-border">
      <div className="flex items-center justify-between p-4 border-b border-zeus-dark-border">
        <h2 className="text-lg font-semibold text-zeus-dark-text-primary">Chat History</h2>
        <Button onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>

      <div className="overflow-y-auto h-full pb-20">
        {chatHistory.length === 0 ? (
          <div className="p-4 text-sm text-zeus-dark-text-secondary">No chat history</div>
        ) : (
          chatHistory.map((chat) => (
            <button
              type="button"
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="w-full p-4 text-left border-b border-zeus-dark-border hover:bg-zeus-dark-background-hover"
            >
              <div className="text-sm font-medium text-zeus-dark-text-primary mb-1 truncate">
                {chat.title}
              </div>
              <div className="text-xs text-zeus-dark-text-secondary truncate">
                {chat.lastMessage}
              </div>
              <div className="text-xs text-zeus-dark-text-tertiary mt-1">
                {new Date(chat.timestamp).toLocaleString()}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
