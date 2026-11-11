import type { RouteDefinition } from './router';
import { HomePage } from '../pages/HomePage';
import { ContentPage } from '../pages/ContentPage';
import { SearchPage } from '../pages/SearchPage';
import { SettingsPage } from '../pages/SettingsPage';
import { FavoritesPage } from '../pages/FavoritesPage';

export const routes: RouteDefinition[] = [
  {
    pattern: '/',
    component: HomePage,
  },
  {
    pattern: '/search',
    component: SearchPage,
  },
  {
    pattern: '/settings',
    component: SettingsPage,
  },
  {
    pattern: '/favorites',
    component: FavoritesPage,
  },
  {
    pattern: '/page/:slug',
    component: ContentPage as any,
  },
];
