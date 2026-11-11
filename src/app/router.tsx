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

export const getBasePath = (): string => {
  if (typeof window === 'undefined') return '';
  const segments = window.location.pathname.split('/').filter(Boolean);
  const knownRoots = ['search', 'settings', 'favorites', 'page'];
  if (segments.length > 0 && !knownRoots.includes(segments[0])) {
    return '/' + segments[0];
  }
  return '';
};

export const normalizePath = (rawPath: string, basePath: string): string => {
  if (basePath && rawPath.startsWith(basePath)) {
    const stripped = rawPath.slice(basePath.length);
    return stripped.startsWith('/') ? stripped : '/' + stripped;
  }
  return rawPath || '/';
};

export const Link: React.FC<LinkProps> = ({ to, className, children, onClick, ...rest }) => {
  const { navigate } = useRouter();
  const basePath = getBasePath();
  const resolvedHref = basePath ? `${basePath}${to.startsWith('/') ? to : '/' + to}` : to;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={resolvedHref} className={className} onClick={handleClick} {...rest}>
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
  const basePath = getBasePath();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname || '/', basePath);
    }
    return '/';
  });

  const navigate = (to: string) => {
    if (typeof window !== 'undefined') {
      const fullTarget = basePath ? `${basePath}${to.startsWith('/') ? to : '/' + to}` : to;
      if (window.location.pathname !== fullTarget) {
        window.history.pushState({}, '', fullTarget);
      }
      setCurrentPath(to);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname || '/', basePath));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [basePath]);

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
