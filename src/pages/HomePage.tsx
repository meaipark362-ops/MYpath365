import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Link } from '../app/router';
import { Button, Badge, Card, EmptyState } from '../components/ui';
import { ContentService } from '../services/content/contentService';
import { uiStore } from '../stores/uiStore';
import type { PageRegistryItem } from '../types/page';
import styles from './HomePage.module.css';

const contentService = new ContentService();

export const HomePage: React.FC = () => {
  const [pages, setPages] = useState<PageRegistryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    contentService
      .getAllPages()
      .then((items) => {
        if (isMounted) {
          setPages(items);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenSearch = () => {
    uiStore.getState().openSearchModal();
  };

  return (
    <AppLayout hideToc={true}>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.badgeWrapper}>
            <Badge variant="subtle" size="sm">
              MyPath365 Knowledge Base
            </Badge>
          </div>
          <h1 className={styles.title}>MyPath365</h1>
          <p className={styles.subtitle}>
            체계적이고 구조화된 나만의 지식 저장소와 경로 탐색 가이드입니다. 
            문서 계층을 자유롭게 탐색하고 중요한 페이지를 확인해 보세요.
          </p>

          <div className={styles.actionRow}>
            <Button variant="primary" onClick={handleOpenSearch}>
              문서 검색하기 (⌘K)
            </Button>
            <Link to="/favorites">
              <Button variant="outline">내 즐겨찾기</Button>
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>확인된 페이지 목록</h2>

          {loading ? (
            <div style={{ padding: '24px 0', color: 'var(--text-muted)' }}>
              페이지 목록을 불러오는 중입니다...
            </div>
          ) : pages.length === 0 ? (
            <EmptyState
              title="등록된 페이지가 없습니다"
              description="Notion 마이그레이션 데이터가 아직 제공되지 않았거나 빈 상태입니다."
            />
          ) : (
            <div className={styles.grid}>
              {pages.map((item) => (
                <Link
                  key={item.id}
                  to={`/page/${item.slug}`}
                  className={styles.pageCard}
                >
                  <Card interactive={true} padding="md">
                    <div className={styles.cardHeader}>
                      <span className={styles.cardIcon}>{item.icon || '📄'}</span>
                      <span className={styles.cardTitle}>{item.title}</span>
                    </div>
                    <div className={styles.cardSlug}>/page/{item.slug}</div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className={styles.noticeBox}>
          <strong>안내:</strong> 본 시스템은 원본 Notion의 구조화된 데이터 계약을 완벽히 따르며, 
          확인되지 않은 임의의 가짜 콘텐츠는 생성하지 않습니다.
        </section>
      </div>
    </AppLayout>
  );
};
