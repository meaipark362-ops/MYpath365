import test from 'node:test';
import assert from 'node:assert/strict';

// In-memory mock storage replicating safeLocalStorage
class MockStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key, fallback) {
    if (!this.store.has(key)) return fallback;
    try {
      return JSON.parse(this.store.get(key));
    } catch {
      return fallback;
    }
  }
  setItem(key, value) {
    this.store.set(key, JSON.stringify(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

function createUserStore(storage) {
  const STORAGE_KEY = 'user_interaction_state';
  const defaultInitial = {
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
  };

  let state = {
    ...defaultInitial,
    ...storage.getItem(STORAGE_KEY, defaultInitial)
  };

  const persist = () => {
    storage.setItem(STORAGE_KEY, state);
  };

  return {
    getState: () => state,
    toggleFavorite: (pageId) => {
      if (!pageId) return;
      const exists = state.favorites.includes(pageId);
      state.favorites = exists
        ? state.favorites.filter((id) => id !== pageId)
        : [...state.favorites, pageId];
      persist();
    },
    isFavorite: (pageId) => {
      return state.favorites.includes(pageId);
    },
    setReadingProgress: (pageId, progress) => {
      if (!pageId) return;
      const clamped = Math.min(100, Math.max(0, Math.round(progress)));
      state.readingProgress[pageId] = clamped;
      persist();
    },
    getReadingProgress: (pageId) => {
      return state.readingProgress[pageId] || 0;
    },
    setTodoCompleted: (todoId, completed) => {
      if (!todoId) return;
      state.completedTodos[todoId] = completed;
      persist();
    },
    toggleTodo: (todoId) => {
      if (!todoId) return;
      state.completedTodos[todoId] = !state.completedTodos[todoId];
      persist();
    },
    isTodoCompleted: (todoId, initialChecked = false) => {
      if (Object.prototype.hasOwnProperty.call(state.completedTodos, todoId)) {
        return state.completedTodos[todoId];
      }
      return initialChecked;
    },
    updatePreferences: (partial) => {
      state.preferences = { ...state.preferences, ...partial };
      persist();
    },
    resetUserData: () => {
      state = { ...defaultInitial };
      storage.removeItem(STORAGE_KEY);
    }
  };
}

test('User Store & LocalStorage: Favorite toggle and persistence', () => {
  const storage = new MockStorage();
  const store1 = createUserStore(storage);

  assert.equal(store1.isFavorite('page-123'), false);
  store1.toggleFavorite('page-123');
  assert.equal(store1.isFavorite('page-123'), true);
  assert.deepEqual(store1.getState().favorites, ['page-123']);

  // Check persistence by reloading store from same storage
  const store2 = createUserStore(storage);
  assert.equal(store2.isFavorite('page-123'), true);

  // Toggle off
  store2.toggleFavorite('page-123');
  assert.equal(store2.isFavorite('page-123'), false);
  assert.deepEqual(store2.getState().favorites, []);
});

test('User Store & LocalStorage: Reading progress clamping and calculation', () => {
  const storage = new MockStorage();
  const store = createUserStore(storage);

  store.setReadingProgress('page-1', 45.6);
  assert.equal(store.getReadingProgress('page-1'), 46);

  // Clamping check
  store.setReadingProgress('page-1', 150);
  assert.equal(store.getReadingProgress('page-1'), 100);

  store.setReadingProgress('page-1', -20);
  assert.equal(store.getReadingProgress('page-1'), 0);
});

test('User Store & LocalStorage: Todo completion state and toggle', () => {
  const storage = new MockStorage();
  const store = createUserStore(storage);

  assert.equal(store.isTodoCompleted('todo-1', false), false);
  assert.equal(store.isTodoCompleted('todo-1', true), true); // default fallback

  store.toggleTodo('todo-1');
  assert.equal(store.isTodoCompleted('todo-1'), true);

  store.setTodoCompleted('todo-1', false);
  assert.equal(store.isTodoCompleted('todo-1'), false);
});

test('User Store & LocalStorage: Theme and preference updates', () => {
  const storage = new MockStorage();
  const store = createUserStore(storage);

  assert.equal(store.getState().preferences.theme, 'system');
  store.updatePreferences({ theme: 'dark' });
  assert.equal(store.getState().preferences.theme, 'dark');

  const reloaded = createUserStore(storage);
  assert.equal(reloaded.getState().preferences.theme, 'dark');

  store.resetUserData();
  assert.equal(store.getState().preferences.theme, 'system');
  assert.deepEqual(store.getState().favorites, []);
});
