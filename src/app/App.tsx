import React, { useEffect } from 'react';
import { Router } from './router';
import { routes } from './routes';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ErrorBoundary } from './ErrorBoundary';
import { userStore } from '../stores/userStore';

export const App: React.FC = () => {
  // Sync initial theme preference
  useEffect(() => {
    const prefs = userStore.getState().preferences;
    if (prefs.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (prefs.theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  return (
    <ErrorBoundary>
      <Router routes={routes} fallback={NotFoundPage} />
    </ErrorBoundary>
  );
};

export default App;
