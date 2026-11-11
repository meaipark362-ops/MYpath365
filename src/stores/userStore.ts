import { useSyncExternalStore } from 'react';
import { userStateManager, type UserStateManager } from './userStateManager';
import type { UserPreferences, UserDataModel } from '../types/user';

export interface UserStoreState extends UserDataModel {
  recentVisits: Array<{ pageId: string; visitedAt: string }>;
  toggleFavorite: (pageId: string) => void;
  addFavorite: (pageId: string) => void;
  removeFavorite: (pageId: string) => void;
  isFavorite: (pageId: string) => boolean;
  getFavoritePageIds: () => string[];

  setReadingProgress: (pageId: string, progress: number) => void;
  getReadingProgress: (pageId: string) => number;
  markPageCompleted: (pageId: string) => void;

  setTodoCompleted: (todoId: string, completed: boolean) => void;
  toggleTodo: (todoId: string) => void;
  isTodoCompleted: (todoId: string, initialChecked?: boolean) => boolean;

  recordPageVisit: (pageId: string) => void;
  updatePreferences: (partial: Partial<UserPreferences>) => void;
  resetUserData: () => void;
}

export const userStore = {
  getState: (): UserStoreState => {
    const raw = userStateManager.getState();
    return {
      ...raw,
      toggleFavorite: (pageId: string) => userStateManager.toggleFavorite(pageId),
      addFavorite: (pageId: string) => userStateManager.addFavorite(pageId),
      removeFavorite: (pageId: string) => userStateManager.removeFavorite(pageId),
      isFavorite: (pageId: string) => userStateManager.isFavorite(pageId),
      getFavoritePageIds: () => userStateManager.getState().favorites,

      setReadingProgress: (pageId: string, progress: number) =>
        userStateManager.setReadingProgress(pageId, progress),
      getReadingProgress: (pageId: string) => userStateManager.getReadingProgress(pageId),
      markPageCompleted: (pageId: string) => userStateManager.markPageCompleted(pageId),

      setTodoCompleted: (todoId: string, completed: boolean) =>
        userStateManager.setTodoCompleted(todoId, completed),
      toggleTodo: (todoId: string) => userStateManager.toggleTodo(todoId),
      isTodoCompleted: (todoId: string, initialChecked?: boolean) =>
        userStateManager.isTodoCompleted(todoId, initialChecked),

      recordPageVisit: (pageId: string) => userStateManager.recordPageVisit(pageId),
      updatePreferences: (partial: Partial<UserPreferences>) =>
        userStateManager.updatePreferences(partial),
      resetUserData: () => userStateManager.reset(),
    };
  },
  subscribe: (listener: () => void) => userStateManager.subscribe(listener),
};

export function useUserStore<T>(selector: (state: UserStoreState) => T): T {
  return useSyncExternalStore(
    userStore.subscribe,
    () => selector(userStore.getState()),
    () => selector(userStore.getState())
  );
}
