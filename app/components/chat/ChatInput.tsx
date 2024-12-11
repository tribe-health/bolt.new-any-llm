import { useState } from 'react';
import { SendButton } from './SendButton';
import { ImportButtons } from './ImportButtons';
import { SpeechRecognitionButton } from './SpeechRecognitionButton';
import { Paperclip, Wand2, Mic, Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  disabled?: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  textareaRef,
}: ChatInputProps) {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="relative flex flex-col gap-2 p-4 bg-zeus-dark-surface rounded-lg">
      <div className="flex items-center gap-2">
        <button
          className="p-2 text-zeus-dark-text-secondary hover:text-zeus-lightning transition-colors"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <button
          className="p-2 text-zeus-dark-text-secondary hover:text-zeus-lightning transition-colors"
          title="AI Wizard"
        >
          <Wand2 className="w-5 h-5" />
        </button>
        <SpeechRecognitionButton
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          textareaRef={textareaRef}
        >
          <Mic className="w-5 h-5" />
        </SpeechRecognitionButton>
        
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-zeus-dark-text-primary placeholder-zeus-dark-text-secondary"
          disabled={disabled || isRecording}
        />
        
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="p-2 text-zeus-lightning hover:text-zeus-lightning/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <ImportButtons />
      </div>
    </div>
  );
}
