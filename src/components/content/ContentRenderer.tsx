import React from 'react';
import type { ContentBlock } from './types';
import type { ContentBlock as DataContentBlock } from '../../types/block';
import { BlockDispatcher } from './BlockDispatcher';
import styles from './ContentRenderer.module.css';

const MAX_RECURSION_DEPTH = 10;

export interface ContentRendererProps {
  blocks?: (DataContentBlock | ContentBlock | any)[];
  className?: string;
  enableInteractiveToggles?: boolean;
  completedTodos?: Record<string, boolean>;
  onBlockAction?: (blockId: string, action: string, payload?: unknown) => void;
  fallbackComponent?: React.ComponentType<{ block: any }>;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({
  blocks,
  className,
  enableInteractiveToggles = true,
  completedTodos,
  onBlockAction,
  fallbackComponent,
}) => {
  if (!blocks || blocks.length === 0) {
    return <div className={`${styles.emptyState} ${className || ''}`.trim()}>No content available.</div>;
  }

  // Recursive renderer function with max depth guard
  const renderChildBlocks = (childBlocks?: ContentBlock[], depth = 0): React.ReactNode => {
    if (!childBlocks || childBlocks.length === 0) return null;
    if (depth > MAX_RECURSION_DEPTH) {
      console.warn(`[ContentRenderer] Maximum nesting depth of ${MAX_RECURSION_DEPTH} exceeded.`);
      return null;
    }

    let numberedListCounter = 0;

    return childBlocks.map((childBlock, idx) => {
      if (!childBlock || !childBlock.id) return null;

      if (childBlock.type === 'numbered_list_item') {
        numberedListCounter += 1;
      } else {
        numberedListCounter = 0;
      }

      return (
        <BlockDispatcher
          key={childBlock.id || idx}
          block={childBlock}
          index={childBlock.type === 'numbered_list_item' ? numberedListCounter : undefined}
          depth={depth}
          enableInteractiveToggles={enableInteractiveToggles}
          completedTodos={completedTodos}
          onBlockAction={onBlockAction}
          fallbackComponent={fallbackComponent}
          renderChildBlocks={renderChildBlocks}
        />
      );
    });
  };

  let numberedCounter = 0;

  return (
    <article className={`${styles.contentContainer} ${className || ''}`.trim()}>
      {blocks.map((block, index) => {
        if (!block || !block.id) return null;

        if (block.type === 'numbered_list_item') {
          numberedCounter += 1;
        } else {
          numberedCounter = 0;
        }

        return (
          <BlockDispatcher
            key={block.id || index}
            block={block}
            index={block.type === 'numbered_list_item' ? numberedCounter : undefined}
            depth={0}
            enableInteractiveToggles={enableInteractiveToggles}
            completedTodos={completedTodos}
            onBlockAction={onBlockAction}
            fallbackComponent={fallbackComponent}
            renderChildBlocks={renderChildBlocks}
          />
        );
      })}
    </article>
  );
};
