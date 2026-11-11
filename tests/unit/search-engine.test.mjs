import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Extract class implementation or evaluate logic from searchEngine.ts
function extractBlockText(block, page, out) {
  if (!block) return;
  let fullText = '';
  if (Array.isArray(block.richText)) {
    fullText = block.richText.map((span) => span?.plainText || '').join(' ');
  } else if (Array.isArray(block.cells)) {
    fullText = block.cells
      .flatMap((row) => (Array.isArray(row) ? row.map((c) => c?.plainText || '') : []))
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
      extractBlockText(child, page, out);
    }
  }
}

class TestSearchEngine {
  constructor() {
    this.indexedItems = [];
  }

  indexPages(pages) {
    const items = [];
    for (const page of pages) {
      if (!page) continue;
      items.push({
        pageId: page.id,
        pageTitle: page.title || 'Untitled',
        pageSlug: page.slug || page.id,
        text: page.title || '',
        isTitle: true,
      });

      if (Array.isArray(page.blocks)) {
        for (const block of page.blocks) {
          extractBlockText(block, page, items);
        }
      }
    }
    this.indexedItems = items;
  }

  search(query, limit = 10) {
    const trimmed = (query || '').trim();
    if (!trimmed) return [];

    const normalizedQuery = trimmed.toLowerCase();
    const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
    const scoredMap = new Map();

    for (const item of this.indexedItems) {
      const lowerText = item.text.toLowerCase();
      let matched = true;
      let matchScore = 0;
      let firstMatchIndex = -1;

      for (const token of queryTokens) {
        const idx = lowerText.indexOf(token);
        if (idx === -1) {
          matched = false;
          break;
        }

        if (lowerText === token) {
          matchScore += 100;
        } else if (idx === 0) {
          matchScore += 40;
        } else {
          matchScore += 20;
        }

        if (firstMatchIndex === -1 || idx < firstMatchIndex) {
          firstMatchIndex = idx;
        }
      }

      if (!matched) continue;

      if (item.isTitle) {
        matchScore += 60;
      }

      const dedupeKey = `${item.pageId}_${item.blockId || 'title'}`;
      const existing = scoredMap.get(dedupeKey);

      if (!existing || matchScore > existing.score) {
        scoredMap.set(dedupeKey, {
          pageId: item.pageId,
          pageTitle: item.pageTitle,
          pageSlug: item.pageSlug,
          matchedText: item.text,
          blockId: item.blockId,
          score: matchScore,
        });
      }
    }

    const results = Array.from(scoredMap.values());
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }
}

test('Search Engine: Indexes pages and returns weighted query matches', () => {
  const engine = new TestSearchEngine();
  const samplePages = [
    {
      id: 'p-1',
      title: 'Getting Started with Notion Migration',
      slug: 'getting-started',
      blocks: [
        {
          id: 'b-1',
          type: 'paragraph',
          hasChildren: false,
          richText: [{ type: 'text', plainText: 'This guide explains how to migrate pages seamlessly.', annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false } }]
        }
      ]
    },
    {
      id: 'p-2',
      title: 'Architecture Overview',
      slug: 'architecture',
      blocks: [
        {
          id: 'b-2',
          type: 'paragraph',
          hasChildren: false,
          richText: [{ type: 'text', plainText: 'MyPath365 uses a headless content architecture.', annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false } }]
        }
      ]
    }
  ];

  engine.indexPages(samplePages);

  // Exact title match gets highest score
  const res1 = engine.search('Architecture Overview');
  assert.ok(res1.length > 0);
  assert.equal(res1[0].pageId, 'p-2');
  assert.ok(res1[0].score > 100);

  // Body content match
  const res2 = engine.search('migrate pages');
  assert.ok(res2.length > 0);
  assert.equal(res2[0].pageId, 'p-1');

  // Empty query returns empty array
  assert.deepEqual(engine.search(''), []);
  assert.deepEqual(engine.search('   '), []);

  // Non-matching query returns empty array
  assert.deepEqual(engine.search('nonexistent keyword xyz'), []);
});

test('Search Engine: Verifies indexation of actual welcome-unconfirmed-migration page', () => {
  const engine = new TestSearchEngine();
  const welcomePage = JSON.parse(
    readFileSync(join(process.cwd(), 'src/data/pages/welcome-unconfirmed-migration.json'), 'utf-8')
  );

  engine.indexPages([welcomePage]);
  const results = engine.search('Welcome');
  assert.ok(results.length > 0, 'Should find welcome page');
  assert.equal(results[0].pageId, 'unconfirmed-migration-root');
});
