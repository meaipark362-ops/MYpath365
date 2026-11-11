import React from 'react';
import type { CalloutBlockData, ContentBlockProps } from '../types';
import { RichText } from '../RichText';
import styles from './Blocks.module.css';

export const CalloutBlock: React.FC<ContentBlockProps<CalloutBlockData>> = ({
  block,
  depth = 0,
  renderChildBlocks,
}) => {
  return (
    <div className={styles.callout}>
      {block.icon && <div className={styles.calloutIcon}>{block.icon}</div>}
      <div className={styles.calloutBody}>
        <RichText richText={block.richText} />
        {block.children && block.children.length > 0 && renderChildBlocks && (
          <div className={styles.nestedChildren}>
            {renderChildBlocks(block.children, depth + 1)}
          </div>
        )}
      </div>
    </div>
  );
};
