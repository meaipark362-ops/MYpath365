import React, { useState, useEffect } from 'react';
import { resolveAssetUrl, getInlinePlaceholder, type OptimizedImageProps } from './assetLoader';
import { MediaOptimizer } from './mediaOptimizer';

export interface SafeImageProps extends OptimizedImageProps {
  className?: string;
  wrapperClassName?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoadSuccess?: () => void;
  onLoadError?: (error: unknown) => void;
  showCaption?: boolean;
}

/**
 * SafeImage Component
 * Handles lazy loading, skeleton placeholder state, graceful error fallback to SVG Data URI,
 * alt text, captioning, and responsive aspect ratio.
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  aspectRatio,
  lazy = true,
  fallbackSrc,
  placeholderColor,
  placeholderType = 'inline',
  caption,
  showCaption = true,
  className = '',
  wrapperClassName = '',
  objectFit = 'cover',
  onLoadSuccess,
  onLoadError,
  style,
  ...rest
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(() => resolveAssetUrl(src));
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const resolved = resolveAssetUrl(src);
    setCurrentSrc(resolved);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      // Fallback chain: fallbackSrc -> SVG placeholder file -> guaranteed inline SVG data URI
      const nextSrc = fallbackSrc || getInlinePlaceholder(placeholderType);
      setCurrentSrc(nextSrc);
      if (onLoadError) onLoadError(e);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoadSuccess) onLoadSuccess();
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: placeholderColor || 'var(--bg-secondary, #f6f6f3)',
    borderRadius: 'var(--radius-md, 10px)',
    aspectRatio: aspectRatio || undefined,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: objectFit,
    transition: 'opacity 0.25s ease-in-out',
    opacity: isLoaded ? 1 : 0,
    ...style,
  };

  const skeletonStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--bg-surface, #fbfbfa)',
    opacity: isLoaded ? 0 : 1,
    pointerEvents: 'none',
    transition: 'opacity 0.25s ease-in-out',
  };

  const captionStyle: React.CSSProperties = {
    marginTop: '0.5rem',
    fontSize: 'var(--text-sm, 0.875rem)',
    color: 'var(--text-secondary, #747b85)',
    textAlign: 'center',
    lineHeight: 1.4,
  };

  return (
    <figure style={{ margin: 0, width: '100%' }} className={wrapperClassName}>
      <div style={containerStyle}>
        {!isLoaded && <div style={skeletonStyle} aria-hidden="true" />}
        <img
          src={currentSrc}
          alt={alt || 'Image'}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={imageStyle}
          className={className}
          sizes={MediaOptimizer.getDefaultSizes()}
          {...rest}
        />
      </div>
      {showCaption && caption && (
        <figcaption style={captionStyle}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
