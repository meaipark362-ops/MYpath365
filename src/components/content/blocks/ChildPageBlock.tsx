import React from 'react';
import type { ChildPageBlockData, ContentBlockProps } from '../types';
import styles from './Blocks.module.css';

export const ChildPageBlock: React.FC<ContentBlockProps<ChildPageBlockData>> = ({
  block,
  onBlockAction,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onBlockAction) {
      e.preventDefault();
      onBlockAction(block.id, 'navigate_child_page', {
        pageId: block.pageId,
        title: block.title,
      });
    }
  };

  const href = block.pageId ? `/page/${block.pageId}` : '#';

  return (
    <a href={href} className={styles.childPage} onClick={handleClick}>
      <span>{block.title}</span>
      <span className={styles.childPageChevron} aria-hidden="true">›</span>
    </a>
  );
};
