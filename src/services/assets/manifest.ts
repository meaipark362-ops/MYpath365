// Asset Manifest for MyPath365 static assets
export const ASSET_MANIFEST = {
  placeholders: {
    cover: '/assets/placeholders/placeholder-cover.svg',
    avatar: '/assets/placeholders/placeholder-avatar.svg',
    inline: '/assets/placeholders/placeholder-inline.svg',
    video: '/assets/placeholders/placeholder-video.svg',
    broken: '/assets/placeholders/placeholder-broken.svg',
  },
  icons: {
    logo: '/assets/icons/logo.svg',
    favicon: '/assets/icons/favicon.svg',
  },
  fonts: {
    css: '/assets/fonts/fonts.css',
  },
} as const;

export type PlaceholderType = 'cover' | 'avatar' | 'inline' | 'video' | 'broken';

/**
 * Lightweight inline SVG Data URIs for instant, zero-network fallback
 * Avoids any secondary network roundtrip when offline or asset is broken.
 */
export const INLINE_DATA_URI_PLACEHOLDERS: Record<PlaceholderType, string> = {
  cover: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="100%" height="100%"><rect width="100%" height="100%" fill="%231a1b20"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23747b85" font-family="sans-serif" font-size="28">Cover Image</text></svg>',
  avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%"><circle cx="100" cy="100" r="100" fill="%2326282e"/><circle cx="100" cy="80" r="35" fill="%238f949d"/><path d="M45 160 C45 130 70 125 100 125 C130 125 155 130 155 160 Z" fill="%238f949d"/></svg>',
  inline: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%"><rect width="100%" height="100%" rx="8" fill="%231c1e24"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23747b85" font-family="sans-serif" font-size="20">Image</text></svg>',
  video: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%"><rect width="100%" height="100%" rx="8" fill="%2316171b"/><polygon points="380,205 380,245 425,225" fill="%23f6f6f3"/></svg>',
  broken: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%"><rect width="100%" height="100%" fill="%23221b1c"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23f87171" font-family="sans-serif" font-size="16">Failed to load</text></svg>',
};
