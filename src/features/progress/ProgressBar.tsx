import React from 'react';
import { useReadingProgress } from './useReadingProgress';
import styles from './ProgressBar.module.css';

export interface ProgressBarProps {
  pageId?: string | null;
  className?: string;
  subtle?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  pageId,
  className = '',
  subtle = false,
}) => {
  const { currentProgress } = useReadingProgress(pageId);

  return (
    <div
      className={`${styles.container} ${className}`}
      role="progressbar"
      aria-valuenow={currentProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="읽기 진행률"
    >
      <div
        className={`${styles.fill} ${subtle ? styles.subtle : ''}`}
        style={{ width: `${currentProgress}%` }}
      />
    </div>
  );
};
