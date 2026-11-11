import React, { useState } from 'react';
import { Link, useRouter } from '../../app/router';
import type { NavigationNode } from '../../types/navigation';
import { uiStore } from '../../stores/uiStore';
import styles from './Sidebar.module.css';

export interface SidebarProps {
  navigationTree: NavigationNode[];
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

interface TreeNodeProps {
  node: NavigationNode;
  currentPath: string;
  onNavigate?: () => void;
}

const NavTreeNode: React.FC<TreeNodeProps> = ({ node, currentPath, onNavigate }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const targetHref = `/page/${node.slug}`;
  const isActive = currentPath === targetHref;
  const hasChildren = node.children && node.children.length > 0;

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  return (
    <div>
      <Link
        to={targetHref}
        className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        onClick={onNavigate}
      >
        <div className={styles.navItemContent}>
          <span className={styles.navItemIcon}>{node.icon || '📄'}</span>
          <span className={styles.navItemTitle}>{node.title}</span>
        </div>
        {hasChildren && (
          <button
            type="button"
            className={styles.expandButton}
            onClick={handleToggleExpand}
            aria-label={isExpanded ? '접기' : '펼치기'}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 150ms ease',
              }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </Link>

      {hasChildren && isExpanded && (
        <div className={styles.childrenTree}>
          {node.children.map((child) => (
            <NavTreeNode
              key={child.id}
              node={child}
              currentPath={currentPath}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  navigationTree,
  isOpen = true,
  onClose,
  className = '',
}) => {
  const { path } = useRouter();

  const handleOpenSearch = () => {
    uiStore.getState().openSearchModal();
  };

  const handleItemClick = () => {
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.mobileOpen : ''} ${className}`}
      aria-label="메인 사이드바"
    >
      <div className={styles.topBrand}>
        <Link to="/" className={styles.brandLink} onClick={handleItemClick}>
          <span className={styles.brandLogo}>M</span>
          <span>MyPath365</span>
        </Link>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="사이드바 닫기"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className={styles.searchBarWrapper}>
        <button
          type="button"
          className={styles.searchButton}
          onClick={handleOpenSearch}
          aria-label="빠른 검색"
        >
          <div className={styles.searchLeft}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>빠른 검색...</span>
          </div>
          <kbd style={{ fontSize: '10px' }}>⌘K</kbd>
        </button>
      </div>

      <nav className={styles.navSection}>
        <div className={styles.sectionHeader}>문서 계층</div>
        {navigationTree.length === 0 ? (
          <div style={{ padding: '8px 12px', fontSize: '13px', color: 'var(--text-muted)' }}>
            등록된 페이지가 없습니다.
          </div>
        ) : (
          navigationTree.map((node) => (
            <NavTreeNode
              key={node.id}
              node={node}
              currentPath={path}
              onNavigate={handleItemClick}
            />
          ))
        )}
      </nav>

      <div className={styles.bottomSection}>
        <Link to="/favorites" className={styles.quickLink} onClick={handleItemClick}>
          <span>★</span>
          <span>즐겨찾기</span>
        </Link>
        <Link to="/settings" className={styles.quickLink} onClick={handleItemClick}>
          <span>⚙</span>
          <span>설정</span>
        </Link>
      </div>
    </aside>
  );
};
