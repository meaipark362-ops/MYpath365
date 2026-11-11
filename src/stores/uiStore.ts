import { useSyncExternalStore } from 'react';
import { createStore } from './createStore';

export interface UIStoreState {
  isSearchModalOpen: boolean;
  searchQuery: string;
  isSidebarOpen: boolean;
  activeToast: { id: string; message: string; type?: 'info' | 'success' | 'warning' } | null;

  openSearchModal: (initialQuery?: string) => void;
  closeSearchModal: () => void;
  toggleSearchModal: () => void;
  setSearchQuery: (query: string) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  showToast: (message: string, type?: 'info' | 'success' | 'warning', durationMs?: number) => void;
  clearToast: () => void;
}

export const uiStore = createStore<UIStoreState>({
  isSearchModalOpen: false,
  searchQuery: '',
  isSidebarOpen: true,
  activeToast: null,

  openSearchModal: (initialQuery = '') => {
    uiStore.setState({ isSearchModalOpen: true, searchQuery: initialQuery });
  },

  closeSearchModal: () => {
    uiStore.setState({ isSearchModalOpen: false });
  },

  toggleSearchModal: () => {
    uiStore.setState((s) => ({ isSearchModalOpen: !s.isSearchModalOpen }));
  },

  setSearchQuery: (query: string) => {
    uiStore.setState({ searchQuery: query });
  },

  setSidebarOpen: (isOpen: boolean) => {
    uiStore.setState({ isSidebarOpen: isOpen });
  },

  toggleSidebar: () => {
    uiStore.setState((s) => ({ isSidebarOpen: !s.isSidebarOpen }));
  },

  showToast: (message: string, type = 'info', durationMs = 2500) => {
    const id = Math.random().toString(36).substring(2, 9);
    uiStore.setState({ activeToast: { id, message, type } });

    setTimeout(() => {
      const current = uiStore.getState().activeToast;
      if (current && current.id === id) {
        uiStore.setState({ activeToast: null });
      }
    }, durationMs);
  },

  clearToast: () => {
    uiStore.setState({ activeToast: null });
  },
});

export function useUIStore<T>(selector: (state: UIStoreState) => T): T {
  return useSyncExternalStore(
    uiStore.subscribe,
    () => selector(uiStore.getState()),
    () => selector(uiStore.getState())
  );
}
