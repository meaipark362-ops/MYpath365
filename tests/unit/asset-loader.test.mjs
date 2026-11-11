import test from 'node:test';
import assert from 'node:assert/strict';

const ASSET_MANIFEST = {
  placeholders: {
    cover: '/assets/placeholders/placeholder-cover.svg',
    avatar: '/assets/placeholders/placeholder-avatar.svg',
    inline: '/assets/placeholders/placeholder-inline.svg',
    video: '/assets/placeholders/placeholder-video.svg',
    broken: '/assets/placeholders/placeholder-broken.svg',
  }
};

class AssetLoader {
  constructor(basePrefix = '') {
    this.basePrefix = basePrefix.endsWith('/') ? basePrefix.slice(0, -1) : basePrefix;
  }

  resolveAssetUrl(path) {
    if (!path || typeof path !== 'string') {
      return this.getPlaceholderForType('inline');
    }

    const trimmed = path.trim();

    if (
      trimmed.startsWith('data:') ||
      trimmed.startsWith('blob:') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('//')
    ) {
      return trimmed;
    }

    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${this.basePrefix}${cleanPath}`;
  }

  getPlaceholderForType(type) {
    return ASSET_MANIFEST.placeholders[type] || ASSET_MANIFEST.placeholders.inline;
  }

  isSupportedImage(path) {
    const extMatch = path.split('?')[0].match(/\.([a-z0-9]+)$/i);
    if (!extMatch) return false;
    const ext = extMatch[1].toLowerCase();
    return ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'avif', 'ico'].includes(ext);
  }

  isSupportedVideo(path) {
    const extMatch = path.split('?')[0].match(/\.([a-z0-9]+)$/i);
    if (!extMatch) return false;
    const ext = extMatch[1].toLowerCase();
    return ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
  }
}

test('Asset Loader: Resolves external URLs untouched', () => {
  const loader = new AssetLoader();
  const httpsUrl = 'https://images.unsplash.com/photo-12345';
  assert.equal(loader.resolveAssetUrl(httpsUrl), httpsUrl);

  const dataUri = 'data:image/svg+xml;base64,PHN2Zz4=';
  assert.equal(loader.resolveAssetUrl(dataUri), dataUri);
});

test('Asset Loader: Resolves relative paths with base prefix', () => {
  const loaderWithBase = new AssetLoader('/mypath365/');
  assert.equal(loaderWithBase.resolveAssetUrl('assets/icons/logo.svg'), '/mypath365/assets/icons/logo.svg');
  assert.equal(loaderWithBase.resolveAssetUrl('/assets/icons/logo.svg'), '/mypath365/assets/icons/logo.svg');
});

test('Asset Loader: Fallbacks for empty or null paths', () => {
  const loader = new AssetLoader();
  assert.equal(loader.resolveAssetUrl(''), '/assets/placeholders/placeholder-inline.svg');
  assert.equal(loader.resolveAssetUrl(null), '/assets/placeholders/placeholder-inline.svg');
  assert.equal(loader.resolveAssetUrl(undefined), '/assets/placeholders/placeholder-inline.svg');
});

test('Asset Loader: Extension validation for images and videos', () => {
  const loader = new AssetLoader();
  assert.equal(loader.isSupportedImage('banner.webp'), true);
  assert.equal(loader.isSupportedImage('banner.PNG'), true);
  assert.equal(loader.isSupportedImage('banner.svg?v=2'), true);
  assert.equal(loader.isSupportedImage('document.pdf'), false);

  assert.equal(loader.isSupportedVideo('clip.mp4'), true);
  assert.equal(loader.isSupportedVideo('clip.webm'), true);
  assert.equal(loader.isSupportedVideo('clip.exe'), false);
});
