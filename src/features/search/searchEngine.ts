import type { PageItem } from '../../types/page';
import type { ContentBlock } from '../../types/block';

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

interface IndexedItem {
  pageId: string;
  pageTitle: string;
  pageSlug: string;
  blockId?: string;
  text: string;
  isTitle: boolean;
}

export class ClientSearchEngine implements ISearchEngine {
  private indexedItems: IndexedItem[] = [];

  /**
   * Index an array of PageItem objects
   */
  public indexPages(pages: PageItem[]): void {
    const items: IndexedItem[] = [];

    for (const page of pages) {
      if (!page) continue;

      // 1. Title item
      items.push({
        pageId: page.id,
        pageTitle: page.title || 'Untitled',
        pageSlug: page.slug || page.id,
        text: page.title || '',
        isTitle: true,
      });

      // 2. Blocks recursive extraction
      if (Array.isArray(page.blocks)) {
        for (const block of page.blocks) {
          this.extractBlockText(block, page, items);
        }
      }
    }

    this.indexedItems = items;
  }

  private extractBlockText(block: ContentBlock, page: PageItem, out: IndexedItem[]): void {
    if (!block) return;

    let fullText = '';
    const b = block as any;

    if (Array.isArray(b.richText)) {
      fullText = b.richText.map((span: any) => span?.plainText || '').join(' ');
    } else if (Array.isArray(b.cells)) {
      // Table rows
      fullText = b.cells
        .flatMap((row: any) => (Array.isArray(row) ? row.map((c: any) => c?.plainText || '') : []))
        .join(' ');
    }

    const trimmed = fullText.trim();
    if (trimmed.length > 0) {
      out.push({
        pageId: page.id,
        pageTitle: page.title || 'Untitled',
        pageSlug: page.slug || page.id,
        blockId: block.id,
        text: trimmed,
        isTitle: false,
      });
    }

    if (Array.isArray(block.children)) {
      for (const child of block.children) {
        this.extractBlockText(child, page, out);
      }
    }
  }

  /**
   * Search method supporting Korean, casing, whitespace normalization and weighted scoring
   */
  public search(query: string, limit = 10): SearchResultItem[] {
    const trimmed = (query || '').trim();
    if (!trimmed) {
      return [];
    }

    // Tokenize terms
    const normalizedQuery = trimmed.toLowerCase();
    const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

    const scoredMap = new Map<string, SearchResultItem>();

    for (const item of this.indexedItems) {
      const lowerText = item.text.toLowerCase();
      let matched = true;
      let matchScore = 0;
      let firstMatchIndex = -1;

      // Every token must match (AND condition)
      for (const token of queryTokens) {
        const idx = lowerText.indexOf(token);
        if (idx === -1) {
          matched = false;
          break;
        }

        // Scoring rules:
        // Exact match
        if (lowerText === token) {
          matchScore += 100;
        } else if (idx === 0) {
          // Starts with token
          matchScore += 40;
        } else {
          // Substring match
          matchScore += 20;
        }

        if (firstMatchIndex === -1 || idx < firstMatchIndex) {
          firstMatchIndex = idx;
        }
      }

      if (!matched) continue;

      // Higher weight for page titles
      if (item.isTitle) {
        matchScore += 60;
      }

      // Build matched snippet with surrounding context
      const snippet = this.buildSnippet(item.text, firstMatchIndex, queryTokens[0].length);

      const dedupeKey = `${item.pageId}_${item.blockId || 'title'}`;
      const existing = scoredMap.get(dedupeKey);

      if (!existing || matchScore > existing.score) {
        scoredMap.set(dedupeKey, {
          pageId: item.pageId,
          pageTitle: item.pageTitle,
          pageSlug: item.pageSlug,
          matchedText: snippet,
          blockId: item.blockId,
          score: matchScore,
        });
      }
    }

    // Sort descending by score
    const results = Array.from(scoredMap.values());
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, limit);
  }

  private buildSnippet(text: string, matchIndex: number, matchLength: number): string {
    if (matchIndex === -1) return text.slice(0, 100);

    const start = Math.max(0, matchIndex - 30);
    const end = Math.min(text.length, matchIndex + matchLength + 50);

    const prefix = start > 0 ? '…' : '';
    const suffix = end < text.length ? '…' : '';

    return `${prefix}${text.slice(start, end).trim()}${suffix}`;
  }
}

export const searchEngine = new ClientSearchEngine();
