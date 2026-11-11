import React, { useState, useEffect, useRef } from 'react';
import { useSearch } from './useSearch';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import type { PageItem } from '../../types/page';
import type { SearchResultItem } from './searchEngine';
import styles from './SearchModal.module.css';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages?: PageItem[];
  onSelectResult: (result: SearchResultItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  pages = [],
  onSelectResult,
}) => {
  const { query, setQuery, results, isSearching, isEmpty } = useSearch(pages);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useKeyboardShortcut('Escape', () => {
    if (isOpen) onClose();
  }, { preventDefault: true, ignoreInInputs: false });

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset index on results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        results.length > 0 ? (prev - 1 + results.length) % results.length : 0
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        onSelectResult(results[selectedIndex]);
        onClose();
      }
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="문서 검색">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inputWrapper}>
          <div className={styles.searchIcon} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="페이지 제목, 내용 검색... (단어 입력)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span className={styles.shortcutBadge}>ESC</span>
        </div>

        {results.length > 0 && (
          <ul className={styles.resultsList} role="listbox">
            {results.map((item, idx) => (
              <li
                key={`${item.pageId}_${item.blockId || 'title'}`}
                className={`${styles.resultItem} ${idx === selectedIndex ? styles.selected : ''}`}
                role="option"
                aria-selected={idx === selectedIndex}
                onClick={() => {
                  onSelectResult(item);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className={styles.itemHeader}>
                  <span className={styles.itemTitle}>{item.pageTitle}</span>
                </div>
                <div className={styles.itemSnippet}>{item.matchedText}</div>
              </li>
            ))}
          </ul>
        )}

        {isEmpty && (
          <div className={styles.emptyState}>
            "{query}"에 대한 검색 결과가 없습니다.
          </div>
        )}

        {query.trim().length === 0 && (
          <div className={styles.emptyState}>
            검색어를 입력하면 전체 페이지 및 본문에서 검색합니다.
          </div>
        )}

        <div className={styles.footer}>
          <span>{isSearching ? '검색 중...' : `${results.length}개의 결과`}</span>
          <div className={styles.footerHints}>
            <span>↑↓ 이동</span>
            <span>↵ 선택</span>
            <span>ESC 닫기</span>
          </div>
        </div>
      </div>
    </div>
  );
};
