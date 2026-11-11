import assert from 'node:assert';
import test from 'node:test';

// In-memory mock localStorage
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
  get length() {
    return Object.keys(this.store).length;
  }
  key(index) {
    return Object.keys(this.store)[index] || null;
  }
}

const mockLS = new MockLocalStorage();
globalThis.window = {
  localStorage: mockLS,
};

// --- In-line SafeLocalStorage Implementation under test ---
const STORAGE_PREFIX = 'mypath365_';
const CURRENT_SCHEMA_VERSION = 1;

class SafeLocalStorageService {
  constructor(prefix = STORAGE_PREFIX, version = CURRENT_SCHEMA_VERSION) {
    this.prefix = prefix;
    this.version = version;
  }

  getFullKey(key) {
    return `${this.prefix}${key}`;
  }

  isAvailable() {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    try {
      const testKey = `${this.prefix}__test__`;
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getItem(key, fallback, validator) {
    if (!this.isAvailable()) return fallback;
    try {
      const raw = window.localStorage.getItem(this.getFullKey(key));
      if (!raw) return fallback;

      const envelope = JSON.parse(raw);
      if (envelope && typeof envelope === 'object' && 'version' in envelope && 'data' in envelope) {
        const migratedData = this.migrateData(key, envelope.version, envelope.data);
        if (validator && !validator(migratedData)) {
          return fallback;
        }
        return migratedData;
      }

      if (validator && !validator(envelope)) {
        return fallback;
      }
      return envelope;
    } catch (err) {
      return fallback;
    }
  }

  setItem(key, value) {
    if (!this.isAvailable()) return false;
    try {
      const envelope = {
        version: this.version,
        timestamp: new Date().toISOString(),
        data: value,
      };
      window.localStorage.setItem(this.getFullKey(key), JSON.stringify(envelope));
      return true;
    } catch {
      return false;
    }
  }

  removeItem(key) {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.removeItem(this.getFullKey(key));
      return true;
    } catch {
      return false;
    }
  }

  clear() {
    if (!this.isAvailable()) return false;
    try {
      const keysToRemove = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(this.prefix)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      return true;
    } catch {
      return false;
    }
  }

  migrateData(key, fromVersion, data) {
    if (fromVersion === this.version) return data;
    return data;
  }
}

// --- In-line ClientSearchEngine Implementation under test ---
class ClientSearchEngine {
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
          this.extractBlockText(block, page, items);
        }
      }
    }
    this.indexedItems = items;
  }

  extractBlockText(block, page, out) {
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
        this.extractBlockText(child, page, out);
      }
    }
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
      if (item.isTitle) matchScore += 60;

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

    const results = Array.from(scoredMap.values());
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }

  buildSnippet(text, matchIndex, matchLength) {
    if (matchIndex === -1) return text.slice(0, 100);
    const start = Math.max(0, matchIndex - 30);
    const end = Math.min(text.length, matchIndex + matchLength + 50);
    const prefix = start > 0 ? '…' : '';
    const suffix = end < text.length ? '…' : '';
    return `${prefix}${text.slice(start, end).trim()}${suffix}`;
  }
}

// --- In-line UserStateManager Implementation under test ---
class UserStateManager {
  constructor(storage = new SafeLocalStorageService()) {
    this.storage = storage;
    this.reset();
  }

  reset() {
    this.state = {
      favorites: [],
      completedTodos: {},
      readingProgress: {},
      preferences: {
        theme: 'system',
        fontSize: 'normal',
        sidebarCollapsed: false,
      },
      lastVisitedPageId: null,
      recentVisits: [],
      updatedAt: new Date().toISOString(),
    };
    this.storage.removeItem('user_state');
  }

  getState() {
    return this.state;
  }

  isFavorite(pageId) {
    if (!pageId) return false;
    return this.state.favorites.includes(pageId);
  }

  addFavorite(pageId) {
    if (!pageId || this.isFavorite(pageId)) return;
    this.state.favorites.push(pageId);
    this.persist();
  }

  removeFavorite(pageId) {
    if (!pageId) return;
    this.state.favorites = this.state.favorites.filter((id) => id !== pageId);
    this.persist();
  }

  toggleFavorite(pageId) {
    if (this.isFavorite(pageId)) {
      this.removeFavorite(pageId);
    } else {
      this.addFavorite(pageId);
    }
  }

  isTodoCompleted(todoId, initialChecked = false) {
    if (!todoId) return initialChecked;
    if (Object.prototype.hasOwnProperty.call(this.state.completedTodos, todoId)) {
      return this.state.completedTodos[todoId];
    }
    return initialChecked;
  }

  setTodoCompleted(todoId, completed) {
    if (!todoId) return;
    if (this.state.completedTodos[todoId] === completed) return;
    this.state.completedTodos[todoId] = completed;
    this.persist();
  }

  toggleTodo(todoId) {
    const current = !!this.state.completedTodos[todoId];
    this.setTodoCompleted(todoId, !current);
  }

  getReadingProgress(pageId) {
    if (!pageId) return 0;
    return this.state.readingProgress[pageId] || 0;
  }

  setReadingProgress(pageId, progress) {
    if (!pageId) return;
    const clamped = Math.min(100, Math.max(0, Math.round(progress)));
    if (this.state.readingProgress[pageId] === clamped) return;
    this.state.readingProgress[pageId] = clamped;
    this.persist();
  }

  markPageCompleted(pageId) {
    this.setReadingProgress(pageId, 100);
  }

  recordPageVisit(pageId) {
    if (!pageId) return;
    const now = new Date().toISOString();
    this.state.lastVisitedPageId = pageId;
    this.state.recentVisits = [
      { pageId, visitedAt: now },
      ...this.state.recentVisits.filter((v) => v.pageId !== pageId),
    ].slice(0, 20);
    this.persist();
  }

  updatePreferences(partial) {
    this.state.preferences = {
      ...this.state.preferences,
      ...partial,
    };
    this.persist();
  }

  persist() {
    this.state.updatedAt = new Date().toISOString();
    this.storage.setItem('user_state', this.state);
  }
}

// ----------------- TEST CASES -----------------

test('SafeLocalStorage - Set and Get Envelope Data', () => {
  const safeStorage = new SafeLocalStorageService();
  const success = safeStorage.setItem('test_record', { foo: 'bar', num: 42 });
  assert.strictEqual(success, true);

  const retrieved = safeStorage.getItem('test_record', { foo: '', num: 0 });
  assert.deepStrictEqual(retrieved, { foo: 'bar', num: 42 });
});

test('SafeLocalStorage - Fallback on corrupt JSON', () => {
  const safeStorage = new SafeLocalStorageService();
  mockLS.setItem('mypath365_bad_key', '{"unclosed_json:');
  const fallback = { fallback: true };
  const res = safeStorage.getItem('bad_key', fallback);
  assert.deepStrictEqual(res, fallback);
});

test('SafeLocalStorage - Prefix matching clear and remove', () => {
  const safeStorage = new SafeLocalStorageService();
  safeStorage.setItem('keep', 1);
  safeStorage.setItem('delete', 2);
  mockLS.setItem('other_app_key', 'preserve');

  safeStorage.removeItem('delete');
  assert.strictEqual(safeStorage.getItem('delete', null), null);
  assert.strictEqual(safeStorage.getItem('keep', null), 1);

  safeStorage.clear();
  assert.strictEqual(safeStorage.getItem('keep', null), null);
  assert.strictEqual(mockLS.getItem('other_app_key'), 'preserve');
});

test('ClientSearchEngine - Korean & English indexing and ranking', () => {
  const engine = new ClientSearchEngine();

  const mockPages = [
    {
      id: 'page-1',
      title: '한국어 리액트 시작하기',
      slug: 'react-start-ko',
      parentId: null,
      order: 1,
      metadata: {},
      blocks: [
        {
          id: 'b-101',
          type: 'paragraph',
          hasChildren: false,
          richText: [{ type: 'text', plainText: 'Zustand 상태 관리를 배웁니다.' }],
        },
        {
          id: 'b-102',
          type: 'to_do',
          checked: false,
          hasChildren: false,
          richText: [{ type: 'text', plainText: '단축키 Cmd+K 구현 완료하기' }],
        },
      ],
    },
    {
      id: 'page-2',
      title: 'Design System & Motion Guide',
      slug: 'design-guide',
      parentId: null,
      order: 2,
      metadata: {},
      blocks: [
        {
          id: 'b-201',
          type: 'paragraph',
          hasChildren: false,
          richText: [{ type: 'text', plainText: 'Linear 스타일의 절제된 타이포그래피' }],
        },
      ],
    },
  ];

  engine.indexPages(mockPages);

  // 1. Korean in title
  const r1 = engine.search('한국어');
  assert.strictEqual(r1.length, 1);
  assert.strictEqual(r1[0].pageId, 'page-1');
  assert.strictEqual(r1[0].pageTitle, '한국어 리액트 시작하기');

  // 2. Korean in body
  const r2 = engine.search('타이포그래피');
  assert.strictEqual(r2.length, 1);
  assert.strictEqual(r2[0].pageId, 'page-2');
  assert.strictEqual(r2[0].blockId, 'b-201');

  // 3. Multi-word match
  const r3 = engine.search('단축키 Cmd');
  assert.strictEqual(r3.length, 1);
  assert.strictEqual(r3[0].pageId, 'page-1');
  assert.strictEqual(r3[0].blockId, 'b-102');

  // 4. Case-insensitivity
  const r4 = engine.search('zustand');
  assert.strictEqual(r4.length, 1);
  assert.strictEqual(r4[0].pageId, 'page-1');

  // 5. Empty or whitespace
  assert.deepStrictEqual(engine.search(''), []);
  assert.deepStrictEqual(engine.search('   '), []);

  // 6. Unknown query
  assert.deepStrictEqual(engine.search('NonExistentTerm123'), []);
});

test('UserStateManager - Full interaction state cycle', () => {
  const manager = new UserStateManager();

  // 1. Favorites
  assert.strictEqual(manager.isFavorite('p-100'), false);
  manager.addFavorite('p-100');
  assert.strictEqual(manager.isFavorite('p-100'), true);
  assert.deepStrictEqual(manager.getState().favorites, ['p-100']);

  // Redundant add
  manager.addFavorite('p-100');
  assert.deepStrictEqual(manager.getState().favorites, ['p-100']);

  // Toggle
  manager.toggleFavorite('p-100');
  assert.strictEqual(manager.isFavorite('p-100'), false);

  manager.toggleFavorite('p-200');
  assert.strictEqual(manager.isFavorite('p-200'), true);

  manager.removeFavorite('p-200');
  assert.strictEqual(manager.isFavorite('p-200'), false);

  // 2. To-do
  const todoId = 'todo-item-1';
  assert.strictEqual(manager.isTodoCompleted(todoId, false), false);
  assert.strictEqual(manager.isTodoCompleted(todoId, true), true);

  manager.setTodoCompleted(todoId, true);
  assert.strictEqual(manager.isTodoCompleted(todoId, false), true);

  manager.toggleTodo(todoId);
  assert.strictEqual(manager.isTodoCompleted(todoId, true), false);

  // 3. Reading progress
  const pageId = 'guide-intro';
  assert.strictEqual(manager.getReadingProgress(pageId), 0);

  manager.setReadingProgress(pageId, 45);
  assert.strictEqual(manager.getReadingProgress(pageId), 45);

  manager.setReadingProgress(pageId, 150);
  assert.strictEqual(manager.getReadingProgress(pageId), 100);

  manager.setReadingProgress(pageId, -20);
  assert.strictEqual(manager.getReadingProgress(pageId), 0);

  manager.markPageCompleted(pageId);
  assert.strictEqual(manager.getReadingProgress(pageId), 100);

  // 4. Preferences & visits
  manager.updatePreferences({ theme: 'dark', fontSize: 'large' });
  assert.strictEqual(manager.getState().preferences.theme, 'dark');
  assert.strictEqual(manager.getState().preferences.fontSize, 'large');

  manager.recordPageVisit('page-a');
  manager.recordPageVisit('page-b');
  assert.strictEqual(manager.getState().lastVisitedPageId, 'page-b');
  assert.strictEqual(manager.getState().recentVisits[0].pageId, 'page-b');
  assert.strictEqual(manager.getState().recentVisits[1].pageId, 'page-a');
});
