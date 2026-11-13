import React, { useState, useEffect } from 'react';
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

interface SidebarGroup {
  key: string;
  label: string;
  rootSlug: string;
  items: NavigationNode[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  navigationTree,
  isOpen = true,
  onClose,
  className = '',
}) => {
  const { path } = useRouter();
  const favorites = useUserStore((s) => s.favorites);

  const groups: SidebarGroup[] = [
    {
      key: 'HOME',
      label: '홈',
      rootSlug: '',
      items: [],
    },
    {
      key: '01',
      label: '01. 진로수업',
      rootSlug: 'career-classes',
      items: navigationTree.filter(
        (n) => n.parentId === 'cat-career-classes' || n.slug.includes('class') || n.slug.includes('aptitude')
      ).filter((n) => n.slug !== 'career-classes'),
    },
    {
      key: '02',
      label: '02. 진로정보',
      rootSlug: 'career-info',
      items: navigationTree.filter(
        (n) =>
          n.parentId === 'cat-career-info' ||
          n.slug.includes('job') ||
          n.slug.includes('academic') ||
          n.slug.includes('industry') ||
          n.slug.includes('roadmap')
      ).filter((n) => n.slug !== 'career-info'),
    },
    {
      key: '03',
      label: '03. 진로활동',
      rootSlug: 'career-activities',
      items: navigationTree.filter(
        (n) =>
          n.parentId === 'cat-career-activities' ||
          n.slug.includes('project') ||
          n.slug.includes('club') ||
          n.slug.includes('lecture') ||
          n.slug.includes('certifications')
      ).filter((n) => n.slug !== 'career-activities'),
    },
    {
      key: '04',
      label: '04. 독서발자국',
      rootSlug: 'reading-footprint',
      items: navigationTree.filter(
        (n) =>
          n.parentId === 'cat-reading-footprint' ||
          n.slug.includes('book') ||
          n.slug.includes('reading-insights')
      ).filter((n) => n.slug !== 'reading-footprint'),
    },
    {
      key: 'PORTFOLIO',
      label: '포트폴리오',
      rootSlug: 'portfolio',
      items: [],
    },
    {
      key: 'ARCHIVE',
      label: '아카이브',
      rootSlug: 'archive',
      items: [],
    },
  ];

  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  // Auto-expand the active group when route changes
  useEffect(() => {
    const activeGroup = groups.find(
      (g) =>
        (g.rootSlug && path === `/page/${g.rootSlug}`) ||
        g.items.some((item) => path === `/page/${item.slug}`)
    );
    if (activeGroup && activeGroup.items.length > 0) {
      setExpandedKeys((prev) => ({
        ...prev,
        [activeGroup.key]: true,
      }));
    }
  }, [path, navigationTree.length]);

  const handleOpenSearch = () => {
    uiStore.getState().openSearchModal();
  };

  const handleItemClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  const toggleGroup = (key: string) => {
    setExpandedKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
      {/* Clean Brand Header */}
      <div className={styles.brandHeader}>
        <Link to="/" className={styles.brandLink} onClick={handleItemClick}>
          <span className={styles.brandMark} />
          <span className={styles.brandTitle}>MyPath365</span>
          <span className={styles.brandOwner}>장민겸</span>
        </Link>
      </div>

      {/* Search Trigger */}
      <div className={styles.searchSection}>
        <button
          type="button"
          className={styles.searchBtn}
          onClick={handleOpenSearch}
          title="문서 및 활동 검색 (Ctrl+K)"
        >
          <div className={styles.searchLeft}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>검색</span>
          </div>
          <span className={styles.shortcutKbd}>⌘K</span>
        </button>
      </div>

      {/* Collapsible Navigation Scroll Area */}
      <div className={styles.navScrollArea}>
        {/* Pinned Favorites (shown cleanly when user has favorites) */}
        {pinnedNodes.length > 0 && (
          <div className={styles.pinnedSection}>
            <div className={styles.sectionLabel}>즐겨찾기</div>
            <div className={styles.pinnedList}>
              {pinnedNodes.map((node) => {
                const targetHref = `/page/${node.slug}`;
                const isActive = path === targetHref;
                return (
                  <Link
                    key={`pin-${node.id}`}
                    to={targetHref}
                    className={`${styles.childItem} ${isActive ? styles.itemActive : ''}`}
                    onClick={handleItemClick}
                    title={node.title}
                  >
                    <span className={styles.childTitle}>{formatSidebarTitle(node.title)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Primary 7 Categories Accordion */}
        <div className={styles.sectionLabel}>탐색 메뉴</div>
        <div className={styles.groupList}>
          {groups.map((group) => {
            const targetHref = group.rootSlug ? `/page/${group.rootSlug}` : '/';
            const isRootActive = path === targetHref;
            const hasChildren = group.items.length > 0;
            const isChildActive = group.items.some((item) => path === `/page/${item.slug}`);
            const isExpanded = Boolean(expandedKeys[group.key]);

            return (
              <div key={group.key} className={styles.groupBlock}>
                <div
                  className={`${styles.groupRow} ${
                    isRootActive ? styles.groupRowActive : isChildActive ? styles.groupRowParentActive : ''
                  }`}
                >
                  <Link
                    to={targetHref}
                    className={styles.groupLink}
                    onClick={() => {
                      if (hasChildren && !isExpanded) {
                        setExpandedKeys((prev) => ({ ...prev, [group.key]: true }));
                      }
                      handleItemClick();
                    }}
                  >
                    <span className={styles.groupLabel}>{group.label}</span>
                  </Link>

                  {hasChildren && (
                    <button
                      type="button"
                      className={`${styles.expandBtn} ${isExpanded ? styles.expandBtnOpen : ''}`}
                      onClick={() => toggleGroup(group.key)}
                      aria-label={`${group.label} 하위 메뉴 ${isExpanded ? '접기' : '펼치기'}`}
                      aria-expanded={isExpanded}
                    >
                      <span aria-hidden="true">›</span>
                    </button>
                  )}
                </div>

                {hasChildren && isExpanded && (
                  <div className={styles.childrenList}>
                    {group.items.map((node) => {
                      const childHref = `/page/${node.slug}`;
                      const isActive = path === childHref;
                      return (
                        <Link
                          key={node.id}
                          to={childHref}
                          className={`${styles.childItem} ${isActive ? styles.itemActive : ''}`}
                          onClick={handleItemClick}
                          title={node.title}
                        >
                          <span className={styles.childTitle}>{formatSidebarTitle(node.title)}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Minimalist Dock */}
      <div className={styles.bottomDock}>
        <Link to="/" className={styles.dockIconBtn} title="홈" onClick={handleItemClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </Link>
        <button type="button" className={styles.dockIconBtn} onClick={handleOpenSearch} title="검색 (⌘K)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
        <Link to="/favorites" className={styles.dockIconBtn} title="즐겨찾기" onClick={handleItemClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </Link>
        <Link to="/settings" className={styles.dockIconBtn} title="환경설정" onClick={handleItemClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Link>
      </div>
    </aside>
  );
};
