// src/types/page.ts

import type { ContentBlock } from './block';

export interface PageMetadata {
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
  readingTimeMinutes?: number;
  isUnconfirmedMigration?: boolean; // Notion 원본 미확인 시 플레이스홀더 플래그
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
  category?: string;
  timestamp?: string;
  status?: string;
}
