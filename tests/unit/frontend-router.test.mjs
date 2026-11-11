import test from 'node:test';
import assert from 'node:assert/strict';

function matchRoute(pattern, pathname) {
  const patternSegments = pattern.split('/').filter(Boolean);
  const pathSegments = pathname.split('/').filter(Boolean);

  if (pattern === '*' || pattern === '') {
    return {};
  }

  if (patternSegments.length !== pathSegments.length) {
    return null;
  }

  const params = {};
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

function resolveRoute(routes, fallback, pathname) {
  for (const route of routes) {
    const params = matchRoute(route.pattern, pathname);
    if (params) {
      return { component: route.name, params };
    }
  }
  return { component: fallback, params: {} };
}

test('Router & App Shell: Matches root and static routes', () => {
  const routes = [
    { pattern: '/', name: 'HomePage' },
    { pattern: '/search', name: 'SearchPage' },
    { pattern: '/favorites', name: 'FavoritesPage' },
    { pattern: '/page/:slug', name: 'ContentPage' }
  ];

  assert.deepEqual(resolveRoute(routes, 'NotFoundPage', '/'), {
    component: 'HomePage',
    params: {}
  });

  assert.deepEqual(resolveRoute(routes, 'NotFoundPage', '/search'), {
    component: 'SearchPage',
    params: {}
  });

  assert.deepEqual(resolveRoute(routes, 'NotFoundPage', '/favorites'), {
    component: 'FavoritesPage',
    params: {}
  });
});

test('Router & App Shell: Extracts dynamic parameters', () => {
  const routes = [
    { pattern: '/page/:slug', name: 'ContentPage' }
  ];

  const res = resolveRoute(routes, 'NotFoundPage', '/page/welcome-unconfirmed-migration');
  assert.equal(res.component, 'ContentPage');
  assert.equal(res.params.slug, 'welcome-unconfirmed-migration');

  // Encoded characters
  const resEncoded = resolveRoute(routes, 'NotFoundPage', '/page/%ED%95%9C%EA%B8%80%ED%8E%98%EC%9D%B4%EC%A7%80');
  assert.equal(resEncoded.params.slug, '한글페이지');
});

test('Router & App Shell: Falls back to NotFoundPage on unmatched routes', () => {
  const routes = [
    { pattern: '/', name: 'HomePage' },
    { pattern: '/page/:slug', name: 'ContentPage' }
  ];

  const res = resolveRoute(routes, 'NotFoundPage', '/non-existent-subpath/extra/segments');
  assert.equal(res.component, 'NotFoundPage');
  assert.deepEqual(res.params, {});
});
