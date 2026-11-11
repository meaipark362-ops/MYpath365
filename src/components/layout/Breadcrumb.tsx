import React from 'react';
import { Link } from '../../app/router';
import type { BreadcrumbItem } from '../../types/navigation';
import styles from './Breadcrumb.module.css';

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentPageTitle?: string;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  currentPageTitle,
  className = '',
}) => {
  return (
    <nav aria-label="탐색 경로" className={`${styles.breadcrumbs} ${className}`}>
      <span className={styles.item}>
        <Link to="/" className={styles.link}>
          홈
        </Link>
      </span>

      {items.map((item) => (
        <React.Fragment key={item.id}>
          <span className={styles.separator} aria-hidden="true">
            /
          </span>
          <span className={styles.item}>
            <Link to={`/page/${item.slug}`} className={styles.link}>
              {item.title}
            </Link>
          </span>
        </React.Fragment>
      ))}

      {currentPageTitle && (
        <>
          <span className={styles.separator} aria-hidden="true">
            /
          </span>
          <span className={styles.current} aria-current="page">
            {currentPageTitle}
          </span>
        </>
      )}
    </nav>
  );
};
