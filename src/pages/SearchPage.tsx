import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Link } from '../app/router';
import { SearchInput, EmptyState } from '../components/ui';
import { ContentService } from '../services/content/contentService';
import { searchEngine } from '../features/search/searchEngine';
import type { PageItem } from '../types/page';
import type { SearchResultItem } from '../features/search/searchEngine';
import styles from './SearchPage.module.css';

const contentService = new ContentService();

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [pages, setPages] = useState<PageItem[]>([]);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    contentService.getAllPages().then(async (registryItems) => {
      const fullList: PageItem[] = [];
      for (const item of registryItems) {
        const p = await contentService.getPageById(item.id);
        if (p) fullList.push(p);
      }
      if (isMounted) {
        setPages(fullList);
        searchEngine.indexPages(fullList);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const found = searchEngine.search(query);
    setResults(found);
  }, [query]);

  return (
    <AppLayout hideToc={true}>
      <div className={styles.page}>
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>통합 문서 검색</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            MyPath365의 모든 페이지 제목과 본문 내용을 실시간으로 인덱싱하여 검색합니다.
          </p>
        </div>

        <div className={styles.searchBarWrapper}>
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            placeholder="검색어를 입력하세요 (예: Notion, MyPath365)..."
            autoFocus
          />
        </div>

        <div className={styles.resultsList}>
          {loading ? (
            <div style={{ color: 'var(--text-muted)', padding: '16px 0' }}>
              검색 엔진 인덱싱 중...
            </div>
          ) : query.trim() === '' ? (
            <div style={{ color: 'var(--text-muted)', padding: '24px 0', textAlign: 'center' }}>
              키워드를 입력하면 검색 결과가 표시됩니다.
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              title="검색 결과가 없습니다"
              description={`'${query}' 키워드와 일치하는 문서를 찾을 수 없습니다.`}
            />
          ) : (
            results.map((res) => (
              <Link
                key={res.pageId + (res.blockId || '')}
                to={`/page/${res.pageSlug}`}
                className={styles.resultItem}
              >
                <div className={styles.resultHeader}>
                  <span className={styles.resultTitle}>{res.pageTitle}</span>
                  <span className={styles.resultSlug}>/page/{res.pageSlug}</span>
                </div>
                <div className={styles.resultSnippet}>{res.matchedText}</div>
              </Link>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};
