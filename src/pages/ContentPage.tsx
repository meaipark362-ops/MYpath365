import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { Link } from '../app/router';
import { FavoriteButton } from '../features/favorites/FavoriteButton';
import { ContentRenderer } from '../components/content/ContentRenderer';
import { ContentService } from '../services/content/contentService';
import { userStore } from '../stores/userStore';
import { Button, EmptyState, Skeleton } from '../components/ui';
import type { PageItem, PageRegistryItem } from '../types/page';
import type { BreadcrumbItem } from '../types/navigation';
import styles from './ContentPage.module.css';

const contentService = new ContentService();

export interface ContentPageProps {
  params: Record<string, string>;
}

export const ContentPage: React.FC<ContentPageProps> = ({ params }) => {
  const slug = params.slug;
  const [page, setPage] = useState<PageItem | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [childPages, setChildPages] = useState<PageRegistryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(false);

    contentService
      .getPageBySlug(slug)
      .then(async (foundPage) => {
        if (!isMounted) return;
        if (!foundPage) {
          setError(true);
          setLoading(false);
          return;
        }

        setPage(foundPage);
        setLoading(false);

        // Record page visit in store
        userStore.getState().recordPageVisit(foundPage.id);

        // Fetch breadcrumbs
        const bc = await contentService.getPageBreadcrumbs(foundPage.id);
        if (isMounted) setBreadcrumbs(bc);

        // Fetch child pages
        const children = await contentService.getChildPages(foundPage.id);
        if (isMounted) setChildPages(children);
      })
      .catch(() => {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <AppLayout hideToc={true}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Skeleton width="180px" height="20px" />
          <Skeleton width="60%" height="40px" />
          <Skeleton width="100%" height="160px" />
          <Skeleton width="90%" height="24px" />
          <Skeleton width="80%" height="24px" />
        </div>
      </AppLayout>
    );
  }

  if (error || !page) {
    return (
      <AppLayout hideToc={true}>
        <EmptyState
          title="페이지를 찾을 수 없습니다"
          description={`'${slug}' 경로에 해당하는 문서를 데이터베이스에서 찾을 수 없습니다.`}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
            >
              홈으로 돌아가기
            </Button>
          }
        />
      </AppLayout>
    );
  }

  const isUnconfirmed = page.metadata?.isUnconfirmedMigration;

  return (
    <AppLayout currentPage={page}>
      <div className={styles.container}>
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbs} currentPageTitle={page.title} />

        {/* Cover Image if present */}
        {page.coverImage && (
          <div className={styles.coverImageWrapper}>
            <img
              src={page.coverImage}
              alt={page.title}
              className={styles.coverImage}
              loading="lazy"
            />
          </div>
        )}

        {/* Header Area */}
        <header className={styles.headerSection}>
          <div className={styles.titleRow}>
            <div className={styles.titleArea}>
              {page.icon && <span className={styles.pageIcon}>{page.icon}</span>}
              <h1 className={styles.pageTitle}>{page.title}</h1>
            </div>
            <FavoriteButton pageId={page.id} showLabel={true} />
          </div>

          <div className={styles.metaRow}>
            {page.metadata?.readingTimeMinutes && (
              <span className={styles.metaItem}>
                ⏱ 읽는 시간 약 {page.metadata.readingTimeMinutes}분
              </span>
            )}
            {page.metadata?.updatedAt && (
              <span className={styles.metaItem}>
                최근 수정: {new Date(page.metadata.updatedAt).toLocaleDateString()}
              </span>
            )}
            {page.metadata?.author && (
              <span className={styles.metaItem}>작성자: {page.metadata.author}</span>
            )}
          </div>
        </header>

        {/* Unconfirmed Migration Warning */}
        {isUnconfirmed && (
          <aside className={styles.unconfirmedAlert} role="note">
            <span>⚠️</span>
            <span>
              <strong>알림:</strong> 본 페이지는 Notion 원본 데이터 마이그레이션 예시 구조이며, 실제 원본 파일 투입 시 완전한 내용으로 동기화됩니다.
            </span>
          </aside>
        )}

        {/* Core Content Engine AST Renderer */}
        <div className={styles.contentBody}>
          <ContentRenderer blocks={page.blocks} />
        </div>

        {/* Child Pages Navigation */}
        {childPages.length > 0 && (
          <nav className={styles.relatedSection} aria-label="하위 페이지 목록">
            <h2 className={styles.relatedTitle}>하위 페이지</h2>
            <div className={styles.childPagesGrid}>
              {childPages.map((child) => (
                <Link
                  key={child.id}
                  to={`/page/${child.slug}`}
                  className={styles.childCard}
                >
                  <span>{child.icon || '📄'}</span>
                  <span>{child.title}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </AppLayout>
  );
};
