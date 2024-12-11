import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import styles from './Markdown.module.scss';

export interface MarkdownProps {
  content: string;
}

export const Markdown = memo(function Markdown({ content }: MarkdownProps) {
  return (
    <div className={styles.Markdown}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : undefined;
            const value = String(children).replace(/\n$/, '');

            return <CodeBlock language={language} value={value} />;
          },
          pre({ children }) {
            return <>{children}</>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
