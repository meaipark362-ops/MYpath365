// src/types/manifest.ts

import type { PageRegistryItem } from './page';

export interface ContentManifestMetadata {
  generatedAt: string;
  totalPages: number;
  environment: 'development' | 'production' | 'staging';
  notionExportDetected: boolean;
  notes?: string;
}

export interface ContentManifest {
  version: string;
  metadata: ContentManifestMetadata;
  pages: PageRegistryItem[];
}
