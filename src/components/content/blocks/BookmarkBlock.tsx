import React from 'react';
import type { BookmarkBlockData, ContentBlockProps } from '../types';
import { sanitizeUrl } from '../RichText';
import styles from './Blocks.module.css';

export const BookmarkBlock: React.FC<ContentBlockProps<BookmarkBlockData>> = ({ block }) => {
  const safeUrl = sanitizeUrl(block.url);

  if (!safeUrl) return null;

  return (
    <a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.bookmark}
    >
      <div className={styles.bookmarkInfo}>
        <div className={styles.bookmarkTitle}>{block.title || safeUrl}</div>
        {block.description && (
          <div className={styles.bookmarkDescription}>{block.description}</div>
        )}
        <div className={styles.bookmarkUrl}>
          {block.icon && <span style={{ marginRight: '6px' }}>{block.icon}</span>}
          {safeUrl}
        </div>
      </div>
      {block.coverImage && (
        <div
          className={styles.bookmarkCover}
          style={{ backgroundImage: `url(${sanitizeUrl(block.coverImage)})` }}
        />
      )}
    </a>
  );
};
