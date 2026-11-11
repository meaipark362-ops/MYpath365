/**
 * Lightweight React Store creation function (compatible with Zustand patterns without external runtime dependency if bundle is uninstalled).
 */
type Listener<T> = (state: T, prevState: T) => void;

export interface StoreApi<T> {
  getState: () => T;
  setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => void;
  subscribe: (listener: Listener<T>) => () => void;
}

export function createStore<T extends object>(initialState: T): StoreApi<T> {
  let state = initialState;
  const listeners = new Set<Listener<T>>();

  return {
    getState: () => state,
    setState: (partial) => {
      const nextState =
        typeof partial === 'function'
          ? Object.assign({}, state, (partial as (s: T) => Partial<T>)(state))
          : Object.assign({}, state, partial);

      if (nextState !== state) {
        const prevState = state;
        state = nextState;
        listeners.forEach((listener) => listener(state, prevState));
      }
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
