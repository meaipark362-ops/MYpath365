import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Link } from '../app/router';
import { Card, EmptyState, Button } from '../components/ui';
import { ContentService } from '../services/content/contentService';
import { userStore } from '../stores/userStore';
import type { PageItem } from '../types/page';

const contentService = new ContentService();

export const FavoritesPage: React.FC = () => {
  const [favoritePages, setFavoritePages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadFavorites = async () => {
    setLoading(true);
    const favIds = userStore.getState().favorites;
    const pages: PageItem[] = [];
    for (const id of favIds) {
      const p = await contentService.getPageById(id);
      if (p) pages.push(p);
    }
    setFavoritePages(pages);
    setLoading(false);
  };

  useEffect(() => {
    loadFavorites();
    const unsub = userStore.subscribe(() => {
      loadFavorites();
    });
    return unsub;
  }, []);

  return (
    <AppLayout hideToc={true}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            즐겨찾기 목록
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            북마크하여 보관해 둔 중요 페이지 모음입니다.
          </p>
        </div>

        {loading ? (
          <div style={{ color: 'var(--text-muted)', padding: '16px 0' }}>불러오는 중...</div>
        ) : favoritePages.length === 0 ? (
          <EmptyState
            title="즐겨찾기한 페이지가 없습니다"
            description="문서 상단이나 헤더의 별표(★) 아이콘을 눌러 중요한 문서를 북마크해 보세요."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.history.pushState({}, '', '/');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
              >
                문서 둘러보기
              </Button>
            }
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {favoritePages.map((page) => (
              <Link
                key={page.id}
                to={`/page/${page.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <Card interactive={true} padding="md">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '20px' }}>{page.icon || '📄'}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{page.title}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    /page/{page.slug}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};
