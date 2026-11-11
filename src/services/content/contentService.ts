// src/services/content/contentService.ts

import type { PageItem, PageRegistryItem } from '../../types/page';
import type { ContentManifest } from '../../types/manifest';
import type { NavigationNode, BreadcrumbItem } from '../../types/navigation';
import type { ContentBlock } from '../../types/block';
import { contentRepository } from './contentRepository';
import {
  buildNavigationTree,
  getPageBreadcrumbs,
  extractPageSearchableText,
} from './contentSelectors';

export interface IContentService {
  getAllPages(): Promise<PageRegistryItem[]>;
  getPageById(id: string): Promise<PageItem | null>;
  getPageBySlug(slug: string): Promise<PageItem | null>;
  getPageHierarchy(): Promise<PageRegistryItem[]>;
  getNavigationTree(): Promise<NavigationNode[]>;
  getChildPages(parentId: string): Promise<PageRegistryItem[]>;
  getPageBreadcrumbs(pageId: string): Promise<BreadcrumbItem[]>;
  getAllContentBlocks(pageId: string): Promise<ContentBlock[]>;
  getContentManifest(): Promise<ContentManifest>;
  getSearchIndexData(): Promise<Array<{ pageId: string; title: string; slug: string; searchableText: string }>>;
}

/**
 * AI 2, AI 3, AI 5가 비동기적으로 콘텐츠 및 네비게이션을 질의할 수 있는 표준 서비스 클래스
 */
export class ContentService implements IContentService {
  public async getAllPages(): Promise<PageRegistryItem[]> {
    return contentRepository.getAllRegistryItems();
  }

  public async getPageById(id: string): Promise<PageItem | null> {
    return contentRepository.getPageById(id);
  }

  public async getPageBySlug(slug: string): Promise<PageItem | null> {
    return contentRepository.getPageBySlug(slug);
  }

  public async getPageHierarchy(): Promise<PageRegistryItem[]> {
    return contentRepository.getAllRegistryItems();
  }

  public async getNavigationTree(): Promise<NavigationNode[]> {
    return buildNavigationTree();
  }

  public async getChildPages(parentId: string): Promise<PageRegistryItem[]> {
    const all = contentRepository.getAllRegistryItems();
    return all.filter((p) => p.parentId === parentId).sort((a, b) => a.order - b.order);
  }

  public async getPageBreadcrumbs(pageId: string): Promise<BreadcrumbItem[]> {
    return getPageBreadcrumbs(pageId);
  }

  public async getAllContentBlocks(pageId: string): Promise<ContentBlock[]> {
    const page = contentRepository.getPageById(pageId);
    return page ? page.blocks : [];
  }

  public async getContentManifest(): Promise<ContentManifest> {
    return contentRepository.getManifest();
  }

  /**
   * AI 5 검색 엔진을 위한 전체 인덱싱 데이터 스트림 제공
   */
  public async getSearchIndexData(): Promise<
    Array<{ pageId: string; title: string; slug: string; searchableText: string }>
  > {
    const pages = contentRepository.getAllPages();
    return pages.map((page) => ({
      pageId: page.id,
      title: page.title,
      slug: page.slug,
      searchableText: extractPageSearchableText(page),
    }));
  }
}

export const contentService = new ContentService();
