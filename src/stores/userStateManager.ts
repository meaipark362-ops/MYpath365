/**
 * Core User Interaction Logic (Pure TS, UI-independent)
 * Handles favorites, reading progress, to-do states, and preferences
 * Backed by SafeStorage
 */

import { safeLocalStorage } from './safeStorage';
import type { UserPreferences, UserDataModel } from '../types/user';

export const USER_STATE_KEY = 'user_interaction_state';

export const defaultUserPreferences: UserPreferences = {
  theme: 'system',
  fontSize: 'normal',
  sidebarCollapsed: false,
};

export const defaultUserState: UserDataModel & { recentVisits: Array<{ pageId: string; visitedAt: string }> } = {
  favorites: [],
  completedTodos: {},
  readingProgress: {},
  preferences: defaultUserPreferences,
  lastVisitedPageId: null,
  recentVisits: [],
  updatedAt: new Date().toISOString(),
};

export class UserStateManager {
  private state: typeof defaultUserState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    const loaded = safeLocalStorage.getItem(USER_STATE_KEY, defaultUserState);
    this.state = {
      ...defaultUserState,
      ...loaded,
      preferences: {
        ...defaultUserPreferences,
        ...(loaded?.preferences || {}),
      },
    };
  }

  public getState() {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyAndPersist() {
    this.state.updatedAt = new Date().toISOString();
    safeLocalStorage.setItem(USER_STATE_KEY, this.state);
    this.listeners.forEach((l) => l());
  }

  // Favorites
  public isFavorite(pageId: string): boolean {
    if (!pageId) return false;
    return this.state.favorites.includes(pageId);
  }

  public addFavorite(pageId: string): void {
    if (!pageId || this.isFavorite(pageId)) return;
    this.state.favorites.push(pageId);
    this.notifyAndPersist();
  }

  public removeFavorite(pageId: string): void {
    if (!pageId) return;
    this.state.favorites = this.state.favorites.filter((id) => id !== pageId);
    this.notifyAndPersist();
  }

  public toggleFavorite(pageId: string): void {
    if (this.isFavorite(pageId)) {
      this.removeFavorite(pageId);
    } else {
      this.addFavorite(pageId);
    }
  }

  // To-do
  public isTodoCompleted(todoId: string, initialChecked = false): boolean {
    if (!todoId) return initialChecked;
    if (Object.prototype.hasOwnProperty.call(this.state.completedTodos, todoId)) {
      return this.state.completedTodos[todoId];
    }
    return initialChecked;
  }

  public setTodoCompleted(todoId: string, completed: boolean): void {
    if (!todoId) return;
    if (this.state.completedTodos[todoId] === completed) return;
    this.state.completedTodos[todoId] = completed;
    this.notifyAndPersist();
  }

  public toggleTodo(todoId: string): void {
    const current = !!this.state.completedTodos[todoId];
    this.setTodoCompleted(todoId, !current);
  }

  // Reading Progress
  public getReadingProgress(pageId: string): number {
    if (!pageId) return 0;
    return this.state.readingProgress[pageId] || 0;
  }

  public setReadingProgress(pageId: string, progress: number): void {
    if (!pageId) return;
    const clamped = Math.min(100, Math.max(0, Math.round(progress)));
    if (this.state.readingProgress[pageId] === clamped) return;
    this.state.readingProgress[pageId] = clamped;
    this.notifyAndPersist();
  }

  public markPageCompleted(pageId: string): void {
    this.setReadingProgress(pageId, 100);
  }

  // Visits
  public recordPageVisit(pageId: string): void {
    if (!pageId) return;
    const now = new Date().toISOString();
    this.state.lastVisitedPageId = pageId;
    this.state.recentVisits = [
      { pageId, visitedAt: now },
      ...this.state.recentVisits.filter((v) => v.pageId !== pageId),
    ].slice(0, 20);
    this.notifyAndPersist();
  }

  // Preferences
  public updatePreferences(partial: Partial<UserPreferences>): void {
    this.state.preferences = {
      ...this.state.preferences,
      ...partial,
    };
    this.notifyAndPersist();
  }

  public reset(): void {
    this.state = {
      ...defaultUserState,
      updatedAt: new Date().toISOString(),
    };
    safeLocalStorage.removeItem(USER_STATE_KEY);
    this.listeners.forEach((l) => l());
  }
}

export const userStateManager = new UserStateManager();
