// src/services/content/notionImportAdapter.ts

import type { ContentBlock, BlockType, RichTextSpan } from '../../types/block';
import type { PageItem } from '../../types/page';

/**
 * 향후 사용자가 실제 Notion Export 파일(Markdown, CSV, JSON)을 투입했을 때
 * 정규화된 PageItem으로 안전하게 변환하는 마이그레이션 어댑터 인터페이스 및 유틸리티
 */

export interface RawNotionBlock {
  id?: string;
  type?: string;
  [key: string]: unknown;
}

export interface RawNotionPage {
  id?: string;
  properties?: Record<string, unknown>;
  children?: RawNotionBlock[];
  [key: string]: unknown;
}

export interface INotionImportAdapter {
  adaptPage(rawPage: RawNotionPage, slug: string, order?: number): PageItem;
  adaptBlock(rawBlock: RawNotionBlock): ContentBlock;
}

export class NotionImportAdapter implements INotionImportAdapter {
  /**
   * 미지원 또는 파싱 불가 블록을 unknown 블록으로 안전하게 변환하여 손실 방지
   */
  public adaptBlock(rawBlock: RawNotionBlock): ContentBlock {
    const blockId = String(rawBlock.id || `raw-${Math.random().toString(36).substring(2, 9)}`);
    const rawType = String(rawBlock.type || 'unknown');

    // 표준 블록 타입 매핑
    const recognizedTypes: BlockType[] = [
      'paragraph',
      'heading_1',
      'heading_2',
      'heading_3',
      'bulleted_list_item',
      'numbered_list_item',
      'to_do',
      'toggle',
      'callout',
      'quote',
      'divider',
      'table',
      'table_row',
      'code',
      'image',
      'video',
      'bookmark',
      'child_page',
      'file',
    ];

    if (!recognizedTypes.includes(rawType as BlockType)) {
      return {
        id: blockId,
        type: 'unknown',
        rawType,
        rawData: rawBlock,
        hasChildren: false,
        migrationNotice: `Preserved Notion block of unrecognized type "${rawType}" for zero-loss migration.`,
      };
    }

    // 기본 정규화
    return {
      id: blockId,
      type: rawType as BlockType,
      hasChildren: false,
      metadata: { raw: rawBlock },
    } as ContentBlock;
  }

  public adaptPage(rawPage: RawNotionPage, slug: string, order: number = 0): PageItem {
    const id = String(rawPage.id || `page-${Math.random().toString(36).substring(2, 9)}`);
    const blocks: ContentBlock[] = Array.isArray(rawPage.children)
      ? rawPage.children.map((b) => this.adaptBlock(b))
      : [];

    return {
      id,
      title: 'Imported Notion Page',
      slug,
      parentId: null,
      icon: null,
      coverImage: null,
      order,
      blocks,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isUnconfirmedMigration: false,
      },
    };
  }
}

export const notionImportAdapter = new NotionImportAdapter();
