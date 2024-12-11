import { memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './CodeBlock.module.scss';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export const CodeBlock = memo(function CodeBlock({ language, value }: CodeBlockProps) {
  return (
    <div className={styles.CodeBlock}>
      <div className={styles.Header}>
        {language && <span className={styles.Language}>{language}</span>}
        <button
          className={styles.CopyButton}
          onClick={() => {
            navigator.clipboard.writeText(value);
          }}
          aria-label="Copy code"
        >
          <div className="i-ph:copy text-lg" aria-hidden="true" />
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'var(--bolt-elements-background-depth-2)',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
});
