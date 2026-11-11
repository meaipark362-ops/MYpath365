import { useState, useEffect } from 'react';

export interface ScrollPosition {
  x: number;
  y: number;
  progressY: number; // 0 to 100 percentage
}

export function useScrollPosition(targetRef?: React.RefObject<HTMLElement | null>): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    progressY: 0,
  });

  useEffect(() => {
    let ticking = false;

    const calculate = () => {
      if (targetRef && targetRef.current) {
        const el = targetRef.current;
        const totalHeight = el.scrollHeight - el.clientHeight;
        const progress = totalHeight > 0 ? Math.min(100, Math.max(0, (el.scrollTop / totalHeight) * 100)) : 0;
        setScrollPosition({
          x: el.scrollLeft,
          y: el.scrollTop,
          progressY: Math.round(progress),
        });
      } else {
        const docEl = document.documentElement;
        const totalHeight = docEl.scrollHeight - window.innerHeight;
        const currentY = window.scrollY || window.pageYOffset;
        const progress = totalHeight > 0 ? Math.min(100, Math.max(0, (currentY / totalHeight) * 100)) : 0;
        setScrollPosition({
          x: window.scrollX || window.pageXOffset,
          y: currentY,
          progressY: Math.round(progress),
        });
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(calculate);
        ticking = true;
      }
    };

    const target = targetRef?.current || window;
    target.addEventListener('scroll', handleScroll as EventListener, { passive: true });
    calculate();

    return () => {
      target.removeEventListener('scroll', handleScroll as EventListener);
    };
  }, [targetRef]);

  return scrollPosition;
}
