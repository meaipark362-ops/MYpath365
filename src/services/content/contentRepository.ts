// src/services/content/contentRepository.ts

import manifestData from '../../data/manifest.json';
import defaultPageData from '../../data/pages/welcome-unconfirmed-migration.json';
import type { PageItem, PageRegistryItem } from '../../types/page';
import type { ContentManifest } from '../../types/manifest';

/**
 * 정적 콘텐츠 저장소
 * 메모리 내에 등록된 정규화 페이지 및 매니페스트를 안전하게 관리합니다.
 */
class ContentRepository {
  private manifest: ContentManifest;
  private pagesMap: Map<string, PageItem>;
  private slugToIdMap: Map<string, string>;

  constructor() {
    this.manifest = manifestData as unknown as ContentManifest;
    this.pagesMap = new Map<string, PageItem>();
    this.slugToIdMap = new Map<string, string>();

    // 기본 플레이스홀더 페이지 등록
    const initialPage = defaultPageData as unknown as PageItem;
    this.registerPage(initialPage);
  }

  public registerPage(page: PageItem): void {
    this.pagesMap.set(page.id, page);
    this.slugToIdMap.set(page.slug, page.id);
  }

  public getManifest(): ContentManifest {
    return this.manifest;
  }

  public getAllRegistryItems(): PageRegistryItem[] {
    return [...this.manifest.pages].sort((a, b) => a.order - b.order);
  }

  public getPageById(id: string): PageItem | null {
    return this.pagesMap.get(id) || null;
  }

  public getPageBySlug(slug: string): PageItem | null {
    const id = this.slugToIdMap.get(slug);
    if (!id) return null;
    return this.pagesMap.get(id) || null;
  }

  public getAllPages(): PageItem[] {
    return Array.from(this.pagesMap.values());
  }
}

export const contentRepository = new ContentRepository();
