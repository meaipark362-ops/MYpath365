import React, { createContext, useContext, useState, useEffect } from 'react';

export interface RouteContextType {
  path: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}

const RouteContext = createContext<RouteContextType>({
  path: '/',
  navigate: () => {},
  params: {}
});

export const useRouter = () => useContext(RouteContext);

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  className?: string;
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ to, className, children, onClick, ...rest }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={to} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};

export interface RouteDefinition {
  pattern: string; // e.g. '/', '/search', '/settings', '/page/:slug', '/favorites'
  component: React.ComponentType<{ params: Record<string, string> }>;
}

export interface RouterProps {
  routes: RouteDefinition[];
  fallback: React.ComponentType<{ params: Record<string, string> }>;
}

function matchRoute(pattern: string, pathname: string): Record<string, string> | null {
  const patternSegments = pattern.split('/').filter(Boolean);
  const pathSegments = pathname.split('/').filter(Boolean);

  if (pattern === '*' || pattern === '') {
    return {};
  }

  if (patternSegments.length !== pathSegments.length) {
    return null;
  }

  const params: Record<string, string> = {};
  for (let i = 0; i < patternSegments.length; i++) {
    const pSeg = patternSegments[i];
    const actualSeg = pathSegments[i];
    if (pSeg.startsWith(':')) {
      const paramName = pSeg.slice(1);
      params[paramName] = decodeURIComponent(actualSeg);
    } else if (pSeg.toLowerCase() !== actualSeg.toLowerCase()) {
      return null;
    }
  }

  return params;
}

export const Router: React.FC<RouterProps> = ({ routes, fallback: FallbackComponent }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const navigate = (to: string) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== to) {
        window.history.pushState({}, '', to);
      }
      setCurrentPath(to);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Find matching route
  let matchedComponent: React.ComponentType<{ params: Record<string, string> }> | null = null;
  let matchedParams: Record<string, string> = {};

  for (const route of routes) {
    const params = matchRoute(route.pattern, currentPath);
    if (params) {
      matchedComponent = route.component;
      matchedParams = params;
      break;
    }
  }

  const ActiveComponent = matchedComponent || FallbackComponent;

  return (
    <RouteContext.Provider value={{ path: currentPath, navigate, params: matchedParams }}>
      <ActiveComponent params={matchedParams} />
    </RouteContext.Provider>
  );
};
