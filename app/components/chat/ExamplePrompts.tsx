import type { UIEvent } from 'react';

export interface ExamplePromptsProps {
  sendMessage: (event: UIEvent, messageInput?: string) => Promise<void>;
}

export function ExamplePrompts({ sendMessage }: ExamplePromptsProps) {
  const prompts = [
    {
      title: 'Create Next.js App',
      prompt: 'Create a modern Next.js application with TypeScript and Tailwind CSS',
    },
    {
      title: 'Build React Component',
      prompt: 'Create a reusable React component with TypeScript and styled-components',
    },
    {
      title: 'Setup Svelte Project',
      prompt: 'Initialize a new Svelte project with TypeScript and SCSS',
    },
    {
      title: 'Flutter UI',
      prompt: 'Design a responsive Flutter UI with Material Design 3',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {prompts.map((prompt) => (
        <button
          key={prompt.title}
          onClick={(e) => sendMessage(e, prompt.prompt)}
          className="group relative overflow-hidden rounded-lg border border-zeus-dark-border bg-zeus-dark-surface p-4 transition-all hover:border-zeus-lightning hover:shadow-zeus"
        >
          <div className="relative z-10">
            <h3 className="mb-2 font-semibold text-zeus-dark-text-primary">
              {prompt.title}
            </h3>
            <p className="text-sm text-zeus-dark-text-secondary">
              {prompt.prompt}
            </p>
          </div>
          <div className="absolute inset-0 -z-0 bg-gradient-to-r from-zeus-lightning/0 to-zeus-lightning/10 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      ))}
    </div>
  );
}
