// src/services/content/contentSelectors.ts

import type { ContentBlock, RichTextSpan } from '../../types/block';
import type { PageItem } from '../../types/page';
import type { NavigationNode, BreadcrumbItem } from '../../types/navigation';
import { contentRepository } from './contentRepository';

/**
 * RichTextSpan 배열에서 순수 텍스트(string) 추출
 */
export function extractPlainTextFromSpans(spans?: RichTextSpan[]): string {
  if (!spans || spans.length === 0) return '';
  return spans.map((s) => s.plainText || '').join('');
}

/**
 * 재귀적으로 ContentBlock 내의 모든 텍스트를 추출 (AI 5 검색 엔진 연동용)
 */
export function extractBlockPlainText(block: ContentBlock): string {
  const parts: string[] = [];

  if ('richText' in block && Array.isArray(block.richText)) {
    parts.push(extractPlainTextFromSpans(block.richText));
  }

  if (block.type === 'table_row' && block.cells) {
    for (const cell of block.cells) {
      parts.push(extractPlainTextFromSpans(cell));
    }
  }

  if ('title' in block && typeof block.title === 'string') {
    parts.push(block.title);
  }

  if (block.children && block.children.length > 0) {
    for (const child of block.children) {
      parts.push(extractBlockPlainText(child));
    }
  }

  return parts.join(' ').trim();
}

/**
 * 페이지 내의 모든 블록 텍스트를 단일 문자열로 취합 (AI 5 검색 인덱싱용)
 */
export function extractPageSearchableText(page: PageItem): string {
  const title = page.title;
  const blocksText = page.blocks.map(extractBlockPlainText).join(' ');
  return `${title} ${blocksText}`.trim();
}

/**
 * 계층형 네비게이션 트리(NavigationNode[]) 구축 (AI 2 Sidebar용)
 */
export function buildNavigationTree(): NavigationNode[] {
  const items = contentRepository.getAllRegistryItems();
  const nodeMap = new Map<string, NavigationNode>();

  // 1. 모든 노드 초기화
  for (const item of items) {
    nodeMap.set(item.id, {
      id: item.id,
      title: item.title,
      slug: item.slug,
      parentId: item.parentId,
      icon: item.icon,
      order: item.order,
      children: [],
      depth: 0,
    });
  }

  const roots: NavigationNode[] = [];

  // 2. 트리 조립 및 깊이(depth) 계산
  for (const item of items) {
    const node = nodeMap.get(item.id)!;
    if (item.parentId && nodeMap.has(item.parentId)) {
      const parent = nodeMap.get(item.parentId)!;
      node.depth = parent.depth + 1;
      parent.children.push(node);
      parent.children.sort((a, b) => a.order - b.order);
    } else {
      roots.push(node);
    }
  }

  return roots.sort((a, b) => a.order - b.order);
}

/**
 * 특정 페이지의 Breadcrumbs 경로 반환 (AI 2 Breadcrumb 네비게이션용)
 */
export function getPageBreadcrumbs(pageId: string): BreadcrumbItem[] {
  const items = contentRepository.getAllRegistryItems();
  const map = new Map<string, (typeof items)[0]>(items.map((i) => [i.id, i]));
  const crumbs: BreadcrumbItem[] = [];

  let currId: string | null = pageId;
  const visited = new Set<string>();

  while (currId && map.has(currId) && !visited.has(currId)) {
    visited.add(currId);
    const currItem = map.get(currId);
    if (!currItem) break;
    crumbs.unshift({
      id: currItem.id,
      title: currItem.title,
      slug: currItem.slug,
    });
    currId = currItem.parentId;
  }

  return crumbs;
}
