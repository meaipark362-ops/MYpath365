import React from 'react';
import type { QuoteBlockData, ContentBlockProps } from '../types';
import { RichText } from '../RichText';
import styles from './Blocks.module.css';

export const QuoteBlock: React.FC<ContentBlockProps<QuoteBlockData>> = ({
  block,
  depth = 0,
  renderChildBlocks,
}) => {
  return (
    <blockquote className={styles.quote}>
      <RichText richText={block.richText} />
      {block.children && block.children.length > 0 && renderChildBlocks && (
        <div className={styles.nestedChildren}>
          {renderChildBlocks(block.children, depth + 1)}
        </div>
      )}
    </blockquote>
  );
};
