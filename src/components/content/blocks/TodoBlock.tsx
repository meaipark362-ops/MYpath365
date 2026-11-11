import React from 'react';
import type { TodoBlockData, ContentBlockProps } from '../types';
import { RichText } from '../RichText';
import styles from './Blocks.module.css';

export const TodoBlock: React.FC<ContentBlockProps<TodoBlockData>> = ({
  block,
  depth = 0,
  completedTodos,
  onBlockAction,
  renderChildBlocks,
}) => {
  // Use state from interaction store (completedTodos) if provided, otherwise block.checked
  const isChecked =
    completedTodos && block.id in completedTodos
      ? completedTodos[block.id]
      : Boolean(block.checked);

  const handleToggle = () => {
    if (onBlockAction) {
      onBlockAction(block.id, 'toggle_todo', { checked: !isChecked });
    }
  };

  return (
    <div className={styles.todoWrapper}>
      <div className={styles.todoItem}>
        <input
          type="checkbox"
          className={styles.todoCheckbox}
          checked={isChecked}
          onChange={handleToggle}
          aria-label="Toggle to-do item"
        />
        <div className={`${styles.todoContent} ${isChecked ? styles.todoCompleted : ''}`}>
          <RichText richText={block.richText} />
        </div>
      </div>
      {block.children && block.children.length > 0 && renderChildBlocks && (
        <div className={styles.nestedChildren}>
          {renderChildBlocks(block.children, depth + 1)}
        </div>
      )}
    </div>
  );
};
