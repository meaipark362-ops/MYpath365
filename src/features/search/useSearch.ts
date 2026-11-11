import { useState, useEffect, useMemo, useCallback } from 'react';
import { searchEngine, type SearchResultItem } from './searchEngine';
import type { PageItem } from '../../types/page';

export function useSearch(pages?: PageItem[], initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Index pages whenever page list changes
  useEffect(() => {
    if (pages && pages.length > 0) {
      searchEngine.indexPages(pages);
    }
  }, [pages]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    // Debounce search slightly for ultra-smooth UI
    const timer = setTimeout(() => {
      const searchRes = searchEngine.search(trimmed, 20);
      setResults(searchRes);
      setIsSearching(false);
    }, 80);

    return () => clearTimeout(timer);
  }, [query]);

  const clearQuery = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return {
    query,
    setQuery,
    clearQuery,
    results,
    isSearching,
    hasResults: results.length > 0,
    isEmpty: query.trim().length > 0 && results.length === 0 && !isSearching,
  };
}
