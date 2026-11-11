import React, { useState } from 'react';
import type { UnknownBlockData, ContentBlockProps } from '../types';
import styles from './Blocks.module.css';

export const UnknownBlock: React.FC<ContentBlockProps<UnknownBlockData>> = ({ block }) => {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <div className={styles.unknownBlock}>
      <div className={styles.unknownHeader}>
        <span>
          <strong>[Unsupported Block: {block.rawType || block.type}]</strong> ID: {block.id}
        </span>
        <button
          type="button"
          className={styles.copyButton}
          onClick={() => setShowRaw(!showRaw)}
        >
          {showRaw ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      <div className={styles.unknownNotice}>
        {block.migrationNotice ||
          'This block is preserved from Notion and will be rendered when its renderer is integrated.'}
      </div>

      {showRaw && (
        <pre className={styles.unknownJson}>
          {JSON.stringify(block.rawData || block, null, 2)}
        </pre>
      )}
    </div>
  );
};
