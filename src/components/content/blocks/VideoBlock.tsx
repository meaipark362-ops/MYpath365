import React, { useState } from 'react';
import type { VideoBlockData, ContentBlockProps } from '../types';
import { RichText } from '../RichText';
import { sanitizeUrl } from '../RichText';
import styles from './Blocks.module.css';

export const VideoBlock: React.FC<ContentBlockProps<VideoBlockData>> = ({ block }) => {
  const [hasError, setHasError] = useState(false);
  const safeUrl = sanitizeUrl(block.url);

  if (!safeUrl || hasError) {
    return (
      <div className={styles.mediaContainer}>
        <div className={`${styles.mediaFrame} ${styles.mediaError}`}>
          <p>⚠️ Unable to load video</p>
        </div>
      </div>
    );
  }

  // Check if it is a common video embed (like YouTube or Vimeo)
  const isYouTube = safeUrl.includes('youtube.com') || safeUrl.includes('youtu.be');

  return (
    <figure className={styles.mediaContainer}>
      <div className={styles.mediaFrame} style={{ width: '100%', maxWidth: '720px' }}>
        {isYouTube ? (
          <iframe
            src={safeUrl}
            title="Video player"
            className={styles.video}
            style={{ width: '100%', height: '405px', border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={() => setHasError(true)}
          />
        ) : (
          <video
            src={safeUrl}
            controls
            className={styles.video}
            onError={() => setHasError(true)}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      {block.caption && block.caption.length > 0 && (
        <figcaption className={styles.caption}>
          <RichText richText={block.caption} />
        </figcaption>
      )}
    </figure>
  );
};
