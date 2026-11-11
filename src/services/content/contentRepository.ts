// src/services/content/contentRepository.ts

import manifestData from '../../data/manifest.json';
import defaultPageData from '../../data/pages/welcome-unconfirmed-migration.json';
import homePageData from '../../data/pages/home.json';
import projArduinoData from '../../data/pages/project-arduino-assistive.json';
import projStm32Data from '../../data/pages/project-stm32-robot-arm.json';
import careerClassesData from '../../data/pages/career-classes.json';
import careerInfoData from '../../data/pages/career-info.json';
import careerActivitiesData from '../../data/pages/career-activities.json';
import readingFootprintData from '../../data/pages/reading-footprint.json';
import portfolioData from '../../data/pages/portfolio.json';
import archiveData from '../../data/pages/archive.json';

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

    // 페이지 등록
    const pagesToRegister: PageItem[] = [
      defaultPageData as unknown as PageItem,
      homePageData as unknown as PageItem,
      projArduinoData as unknown as PageItem,
      projStm32Data as unknown as PageItem,
      careerClassesData as unknown as PageItem,
      careerInfoData as unknown as PageItem,
      careerActivitiesData as unknown as PageItem,
      readingFootprintData as unknown as PageItem,
      portfolioData as unknown as PageItem,
      archiveData as unknown as PageItem,
    ];

    pagesToRegister.forEach((p) => this.registerPage(p));
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
    if (!id) {
      // Fallback: If not in memory map, try finding a placeholder representation
      const item = this.manifest.pages.find((p) => p.slug === slug);
      if (item) {
        return {
          id: item.id,
          title: item.title,
          slug: item.slug,
          parentId: item.parentId,
          icon: item.icon,
          order: item.order,
          metadata: {
            createdAt: new Date().toISOString(),
            tags: [item.category || 'Career'],
            readingTimeMinutes: 3,
            isUnconfirmedMigration: false
          },
          blocks: [
            {
              id: `${item.id}-h1`,
              type: 'heading_1',
              hasChildren: false,
              richText: [{ type: 'text', plainText: item.title, annotations: { bold: true, italic: false, strikethrough: false, underline: false, code: false } }]
            },
            {
              id: `${item.id}-callout`,
              type: 'callout',
              icon: item.icon || '📌',
              hasChildren: false,
              richText: [{ type: 'text', plainText: `${item.category || '활동'} 상세 페이지입니다. 실시간 학습 및 활동 기록이 관리됩니다.`, annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false } }]
            }
          ]
        };
      }
      return null;
    }
    return this.pagesMap.get(id) || null;
  }

  public getAllPages(): PageItem[] {
    return Array.from(this.pagesMap.values());
  }
}

export const contentRepository = new ContentRepository();
