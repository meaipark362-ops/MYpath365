import React, { useState } from 'react';
import type { ImageBlockData, ContentBlockProps } from '../types';
import { RichText } from '../RichText';
import { sanitizeUrl } from '../RichText';
import styles from './Blocks.module.css';

export const ImageBlock: React.FC<ContentBlockProps<ImageBlockData>> = ({ block }) => {
  const [hasError, setHasError] = useState(false);
  const safeUrl = sanitizeUrl(block.url);

  if (!safeUrl || hasError) {
    return (
      <div className={styles.mediaContainer}>
        <div className={`${styles.mediaFrame} ${styles.mediaError}`}>
          <p>⚠️ Unable to load image</p>
          {block.caption && (
            <div className={styles.caption}>
              <RichText richText={block.caption} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <figure className={styles.mediaContainer}>
      <div className={styles.mediaFrame} style={{ aspectRatio: block.aspectRatio }}>
        <img
          src={safeUrl}
          alt={block.alt || 'Content image'}
          className={styles.image}
          loading="lazy"
          onError={() => setHasError(true)}
        />
      </div>
      {block.caption && block.caption.length > 0 && (
        <figcaption className={styles.caption}>
          <RichText richText={block.caption} />
        </figcaption>
      )}
    </figure>
  );
};
