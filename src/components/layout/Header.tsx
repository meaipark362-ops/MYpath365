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

  const displayTitle = currentPageTitle
    ? currentPageTitle.toUpperCase()
    : 'DASHBOARD · EMBEDDED & AI SYSTEMS';

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
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className={styles.activeTabPill}>
          <span className={styles.redDot} />
          <span>{currentPageIcon ? `${currentPageIcon} ` : ''}{displayTitle}</span>
          <span className={styles.plusTag}>+</span>
        </div>
      </div>

      <div className={styles.rightSection}>
        <button
          type="button"
          className={styles.searchHintBtn}
          onClick={handleOpenSearch}
          title="검색 (Ctrl+K)"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>Search...</span>
          <span className={styles.kbdBadge}>⌘K</span>
        </button>

        {currentPageId && (
          <FavoriteButton pageId={currentPageId} />
        )}

        <Link to="/settings" className={styles.iconBtn} title="설정">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Link>
      </div>
    </header>
  );
};
