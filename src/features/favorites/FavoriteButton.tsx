import React from 'react';
import { useFavorites } from './useFavorites';
import styles from './FavoriteButton.module.css';

export interface FavoriteButtonProps {
  pageId: string;
  showLabel?: boolean;
  className?: string;
  onToggle?: (isFav: boolean) => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  pageId,
  showLabel = false,
  className = '',
  onToggle,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(pageId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(pageId);
    onToggle?.(!active);
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${active ? styles.active : ''} ${
        !showLabel ? styles.iconOnly : ''
      } ${className}`}
      onClick={handleClick}
      aria-label={active ? '즐겨찾기 해제' : '즐겨찾기에 추가'}
      title={active ? '즐겨찾기 해제' : '즐겨찾기 추가'}
    >
      <span className={styles.starIcon}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </span>
      {showLabel && <span>{active ? '즐겨찾기 됨' : '즐겨찾기'}</span>}
    </button>
  );
};
