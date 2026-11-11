// src/types/user.ts

/**
 * Static Content와 엄격히 분리된 User Data 인터페이스 모델.
 * AI 4는 데이터 구조와 타입을 규정하며,
 * 실제 런타임 상태 관리 및 영속화(localStorage / Zustand)는 AI 5가 담당합니다.
 */

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'normal' | 'large';
  sidebarCollapsed: boolean;
}

export interface UserReadingProgress {
  [pageId: string]: number; // 0 ~ 100 percentage
}

export interface UserTodoState {
  [todoBlockId: string]: boolean; // checked true / false
}

export interface UserDataModel {
  favorites: string[]; // Page IDs
  completedTodos: UserTodoState;
  readingProgress: UserReadingProgress;
  preferences: UserPreferences;
  lastVisitedPageId?: string | null;
  updatedAt?: string;
}
