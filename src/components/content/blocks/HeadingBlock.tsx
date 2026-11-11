import React from 'react';
import type { HeadingBlockData, ContentBlockProps } from '../types';
import { RichText } from '../RichText';
import styles from './Blocks.module.css';

export const HeadingBlock: React.FC<ContentBlockProps<HeadingBlockData>> = ({
  block,
  depth = 0,
  renderChildBlocks,
}) => {
  const content = <RichText richText={block.richText} />;

  const renderHeading = () => {
    switch (block.type) {
      case 'heading_1':
        return <h1 className={styles.heading1} id={block.id}>{content}</h1>;
      case 'heading_2':
        return <h2 className={styles.heading2} id={block.id}>{content}</h2>;
      case 'heading_3':
      default:
        return <h3 className={styles.heading3} id={block.id}>{content}</h3>;
    }
  };

  return (
    <div className={styles.headingWrapper}>
      {renderHeading()}
      {block.children && block.children.length > 0 && renderChildBlocks && (
        <div className={styles.nestedChildren}>
          {renderChildBlocks(block.children, depth + 1)}
        </div>
      )}
    </div>
  );
};
