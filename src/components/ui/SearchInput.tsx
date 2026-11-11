import React from 'react';
import { Input, InputProps } from './Input';
import styles from './SearchInput.module.css';

export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'type'> {
  onClear?: () => void;
}

const DefaultSearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const DefaultClearIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onClear, onChange, ...props }, ref) => {
    const hasValue = Boolean(value && String(value).length > 0);

    const clearButton = hasValue && onClear ? (
      <button
        type="button"
        onClick={onClear}
        className={styles.clearBtn}
        aria-label="검색어 지우기"
      >
        <DefaultClearIcon />
      </button>
    ) : null;

    return (
      <Input
        ref={ref}
        type="search"
        value={value}
        onChange={onChange}
        leftIcon={<DefaultSearchIcon />}
        rightIcon={clearButton}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
