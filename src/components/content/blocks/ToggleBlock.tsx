import React, { useState } from 'react';
import type { ToggleBlockData, ContentBlockProps } from '../types';
import { RichText } from '../RichText';
import styles from './Blocks.module.css';

export const ToggleBlock: React.FC<ContentBlockProps<ToggleBlockData>> = ({
  block,
  depth = 0,
  enableInteractiveToggles = true,
  onBlockAction,
  renderChildBlocks,
}) => {
  const [isOpen, setIsOpen] = useState(Boolean(block.defaultOpen));

  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    if (!enableInteractiveToggles) {
      e.preventDefault();
      return;
    }
    const target = e.currentTarget;
    setIsOpen(target.open);
    if (onBlockAction) {
      onBlockAction(block.id, 'toggle_expand', { isOpen: target.open });
    }
  };

  return (
    <details
      className={styles.toggleDetails}
      open={isOpen}
      onToggle={handleToggle}
    >
      <summary className={styles.toggleSummary}>
        <span className={styles.toggleIcon} aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M4.5 2.5L8 6L4.5 9.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <RichText richText={block.richText} />
      </summary>
      <div className={styles.toggleBody}>
        {block.children && block.children.length > 0 && renderChildBlocks ? (
          renderChildBlocks(block.children, depth + 1)
        ) : null}
      </div>
    </details>
  );
};
