import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TableOfContents } from './TableOfContents';
import { SearchModal } from '../../features/search/SearchModal';
import { ProgressBar } from '../../features/progress/ProgressBar';
import { uiStore } from '../../stores/uiStore';
import { useRouter } from '../../app/router';
import { ContentService } from '../../services/content/contentService';
import type { NavigationNode } from '../../types/navigation';
import type { PageItem } from '../../types/page';
import styles from './AppLayout.module.css';

export interface AppLayoutProps {
  children: React.ReactNode;
  currentPage?: PageItem | null;
  navigationTree?: NavigationNode[];
  hideToc?: boolean;
}

const contentService = new ContentService();

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentPage,
  navigationTree: propTree,
  hideToc = false,
}) => {
  const { navigate } = useRouter();
  const [navTree, setNavTree] = useState<NavigationNode[]>(propTree || []);
  const [allPages, setAllPages] = useState<PageItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Sync navigation tree and searchable pages if not passed
  useEffect(() => {
    let isMounted = true;
    contentService.getNavigationTree().then((tree) => {
      if (isMounted) setNavTree(tree);
    });

    contentService.getAllPages().then(async (registryItems) => {
      const fullPages: PageItem[] = [];
      for (const item of registryItems) {
        const page = await contentService.getPageById(item.id);
        if (page) fullPages.push(page);
      }
      if (isMounted) setAllPages(fullPages);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen to UI Store changes
  useEffect(() => {
    const unsub = uiStore.subscribe((state) => {
      setIsSearchOpen(state.isSearchModalOpen);
      setIsSidebarOpen(state.isSidebarOpen);
    });
    return unsub;
  }, []);

  // Handle Cmd+K / Ctrl+K shortcut globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        uiStore.getState().toggleSearchModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenSearch = () => {
    uiStore.getState().openSearchModal();
  };

  const handleCloseSidebar = () => {
    uiStore.getState().setSidebarOpen(false);
  };

  const handleSelectSearchResult = (result: { pageSlug: string }) => {
    uiStore.getState().closeSearchModal();
    navigate(`/page/${result.pageSlug}`);
  };

  return (
    <div className={styles.shell}>
      {/* Mobile Backdrop */}
      <div
        className={`${styles.backdrop} ${isSidebarOpen ? styles.open : ''}`}
        onClick={handleCloseSidebar}
      />

      {/* Redesigned HERMES Style Sidebar */}
      <Sidebar
        navigationTree={navTree}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />

      <div className={styles.mainContainer}>
        {/* Top Header */}
        <Header
          currentPageId={currentPage?.id}
          currentPageTitle={currentPage?.title}
          currentPageIcon={currentPage?.icon}
        />

        {/* Reading Progress Indicator */}
        {currentPage && <ProgressBar pageId={currentPage.id} />}

        {/* Scrollable Main Area */}
        <div className={styles.scrollArea}>
          <main className={styles.contentWrapper} role="main">
            {children}
          </main>

          {/* Table Of Contents */}
          {!hideToc && currentPage && (
            <aside className={styles.asideToc}>
              <TableOfContents blocks={currentPage.blocks} />
            </aside>
          )}
        </div>

        {/* Floating Bottom Command Bar (HERMES AI Signature UI) */}
        <div className={styles.floatingBarContainer}>
          <div className={styles.commandPill} onClick={handleOpenSearch}>
            <div className={styles.commandLeft}>
              <span>+</span>
              <div>빠른 활동 검색 또는 섹션 이동... (Ctrl+K)</div>
            </div>
            <div className={styles.commandRight}>
              <span className={styles.tagDropdown}>RTOS / MCU ▾</span>
              <span className={styles.tagDropdown}>Active ▾</span>
              <button
                type="button"
                className={styles.waveformBtn}
                title="음성/빠른 실행"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenSearch();
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M2 12h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H2v-6zm18 0h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2v-6z" />
                  <path d="M8 8v8m4-12v16m4-10v4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      {isSearchOpen && (
        <SearchModal
          pages={allPages}
          isOpen={isSearchOpen}
          onClose={() => uiStore.getState().closeSearchModal()}
          onSelectResult={handleSelectSearchResult}
        />
      )}
    </div>
  );
};
