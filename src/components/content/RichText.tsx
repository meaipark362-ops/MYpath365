import React from 'react';
import type { RichTextSpan } from './types';
import styles from './RichText.module.css';

interface RichTextProps {
  richText?: RichTextSpan[];
  className?: string;
}

/**
 * Validates and sanitizes a URL to prevent XSS attacks (e.g. javascript: urls).
 */
export function sanitizeUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  // Disallow javascript:, data:, vbscript: protocols
  if (/^(javascript:|data:|vbscript:)/i.test(trimmed)) {
    return null;
  }
  return trimmed;
}

/**
 * Checks if a URL is an external link.
 */
export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url) || url.startsWith('//');
}

export const RichText: React.FC<RichTextProps> = ({ richText, className }) => {
  if (!richText || richText.length === 0) {
    return null;
  }

  return (
    <span className={`${styles.richText} ${className || ''}`.trim()}>
      {richText.map((span, index) => {
        const { plainText, annotations, href } = span;
        if (!plainText) return null;

        let content: React.ReactNode = plainText;

        if (annotations?.code) {
          content = <code className={styles.code}>{content}</code>;
        }

        const classList: string[] = [];
        if (annotations?.bold) classList.push(styles.bold);
        if (annotations?.italic) classList.push(styles.italic);
        if (annotations?.underline) classList.push(styles.underline);
        if (annotations?.strikethrough) classList.push(styles.strikethrough);

        const customStyle: React.CSSProperties = {};
        if (annotations?.color && annotations.color !== 'default') {
          customStyle.color = annotations.color;
        }

        if (classList.length > 0 || Object.keys(customStyle).length > 0) {
          content = (
            <span
              className={classList.join(' ') || undefined}
              style={Object.keys(customStyle).length > 0 ? customStyle : undefined}
            >
              {content}
            </span>
          );
        }

        const safeHref = sanitizeUrl(href);
        if (safeHref) {
          const isExt = isExternalUrl(safeHref);
          content = (
            <a
              href={safeHref}
              className={styles.link}
              target={isExt ? '_blank' : undefined}
              rel={isExt ? 'noopener noreferrer' : undefined}
            >
              {content}
            </a>
          );
        }

        return <React.Fragment key={index}>{content}</React.Fragment>;
      })}
    </span>
  );
};
