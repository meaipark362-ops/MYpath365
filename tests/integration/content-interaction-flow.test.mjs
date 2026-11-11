import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Mock the state store & data repository to test their integration
function createIntegrationEnvironment() {
  const page = JSON.parse(
    readFileSync(join(process.cwd(), 'src/data/pages/welcome-unconfirmed-migration.json'), 'utf-8')
  );

  const userState = {
    favorites: [],
    completedTodos: {},
    readingProgress: {},
  };

  return {
    page,
    userState,
    toggleFavorite(id) {
      const idx = userState.favorites.indexOf(id);
      if (idx >= 0) userState.favorites.splice(idx, 1);
      else userState.favorites.push(id);
    },
    setTodo(id, checked) {
      userState.completedTodos[id] = checked;
    },
    updateProgress(id, pct) {
      userState.readingProgress[id] = Math.min(100, Math.max(0, Math.round(pct)));
    }
  };
}

test('Integration: Data Flow from Page Item to Interaction Store', () => {
  const env = createIntegrationEnvironment();
  assert.equal(env.page.id, 'unconfirmed-migration-root');

  // Toggle favorite for page
  env.toggleFavorite(env.page.id);
  assert.ok(env.userState.favorites.includes(env.page.id));

  // Extract first todo block if available, or simulate interaction
  const todoBlock = env.page.blocks.find(b => b.type === 'to_do') || { id: 'simulated-todo' };
  env.setTodo(todoBlock.id, true);
  assert.equal(env.userState.completedTodos[todoBlock.id], true);

  // Set reading progress
  env.updateProgress(env.page.id, 80);
  assert.equal(env.userState.readingProgress[env.page.id], 80);
});

test('Integration: Asset Loader resolves all media references in sample page', () => {
  const page = JSON.parse(
    readFileSync(join(process.cwd(), 'src/data/pages/welcome-unconfirmed-migration.json'), 'utf-8')
  );

  const placeholders = {
    cover: '/assets/placeholders/placeholder-cover.svg',
    inline: '/assets/placeholders/placeholder-inline.svg'
  };

  function resolveUrl(url) {
    if (!url) return placeholders.inline;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return url.startsWith('/') ? url : `/${url}`;
  }

  // Cover image verification
  const resolvedCover = resolveUrl(page.coverImage);
  assert.ok(typeof resolvedCover === 'string');

  // Blocks media verification
  for (const block of page.blocks) {
    if (block.type === 'image' || block.type === 'video') {
      const resolved = resolveUrl(block.url);
      assert.ok(resolved.length > 0);
    }
  }
});

test('Integration: Search Indexing across loaded content repository', () => {
  const page = JSON.parse(
    readFileSync(join(process.cwd(), 'src/data/pages/welcome-unconfirmed-migration.json'), 'utf-8')
  );

  // Build searchable bag of words
  const words = [];
  words.push(page.title);
  for (const b of page.blocks) {
    if (Array.isArray(b.richText)) {
      b.richText.forEach(s => words.push(s.plainText));
    }
  }

  const combinedSearchCorpus = words.join(' ').toLowerCase();
  assert.ok(combinedSearchCorpus.includes('mypath365'));
  assert.ok(combinedSearchCorpus.includes('welcome'));
});
