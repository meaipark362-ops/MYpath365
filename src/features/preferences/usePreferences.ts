import { useEffect, useCallback } from 'react';
import { useUserStore, userStore } from '../../stores/userStore';
import type { UserPreferences } from '../../types/user';

export function usePreferences() {
  const preferences = useUserStore((state) => state.preferences);

  const updatePreferences = useCallback((partial: Partial<UserPreferences>) => {
    userStore.getState().updatePreferences(partial);
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    userStore.getState().updatePreferences({ theme });
  }, []);

  const setFontSize = useCallback((fontSize: 'normal' | 'large') => {
    userStore.getState().updatePreferences({ fontSize });
  }, []);

  const toggleSidebar = useCallback(() => {
    const current = userStore.getState().preferences.sidebarCollapsed;
    userStore.getState().updatePreferences({ sidebarCollapsed: !current });
  }, []);

  // Synchronize theme to document dataset for AI 1 CSS variables
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const theme = preferences.theme;
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }

    if (preferences.fontSize === 'large') {
      document.documentElement.classList.add('text-large');
    } else {
      document.documentElement.classList.remove('text-large');
    }
  }, [preferences.theme, preferences.fontSize]);

  return {
    preferences,
    updatePreferences,
    setTheme,
    setFontSize,
    toggleSidebar,
  };
}
