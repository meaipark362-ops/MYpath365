# MyPath365 — Common Interface Contracts & API Specifications

**Document Version:** 1.0.0  
**Author:** AI 0 — Chief Architect & Multi-Agent Orchestrator  
**Status:** Approved for Multi-Agent Implementation  

---

## 1. Overview & Contract Philosophy

모든 AI 1~7 에이전트가 단일 저장소에서 블로킹 없이 병렬로 개발을 진행하기 위해 사전에 확정된 **공통 인터페이스 계약(Contracts)**을 정의합니다.  
각 AI는 타인이 아직 구현을 완료하지 않았더라도 이 계약 스펙을 기반으로 자체 mock 데이터를 사용하여 100% 독립 구현할 수 있습니다.

---

## 2. Contract 1: Design Contract (AI 1 → AI 2, 3, 5, 6)

### 2.1 Specification
- **제공자**: AI 1 (Design System Architect)
- **소비자**: AI 2 (Frontend), AI 3 (Content), AI 5 (Interaction), AI 6 (Assets)
- **파일 위치**: `src/styles/tokens.css`, `src/components/ui/index.ts`
- **의존성**: 없음 (최하위 기반 레이어)

### 2.2 Color & Theme Tokens (CSS Variables)
```css
:root {
  /* Core Palette - Premium Minimal */
  --color-obsidian: #101114;
  --color-ivory: #F6F6F3;
  --color-silver: #A7A9AD;
  --color-slate: #747B85;

  /* Semantic Light (Default) */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F6F6F3;
  --bg-surface: #FBFBFA;
  --border-subtle: rgba(16, 17, 20, 0.08);
  --border-strong: rgba(16, 17, 20, 0.16);
  --text-primary: #101114;
  --text-secondary: #747B85;
  --text-muted: #A7A9AD;
  --accent-primary: #101114;
  --accent-contrast: #FFFFFF;

  /* Typography Scale (Editorial) */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-serif: 'Newsreader', Georgia, serif;
  --font-mono: 'JetBrains Mono', SFMono-Regular, monospace;
  
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 2rem;      /* 32px */
  --text-4xl: 2.5rem;    /* 40px */
  
  --line-height-body: 1.7;
  --content-max-width: 720px;

  /* Transitions & Shadows */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --shadow-subtle: 0 1px 3px rgba(0, 0, 0, 0.04);
  --shadow-elevation: 0 8px 30px rgba(0, 0, 0, 0.06);
}

[data-theme="dark"] {
  --bg-primary: #101114;
  --bg-secondary: #18191D;
  --bg-surface: #1E2025;
  --border-subtle: rgba(246, 246, 243, 0.08);
  --border-strong: rgba(246, 246, 243, 0.18);
  --text-primary: #F6F6F3;
  --text-secondary: #A7A9AD;
  --text-muted: #747B85;
  --accent-primary: #F6F6F3;
  --accent-contrast: #101114;
}
```

### 2.3 UI Component Interfaces (TypeScript)
```typescript
// src/components/ui/index.ts

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type ComponentSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ComponentSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'subtle';
  size?: 'sm' | 'md';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delayMs?: number;
}
```

---

## 3. Contract 2: Data Contract (AI 4 → AI 2, 3, 5)

### 3.1 Specification
- **제공자**: AI 4 (Data Architect)
- **소비자**: AI 2 (Frontend), AI 3 (Content), AI 5 (Interaction)
- **파일 위치**: `src/types/schema.ts`, `src/types/page.ts`, `src/types/block.ts`, `src/services/content/contentService.ts`
- **의존성**: 없음 (도메인 데이터의 원천)

### 3.2 Notion Block & Page Type Definitions
```typescript
// src/types/block.ts

export type BlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'to_do'
  | 'toggle'
  | 'callout'
  | 'quote'
  | 'divider'
  | 'table'
  | 'code'
  | 'image'
  | 'video'
  | 'bookmark'
  | 'child_page'
  | 'unknown';

export interface RichTextAnnotation {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color?: string;
}

export interface RichTextSpan {
  type: 'text' | 'mention' | 'equation';
  plainText: string;
  annotations: RichTextAnnotation;
  href?: string | null;
}

export interface BaseBlock {
  id: string;
  type: BlockType;
  children?: ContentBlock[];
  hasChildren: boolean;
  metadata?: Record<string, unknown>;
}

export interface ParagraphBlockData extends BaseBlock {
  type: 'paragraph';
  richText: RichTextSpan[];
}

export interface HeadingBlockData extends BaseBlock {
  type: 'heading_1' | 'heading_2' | 'heading_3';
  richText: RichTextSpan[];
  isToggleable?: boolean;
}

export interface TodoBlockData extends BaseBlock {
  type: 'to_do';
  richText: RichTextSpan[];
  checked: boolean;
}

export interface CalloutBlockData extends BaseBlock {
  type: 'callout';
  richText: RichTextSpan[];
  icon?: string;
}

export interface UnknownBlockData extends BaseBlock {
  type: 'unknown';
  rawType: string;
  rawData?: unknown;
  migrationNotice: string; // e.g. "Unconfirmed Notion block preserved for future migration"
}

export type ContentBlock =
  | ParagraphBlockData
  | HeadingBlockData
  | TodoBlockData
  | CalloutBlockData
  | UnknownBlockData
  | (BaseBlock & { type: Exclude<BlockType, 'paragraph' | 'heading_1' | 'heading_2' | 'heading_3' | 'to_do' | 'callout' | 'unknown'>; richText?: RichTextSpan[]; data?: unknown });
```

```typescript
// src/types/page.ts

export interface PageMetadata {
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
  readingTimeMinutes?: number;
  isUnconfirmedMigration?: boolean; // Notion 원본 미확인 시 플래그
}

export interface PageItem {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
  icon?: string | null;
  coverImage?: string | null;
  order: number;
  blocks: ContentBlock[];
  metadata: PageMetadata;
}

export interface PageRegistryItem {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
  icon?: string | null;
  order: number;
  childPageIds: string[];
}
```

### 3.3 Content Service Interface
```typescript
// src/services/content/contentService.ts

export interface IContentService {
  getAllPages(): Promise<PageRegistryItem[]>;
  getPageBySlug(slug: string): Promise<PageItem | null>;
  getPageById(id: string): Promise<PageItem | null>;
  getPageHierarchy(): Promise<PageRegistryItem[]>;
}
```

---

## 4. Contract 3: Content Contract (AI 3 → AI 2)

### 4.1 Specification
- **제공자**: AI 3 (Content Engine Engineer)
- **소비자**: AI 2 (Frontend Architect)
- **파일 위치**: `src/components/content/ContentRenderer.tsx`
- **의존성**: Data Contract (`ContentBlock`), Design Contract

### 4.2 Content Renderer Interface
```typescript
// src/components/content/ContentRenderer.tsx

import React from 'react';
import type { ContentBlock } from '../../types/block';

export interface ContentRendererProps {
  blocks: ContentBlock[];
  className?: string;
  enableInteractiveToggles?: boolean;
  onBlockAction?: (blockId: string, action: string, payload?: unknown) => void;
  fallbackComponent?: React.ComponentType<{ block: ContentBlock }>;
}

export const ContentRenderer: React.FC<ContentRendererProps> = (props) => {
  // AI 3 implements recursive AST rendering with unknown fallback
  return null;
};
```

---

## 5. Contract 4: Interaction Contract (AI 5 → AI 2, 3)

### 5.1 Specification
- **제공자**: AI 5 (Interaction Engineer)
- **소비자**: AI 2 (Frontend), AI 3 (Content)
- **파일 위치**: `src/stores/userStore.ts`, `src/features/search/searchEngine.ts`, `src/hooks/useReadingProgress.ts`
- **의존성**: Data Contract (`PageItem`, `PageRegistryItem`)

### 5.2 User State & Interaction Interfaces
```typescript
// src/stores/userStore.ts

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'normal' | 'large';
  sidebarCollapsed: boolean;
}

export interface UserInteractionState {
  favorites: string[]; // Page IDs
  completedTodos: Record<string, boolean>; // Todo block IDs
  readingProgress: Record<string, number>; // Page ID -> 0 to 100 percentage
  
  // Actions
  toggleFavorite: (pageId: string) => void;
  isFavorite: (pageId: string) => boolean;
  setReadingProgress: (pageId: string, progress: number) => void;
  setTodoCompleted: (todoId: string, completed: boolean) => void;
  updatePreferences: (partial: Partial<UserPreferences>) => void;
}
```

```typescript
// src/features/search/searchEngine.ts

export interface SearchResultItem {
  pageId: string;
  pageTitle: string;
  pageSlug: string;
  matchedText: string;
  blockId?: string;
  score: number;
}

export interface ISearchEngine {
  indexPages(pages: PageItem[]): void;
  search(query: string, limit?: number): SearchResultItem[];
}
```

---

## 6. Contract 5: Asset Contract (AI 6 → AI 2, 3)

### 6.1 Specification
- **제공자**: AI 6 (Asset & Media Engineer)
- **소비자**: AI 2 (Frontend), AI 3 (Content)
- **파일 위치**: `src/services/assets/assetLoader.ts`, `src/services/assets/mediaOptimizer.ts`
- **의존성**: 없음

### 6.2 Asset Loader Interface
```typescript
// src/services/assets/assetLoader.ts

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: string; // e.g. "16/9"
  lazy?: boolean;
  fallbackSrc?: string;
  placeholderColor?: string;
}

export interface IAssetLoader {
  resolveAssetUrl(path: string): string;
  getPlaceholderForType(type: 'cover' | 'avatar' | 'inline'): string;
}
```

---

## 7. Contract 6: QA Contract (AI 7 → AI 0, 8)

### 7.1 Specification
- **제공자**: AI 7 (QA & Performance Engineer)
- **소비자**: AI 0 (Chief Architect), AI 8 (Final Integration)
- **파일 위치**: `tests/`, `scripts/qa/audit-accessibility.ts`, `docs/reports/AI-07-report.md`
- **의존성**: 모든 AI의 산출물

### 7.2 Validation Standards & Test Spec
```typescript
// scripts/qa/types.ts

export interface QAAuditReport {
  timestamp: string;
  schemaValidation: {
    passed: boolean;
    invalidPages: string[];
    unknownBlocksFound: number;
  };
  accessibilityAudit: {
    wcagLevel: 'AA';
    violations: Array<{ rule: string; element: string; impact: 'critical' | 'serious' | 'moderate' }>;
  };
  performanceBudget: {
    initialBundleLimitKb: 300;
    actualBundleKb: number;
    passed: boolean;
  };
  finalIntegrationReady: boolean;
}
```

---

## 8. Change Request Protocol

계약 인터페이스가 제정된 후, 인터페이스의 시그니처나 타입 변경이 필요할 경우:
1. 변경을 요청하는 AI는 `docs/reports/AI-XX-report.md`에 **[Contract Change Request]** 항목을 작성합니다.
2. AI 0 또는 영향받는 파트너 AI의 승인 없이 인터페이스 파일의 breaking change를 직접 가하지 않습니다.
3. 파라미터 추가 시에는 항상 optional(`?`)을 사용하여 하위 호환성을 유지합니다.

