import { useState, useEffect } from 'react';
import { IconButton } from '../ui/IconButton';

export interface SpeechRecognitionButtonProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export function SpeechRecognitionButton({ textareaRef }: SpeechRecognitionButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          const textarea = textareaRef.current;
          if (textarea) {
            const transcript = Array.from(event.results)
              .map((result: any) => result[0].transcript)
              .join('');
            textarea.value = transcript;
            // Trigger input event to update state
            const inputEvent = new Event('input', { bubbles: true });
            textarea.dispatchEvent(inputEvent);
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        setRecognition(recognition);
      }
    }
  }, [textareaRef]);

  const toggleRecording = () => {
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsRecording(!isRecording);
  };

  if (!recognition) return null;

  return (
    <IconButton
      onClick={toggleRecording}
      className={`transition-colors ${
        isRecording
          ? 'text-zeus-gold hover:text-zeus-gold/80'
          : 'text-zeus-light-text-secondary hover:text-zeus-lightning dark:text-zeus-dark-text-secondary'
      }`}
      title={isRecording ? 'Stop recording' : 'Start recording'}
    >
      {isRecording ? (
        <div className="i-ph:microphone-slash text-xl" aria-hidden="true" />
      ) : (
        <div className="i-ph:microphone text-xl" aria-hidden="true" />
      )}
      <span className="sr-only">{isRecording ? 'Stop recording' : 'Start recording'}</span>
    </IconButton>
  );
}
