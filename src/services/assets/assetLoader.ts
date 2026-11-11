/**
 * MyPath365 Asset Loader Service
 * Implements IAssetLoader Contract (Section 6 of interface-contracts.md)
 */

import React from 'react';
import { ASSET_MANIFEST, INLINE_DATA_URI_PLACEHOLDERS, type PlaceholderType } from './manifest';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: string; // e.g. "16/9"
  lazy?: boolean;
  fallbackSrc?: string;
  placeholderColor?: string;
  placeholderType?: PlaceholderType;
  caption?: string;
}

export interface IAssetLoader {
  resolveAssetUrl(path: string): string;
  getPlaceholderForType(type: 'cover' | 'avatar' | 'inline' | 'video' | 'broken'): string;
}

export class AssetLoader implements IAssetLoader {
  private basePrefix: string;

  constructor(basePrefix: string = '') {
    // Normalizes base path if hosted on subdirectory (e.g. GitHub Pages or custom base)
    this.basePrefix = basePrefix.endsWith('/') ? basePrefix.slice(0, -1) : basePrefix;
  }

  /**
   * Resolves any asset path safely.
   * Handles absolute URLs, relative URLs, data URIs, and local public paths.
   */
  public resolveAssetUrl(path: string): string {
    if (!path || typeof path !== 'string') {
      return this.getPlaceholderForType('inline');
    }

    const trimmed = path.trim();

    // Data URI or protocol-relative/absolute URLs
    if (
      trimmed.startsWith('data:') ||
      trimmed.startsWith('blob:') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('//')
    ) {
      return trimmed;
    }

    // Relative public assets
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${this.basePrefix}${cleanPath}`;
  }

  /**
   * Returns standard SVG placeholder path for given asset type.
   */
  public getPlaceholderForType(type: 'cover' | 'avatar' | 'inline' | 'video' | 'broken'): string {
    return ASSET_MANIFEST.placeholders[type] || ASSET_MANIFEST.placeholders.inline;
  }

  /**
   * Returns guaranteed zero-network inline data URI fallback.
   * Crucial for offline or network timeout fallback without extra HTTP requests.
   */
  public getInlineDataUriPlaceholder(type: PlaceholderType): string {
    return INLINE_DATA_URI_PLACEHOLDERS[type] || INLINE_DATA_URI_PLACEHOLDERS.inline;
  }

  /**
   * Validates if a media/asset file extension is supported.
   */
  public isSupportedImage(path: string): boolean {
    const extMatch = path.split('?')[0].match(/\.([a-z0-9]+)$/i);
    if (!extMatch) return false;
    const ext = extMatch[1].toLowerCase();
    return ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'avif', 'ico'].includes(ext);
  }

  /**
   * Validates video format.
   */
  public isSupportedVideo(path: string): boolean {
    const extMatch = path.split('?')[0].match(/\.([a-z0-9]+)$/i);
    if (!extMatch) return false;
    const ext = extMatch[1].toLowerCase();
    return ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
  }
}

// Default Singleton instance
export const assetLoader = new AssetLoader();

// Functional helpers for straightforward importing
export const resolveAssetUrl = (path: string): string => assetLoader.resolveAssetUrl(path);
export const getPlaceholderForType = (type: 'cover' | 'avatar' | 'inline' | 'video' | 'broken'): string =>
  assetLoader.getPlaceholderForType(type);
export const getInlinePlaceholder = (type: PlaceholderType): string =>
  assetLoader.getInlineDataUriPlaceholder(type);
