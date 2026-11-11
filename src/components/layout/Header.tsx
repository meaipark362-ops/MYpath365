import React from 'react';
import { Link } from '../../app/router';
import { uiStore } from '../../stores/uiStore';
import { FavoriteButton } from '../../features/favorites/FavoriteButton';
import styles from './Header.module.css';

export interface HeaderProps {
  currentPageId?: string | null;
  currentPageTitle?: string;
  currentPageIcon?: string | null;
  onToggleSidebar?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentPageId,
  currentPageTitle,
  currentPageIcon,
  onToggleSidebar,
  className = '',
}) => {
  const handleOpenSearch = () => {
    uiStore.getState().openSearchModal();
  };

  const handleToggle = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    } else {
      uiStore.getState().toggleSidebar();
    }
  };

  return (
    <header className={`${styles.header} ${className}`} role="banner">
      <div className={styles.leftSection}>
        <button
          type="button"
          className={styles.toggleButton}
          onClick={handleToggle}
          aria-label="사이드바 토글"
          title="사이드바 열기/닫기"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {currentPageTitle && (
          <div className={styles.titleArea}>
            {currentPageIcon && <span className={styles.pageIcon}>{currentPageIcon}</span>}
            <span className={styles.pageTitle}>{currentPageTitle}</span>
          </div>
        )}
      </div>

      <div className={styles.rightSection}>
        {currentPageId && (
          <FavoriteButton pageId={currentPageId} />
        )}

        <button
          type="button"
          className={styles.searchTrigger}
          onClick={handleOpenSearch}
          aria-label="검색창 열기"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>검색</span>
          <kbd className={styles.shortcutKbd}>⌘K</kbd>
        </button>

        <Link to="/favorites" className={styles.navLink} title="즐겨찾기 목록" aria-label="즐겨찾기">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </Link>

        <Link to="/settings" className={styles.navLink} title="환경설정" aria-label="환경설정">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Link>
      </div>
    </header>
  );
};
