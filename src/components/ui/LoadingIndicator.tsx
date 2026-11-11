import React from 'react';
import styles from './LoadingIndicator.module.css';

export interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'md',
  label,
  className,
}) => {
  return (
    <div
      className={`${styles.container} ${styles[`size-${size}`]} ${className || ''}`}
      role="status"
      aria-live="polite"
    >
      <div className={styles.spinner} aria-hidden="true" />
      {label && <span className={styles.label}>{label}</span>}
      <span className="sr-only">{label || '불러오는 중입니다...'}</span>
    </div>
  );
};
