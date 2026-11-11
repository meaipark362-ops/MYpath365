/**
 * MyPath365 Media Optimizer & Responsive Helpers
 * Provides aspect ratio computations, srcset generation, and blur placeholder helpers.
 */

export interface MediaDimensions {
  width: number;
  height: number;
  aspectRatio: string;
}

export interface ResponsiveImageSource {
  srcSet: string;
  sizes?: string;
  type?: string;
}

export class MediaOptimizer {
  /**
   * Computes standard CSS aspect-ratio string from width and height
   */
  public static calculateAspectRatio(width: number, height: number): string {
    if (!width || !height || height === 0) return 'auto';
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    return `${width / divisor} / ${height / divisor}`;
  }

  /**
   * Generates responsive srcset attribute if a dynamic resizing endpoint (e.g. Unsplash, CDN, or local proxy) is available.
   * If static local image, provides standard 1x / 2x descriptor set if available.
   */
  public static generateSrcSet(url: string, widths: number[] = [480, 768, 1024, 1440]): string {
    if (!url) return '';
    // If URL has query params supporting width parameter (like unsplash or cloudflare)
    if (url.includes('images.unsplash.com') || url.includes('w=')) {
      return widths
        .map((w) => {
          const sep = url.includes('?') ? '&' : '?';
          // Replace existing w parameter or append
          const replaced = url.replace(/([?&])w=\d+/, `$1w=${w}`);
          const targetUrl = replaced.includes('w=') ? replaced : `${url}${sep}w=${w}`;
          return `${targetUrl} ${w}w`;
        })
        .join(', ');
    }

    // Default return
    return `${url} 1x`;
  }

  /**
   * Standard default sizes attribute for content images matching MyPath365 layout
   */
  public static getDefaultSizes(): string {
    return '(max-width: 768px) 100vw, (max-width: 1200px) 720px, 720px';
  }

  /**
   * Determines default placeholder background color based on theme
   */
  public static getDefaultPlaceholderColor(isDark: boolean = false): string {
    return isDark ? '#18191d' : '#f6f6f3';
  }
}
