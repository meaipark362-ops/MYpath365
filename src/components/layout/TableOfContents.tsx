import React from 'react';
import type { ContentBlock } from '../../types/block';
import styles from './TableOfContents.module.css';

export interface TocItem {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

export interface TableOfContentsProps {
  blocks?: ContentBlock[];
  items?: TocItem[];
  className?: string;
}

function extractHeadingsFromBlocks(blocks: ContentBlock[]): TocItem[] {
  const headings: TocItem[] = [];

  const traverse = (items: ContentBlock[]) => {
    for (const b of items) {
      if (b.type === 'heading_1' || b.type === 'heading_2' || b.type === 'heading_3') {
        const hBlock = b as any;
        const text = hBlock.richText?.map((s: any) => s.plainText).join('') || '제목 없는 섹션';
        const level = b.type === 'heading_1' ? 1 : b.type === 'heading_2' ? 2 : 3;
        headings.push({
          id: b.id,
          text,
          level,
        });
      }
      if (b.children && b.children.length > 0) {
        traverse(b.children);
      }
    }
  };

  traverse(blocks);
  return headings;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  blocks,
  items: directItems,
  className = '',
}) => {
  const tocList: TocItem[] = directItems || (blocks ? extractHeadingsFromBlocks(blocks) : []);

  if (tocList.length === 0) {
    return null;
  }

  const handleScrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // update hash
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <nav aria-label="목차" className={`${styles.toc} ${className}`}>
      <div className={styles.title}>목차</div>
      <ul className={styles.list}>
        {tocList.map((item) => {
          const depthClass =
            item.level === 1
              ? styles.depth1
              : item.level === 2
              ? styles.depth2
              : styles.depth3;

          return (
            <li key={item.id} className={`${styles.item} ${depthClass}`}>
              <a
                href={`#${item.id}`}
                className={styles.link}
                onClick={(e) => handleScrollTo(e, item.id)}
                title={item.text}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
