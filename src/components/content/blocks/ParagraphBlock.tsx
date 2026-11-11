import React from 'react';
import type { ParagraphBlockData, ContentBlockProps } from '../types';
import { RichText } from '../RichText';
import styles from './Blocks.module.css';

export const ParagraphBlock: React.FC<ContentBlockProps<ParagraphBlockData>> = ({
  block,
  depth = 0,
  renderChildBlocks,
}) => {
  const isEmpty = !block.richText || block.richText.length === 0;

  return (
    <div className={styles.paragraphWrapper}>
      <p className={`${styles.paragraph} ${isEmpty ? styles.empty : ''}`}>
        <RichText richText={block.richText} />
      </p>
      {block.children && block.children.length > 0 && renderChildBlocks && (
        <div className={styles.nestedChildren}>
          {renderChildBlocks(block.children, depth + 1)}
        </div>
      )}
    </div>
  );
};
