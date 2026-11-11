import React, { useState } from 'react';
import type { CodeBlockData, ContentBlockProps } from '../types';
import { RichText } from '../RichText';
import styles from './Blocks.module.css';

export const CodeBlock: React.FC<ContentBlockProps<CodeBlockData>> = ({
  block,
  onBlockAction,
}) => {
  const [copied, setCopied] = useState(false);

  // Extract raw text from richText spans
  const codeText = block.richText
    ? block.richText.map((span) => span.plainText).join('')
    : '';

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(codeText);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onBlockAction) {
        onBlockAction(block.id, 'copy_code', { code: codeText });
      }
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  return (
    <div className={styles.codeWrapper}>
      <div className={styles.codeHeader}>
        <span>{block.language || 'plaintext'}</span>
        <button
          type="button"
          className={styles.copyButton}
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className={styles.codeBlock}>
        <code>{codeText}</code>
      </pre>
      {block.caption && block.caption.length > 0 && (
        <div className={styles.caption}>
          <RichText richText={block.caption} />
        </div>
      )}
    </div>
  );
};
