// tests/data/contentService.test.ts

import { contentService } from '../../src/services/content/contentService';
import {
  validatePageItem,
  validateManifestHierarchy,
} from '../../src/data/schema-validator';
import manifestData from '../../src/data/manifest.json';
import defaultPageData from '../../src/data/pages/welcome-unconfirmed-migration.json';
import type { PageItem } from '../../src/types/page';

describe('Data Architecture & Content Service Test Suite', () => {
  test('default placeholder page passes Zod schema validation', () => {
    const page = defaultPageData as unknown as PageItem;
    const result = validatePageItem(page);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('manifest and page hierarchy pass integrity validation', () => {
    const page = defaultPageData as unknown as PageItem;
    const result = validateManifestHierarchy(manifestData, [page]);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('contentService provides all required querying APIs', async () => {
    const allPages = await contentService.getAllPages();
    expect(allPages.length).toBeGreaterThan(0);

    const defaultPage = await contentService.getPageBySlug('welcome-unconfirmed-migration');
    expect(defaultPage).not.toBeNull();
    expect(defaultPage?.title).toBe('Welcome to MyPath365 (Unconfirmed Migration)');

    const navTree = await contentService.getNavigationTree();
    expect(Array.isArray(navTree)).toBe(true);
    expect(navTree.length).toBeGreaterThan(0);

    const blocks = await contentService.getAllContentBlocks('unconfirmed-migration-root');
    expect(blocks.length).toBeGreaterThan(0);

    const searchData = await contentService.getSearchIndexData();
    expect(searchData.length).toBeGreaterThan(0);
    expect(searchData[0].searchableText).toContain('Welcome to MyPath365');
  });

  test('unknown block retains rawType and rawData for zero data loss', async () => {
    const page = await contentService.getPageById('unconfirmed-migration-root');
    const unknownBlock = page?.blocks.find((b) => b.type === 'unknown');
    expect(unknownBlock).toBeDefined();
    if (unknownBlock && unknownBlock.type === 'unknown') {
      expect(unknownBlock.rawType).toBe('notion_unsupported_plugin_widget');
      expect(unknownBlock.rawData).toBeDefined();
    }
  });
});
