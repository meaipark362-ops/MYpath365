import React from 'react';
import type {
  BulletedListItemBlockData,
  NumberedListItemBlockData,
  ContentBlockProps,
} from '../types';
import { RichText } from '../RichText';
import styles from './Blocks.module.css';

export const ListBlock: React.FC<
  ContentBlockProps<BulletedListItemBlockData | NumberedListItemBlockData> & {
    index?: number;
  }
> = ({ block, index = 1, depth = 0, renderChildBlocks }) => {
  const isNumbered = block.type === 'numbered_list_item';

  return (
    <div className={styles.listItemWrapper}>
      <div className={styles.listItem}>
        {isNumbered ? (
          <span className={styles.numberMarker}>{index}.</span>
        ) : (
          <span className={styles.bulletMarker} />
        )}
        <RichText richText={block.richText} />
      </div>
      {block.children && block.children.length > 0 && renderChildBlocks && (
        <div className={styles.nestedChildren}>
          {renderChildBlocks(block.children, depth + 1)}
        </div>
      )}
    </div>
  );
};
