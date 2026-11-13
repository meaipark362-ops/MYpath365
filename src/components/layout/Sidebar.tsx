import React, { useState } from 'react';
import { Link, useRouter } from '../../app/router';
import type { NavigationNode } from '../../types/navigation';
import { uiStore } from '../../stores/uiStore';
import { useUserStore } from '../../stores/userStore';
import styles from './Sidebar.module.css';

export interface SidebarProps {
  navigationTree: NavigationNode[];
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

const PREFIX_PATTERN =
  /^(프로젝트\s*\d+\s*:|직업정보\s*:|진학정보\s*:|채용 및 기술동향\s*:|진로 로드맵\s*:|동아리활동\s*:|주제탐구 및 특강\s*:|자격증 및 대회 성과\s*:|독서기록\s*:|모둠활동\s*:|HOME\s*·|PORTFOLIO\s*·|ARCHIVE\s*·)\s*/i;

function formatSidebarTitle(title: string): string {
  const cleaned = title.replace(PREFIX_PATTERN, '').trim();
  return cleaned || title;
}

export const Sidebar: React.FC<SidebarProps> = ({
  navigationTree,
  isOpen = true,
  onClose,
  className = '',
}) => {
  const { path } = useRouter();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PORTFOLIO'>('OVERVIEW');
  const favorites = useUserStore((s) => s.favorites);

  const handleOpenSearch = () => {
    uiStore.getState().openSearchModal();
  };

  const handleItemClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  const allCategories = [
    {
      key: 'HOME',
      code: '00',
      label: 'DASHBOARD',
      items: navigationTree.filter((n) => n.slug === 'home'),
    },
    {
      key: '01. 진로수업',
      code: '01',
      label: '진로수업',
      items: navigationTree.filter(
        (n) => n.slug.includes('class') || n.slug.includes('aptitude') || n.slug === 'career-classes'
      ),
    },
    {
      key: '02. 진로정보',
      code: '02',
      label: '진로정보',
      items: navigationTree.filter(
        (n) =>
          n.slug.includes('job') ||
          n.slug.includes('academic') ||
          n.slug.includes('industry') ||
          n.slug.includes('roadmap') ||
          n.slug === 'career-info'
      ),
    },
    {
      key: '03. 진로활동',
      code: '03',
      label: '진로활동',
      items: navigationTree.filter(
        (n) =>
          n.slug.includes('project') ||
          n.slug.includes('club') ||
          n.slug.includes('lecture') ||
          n.slug.includes('certifications') ||
          n.slug === 'career-activities'
      ),
    },
    {
      key: '04. 독서발자국',
      code: '04',
      label: '독서발자국',
      items: navigationTree.filter(
        (n) => n.slug.includes('book') || n.slug.includes('reading') || n.slug === 'reading-footprint'
      ),
    },
    {
      key: 'PORTFOLIO',
      code: 'PF',
      label: 'PORTFOLIO',
      items: navigationTree.filter((n) => n.slug === 'portfolio'),
    },
    {
      key: 'ARCHIVE',
      code: 'AR',
      label: 'ARCHIVE',
      items: navigationTree.filter((n) => n.slug === 'archive'),
    },
  ];

  const categories =
    activeTab === 'PORTFOLIO'
      ? allCategories.filter((c) => ['PORTFOLIO', '03. 진로활동', 'ARCHIVE'].includes(c.key))
      : allCategories;

  const pinnedNodes = navigationTree.filter(
    (n) => favorites.includes(n.id) || favorites.includes(n.slug)
  );

  return (
    <aside
      className={`${styles.sidebar} ${className}`}
      style={{
        display: isOpen ? 'flex' : 'none',
      }}
      role="navigation"
      aria-label="메인 탐색"
    >
      {/* Top Tabs (HERMES AI: CAREER PATH / PORTFOLIO) */}
      <div className={styles.tabHeader}>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'OVERVIEW' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('OVERVIEW')}
        >
          CAREER PATH
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'PORTFOLIO' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('PORTFOLIO')}
        >
          PORTFOLIO
        </button>
      </div>

      {/* Action Section */}
      <div className={styles.actionSection}>
        <button
          type="button"
          className={styles.newRecordBtn}
          onClick={handleOpenSearch}
          title="빠른 문서 탐색 (Ctrl+K)"
        >
          <div className={styles.newRecordLeft}>
            <span className={styles.plusAccent}>+</span>
            <span>Quick Navigate</span>
          </div>
          <span className={styles.shortcutKbd}>⌘K</span>
        </button>

        <Link
          to="/"
          className={`${styles.quickActionItem} ${path === '/' ? styles.quickActionActive : ''}`}
          onClick={handleItemClick}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span>Overview Console</span>
        </Link>

        <Link
          to="/page/portfolio"
          className={`${styles.quickActionItem} ${path === '/page/portfolio' ? styles.quickActionActive : ''}`}
          onClick={handleItemClick}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span>엔지니어링 포트폴리오</span>
        </Link>

        <Link
          to="/page/archive"
          className={`${styles.quickActionItem} ${path === '/page/archive' ? styles.quickActionActive : ''}`}
          onClick={handleItemClick}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="21 8 21 21 3 21 3 8" />
            <rect x="1" y="3" width="22" height="5" rx="1" />
            <line x1="10" y1="12" x2="14" y2="12" />
          </svg>
          <span>전체 타임라인 아카이브</span>
        </Link>
      </div>

      {/* Search Input Box */}
      <div className={styles.searchBox} onClick={handleOpenSearch} role="button" tabIndex={0}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span>Search career records...</span>
      </div>

      {/* Navigation Scroll Area */}
      <div className={styles.navScrollArea}>
        {/* PINNED Section */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderLeft}>
              <span className={styles.sectionCode}>::</span>
              <span className={styles.sectionName}>PINNED</span>
            </div>
            <span className={styles.sectionCount}>{pinnedNodes.length}</span>
          </div>
          {pinnedNodes.length === 0 ? (
            <div className={styles.sectionHint}>★ 즐겨찾기에 추가한 문서가 고정됩니다</div>
          ) : (
            pinnedNodes.map((node) => {
              const targetHref = `/page/${node.slug}`;
              const isActive = path === targetHref;
              return (
                <Link
                  key={`pin-${node.id}`}
                  to={targetHref}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                  onClick={handleItemClick}
                  title={node.title}
                >
                  <div className={styles.navItemContent}>
                    <span className={isActive ? styles.itemActiveDot : styles.itemDot} />
                    <span className={styles.itemTitle}>{formatSidebarTitle(node.title)}</span>
                  </div>
                  <span className={styles.itemTimestamp}>{node.timestamp || 'Pinned'}</span>
                </Link>
              );
            })
          )}
        </div>

        {/* Categories Sections */}
        {categories.map((cat) => {
          if (cat.items.length === 0) return null;
          return (
            <div key={cat.key} className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderLeft}>
                  <span className={styles.sectionCode}>{cat.code}</span>
                  <span className={styles.sectionName}>{cat.label}</span>
                </div>
              </div>
              {cat.items.map((node) => {
                const targetHref = `/page/${node.slug}`;
                const isActive = path === targetHref;
                const isChild = Boolean(node.parentId);
                return (
                  <Link
                    key={node.id}
                    to={targetHref}
                    className={`${styles.navItem} ${isChild ? styles.navItemChild : styles.navItemRoot} ${
                      isActive ? styles.navItemActive : ''
                    }`}
                    onClick={handleItemClick}
                    title={node.title}
                  >
                    <div className={styles.navItemContent}>
                      <span className={isActive ? styles.itemActiveDot : styles.itemDot} />
                      <span className={styles.itemTitle}>{formatSidebarTitle(node.title)}</span>
                    </div>
                    {node.status === 'IN PROGRESS' ? (
                      <span className={styles.statusBadge}>LIVE</span>
                    ) : (
                      <span className={styles.itemTimestamp}>{node.timestamp || ''}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Bottom Minimalist Dock */}
      <div className={styles.bottomDock}>
        <Link to="/" className={styles.dockIconBtn} title="홈 콘솔">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </Link>
        <button type="button" className={styles.dockIconBtn} onClick={handleOpenSearch} title="검색 (⌘K)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
        <Link to="/favorites" className={styles.dockIconBtn} title="즐겨찾기">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </Link>
        <Link to="/settings" className={styles.dockIconBtn} title="환경설정">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Link>
        <div className={styles.liveIndicator} title="시스템 활성 상태">
          <span className={styles.liveDot} />
          <span>MCU</span>
        </div>
      </div>
    </aside>
  );
};
