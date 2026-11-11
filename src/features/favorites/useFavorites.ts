import { useCallback } from 'react';
import { useUserStore, userStore } from '../../stores/userStore';

export function useFavorites() {
  const favorites = useUserStore((state) => state.favorites);

  const isFavorite = useCallback(
    (pageId: string) => {
      return favorites.includes(pageId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback((pageId: string) => {
    userStore.getState().toggleFavorite(pageId);
  }, []);

  const addFavorite = useCallback((pageId: string) => {
    userStore.getState().addFavorite(pageId);
  }, []);

  const removeFavorite = useCallback((pageId: string) => {
    userStore.getState().removeFavorite(pageId);
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
  };
}
