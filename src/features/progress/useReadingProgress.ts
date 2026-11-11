import { useEffect, useRef } from 'react';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { userStore, useUserStore } from '../../stores/userStore';

export interface UseReadingProgressOptions {
  throttleMs?: number;
  minProgressToSave?: number;
  autoSave?: boolean;
}

/**
 * useReadingProgress
 * Tracks scroll progress of current document viewport (0% - 100%).
 * Automatically persists to userStore (and LocalStorage) with debounce/throttle.
 */
export function useReadingProgress(
  pageId?: string | null,
  options: UseReadingProgressOptions = {}
) {
  const { autoSave = true, minProgressToSave = 5 } = options;
  const { progressY } = useScrollPosition();
  const savedProgress = useUserStore((state) =>
    pageId ? state.readingProgress[pageId] || 0 : 0
  );

  const lastSavedRef = useRef<number>(savedProgress);

  useEffect(() => {
    if (!pageId || !autoSave) return;

    // Only update if progress increased or reached threshold, avoiding micro churn
    if (progressY >= minProgressToSave && Math.abs(progressY - lastSavedRef.current) >= 3) {
      lastSavedRef.current = progressY;
      userStore.getState().setReadingProgress(pageId, progressY);
    }
  }, [pageId, progressY, autoSave, minProgressToSave]);

  const markCompleted = () => {
    if (pageId) {
      lastSavedRef.current = 100;
      userStore.getState().markPageCompleted(pageId);
    }
  };

  return {
    currentProgress: progressY,
    savedProgress,
    isCompleted: savedProgress >= 95,
    markCompleted,
  };
}
