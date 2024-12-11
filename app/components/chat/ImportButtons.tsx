import { useRef, useState } from 'react';
import { IconButton } from '../ui/IconButton';
import type { Message } from '~/types/message';

export interface ImportButtonsProps {
  importChat: (description: string, messages: Message[]) => Promise<void>;
  exportChat: () => void;
  uploadedFiles: File[];
  setUploadedFiles: (files: File[]) => void;
  imageDataList: string[];
  setImageDataList: (data: string[]) => void;
}

export function ImportButtons({
  importChat,
  exportChat,
  uploadedFiles,
  setUploadedFiles,
  imageDataList,
  setImageDataList,
}: ImportButtonsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [showGitInput, setShowGitInput] = useState(false);
  const [gitUrl, setGitUrl] = useState('');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setUploadedFiles([...uploadedFiles, ...newFiles]);

    const newImageDataList = await Promise.all(
      newFiles.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setImageDataList([...imageDataList, ...newImageDataList]);
  };

  const handleImportChat = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importChat(data.description || 'Imported Chat', data.messages);
    } catch (error) {
      console.error('Failed to import chat:', error);
    }
  };

  const handleFolderImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleGitClone = async () => {
    if (!gitUrl) return;

    try {
      // Here you would implement the git clone functionality
      console.log('Cloning repository:', gitUrl);
      setShowGitInput(false);
      setGitUrl('');
    } catch (error) {
      console.error('Failed to clone repository:', error);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload images"
        title="Upload images"
      />

      <IconButton
        onClick={() => fileInputRef.current?.click()}
        className="text-zeus-light-text-secondary hover:text-zeus-lightning dark:text-zeus-dark-text-secondary"
        title="Upload images"
      >
        <div className="i-ph:image text-xl" aria-hidden="true" />
        <span className="sr-only">Upload images</span>
      </IconButton>

      <input
        ref={chatInputRef}
        type="file"
        accept=".json"
        onChange={handleImportChat}
        className="hidden"
        aria-label="Import chat"
        title="Import chat"
      />

      <IconButton
        onClick={() => chatInputRef.current?.click()}
        className="text-zeus-light-text-secondary hover:text-zeus-lightning dark:text-zeus-dark-text-secondary"
        title="Import chat"
      >
        <div className="i-ph:upload-simple text-xl" aria-hidden="true" />
        <span className="sr-only">Import chat</span>
      </IconButton>

      <input
        ref={folderInputRef}
        type="file"
        multiple
        onChange={handleFolderImport}
        className="hidden"
        aria-label="Import folder"
        title="Import folder"
      />

      <IconButton
        onClick={() => folderInputRef.current?.click()}
        className="text-zeus-light-text-secondary hover:text-zeus-lightning dark:text-zeus-dark-text-secondary"
        title="Import folder"
      >
        <div className="i-ph:folder-open text-xl" aria-hidden="true" />
        <span className="sr-only">Import folder</span>
      </IconButton>

      <IconButton
        onClick={() => setShowGitInput(true)}
        className="text-zeus-light-text-secondary hover:text-zeus-lightning dark:text-zeus-dark-text-secondary"
        title="Clone Git repository"
      >
        <div className="i-ph:git-branch text-xl" aria-hidden="true" />
        <span className="sr-only">Clone Git repository</span>
      </IconButton>

      <IconButton
        onClick={exportChat}
        className="text-zeus-light-text-secondary hover:text-zeus-lightning dark:text-zeus-dark-text-secondary"
        title="Export chat"
      >
        <div className="i-ph:download-simple text-xl" aria-hidden="true" />
        <span className="sr-only">Export chat</span>
      </IconButton>

      {showGitInput && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-zeus-dark-background border border-zeus-dark-border rounded-lg shadow-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={gitUrl}
              onChange={(e) => setGitUrl(e.target.value)}
              placeholder="Enter Git repository URL"
              className="flex-1 rounded-lg border border-zeus-dark-border bg-zeus-dark-background px-3 py-1 text-sm text-zeus-dark-text-primary focus:outline-none focus:ring-2 focus:ring-zeus-lightning"
            />
            <button
              onClick={handleGitClone}
              className="rounded-lg border border-zeus-dark-border bg-zeus-dark-background px-3 py-1 text-sm text-zeus-dark-text-primary hover:bg-zeus-dark-background-hover"
            >
              Clone
            </button>
            <button
              onClick={() => setShowGitInput(false)}
              className="rounded-lg border border-zeus-dark-border bg-zeus-dark-background px-3 py-1 text-sm text-zeus-dark-text-primary hover:bg-zeus-dark-background-hover"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
