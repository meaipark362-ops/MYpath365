import { useEffect, useRef } from 'react';

export interface ShortcutOptions {
  ctrlOrCmd?: boolean;
  shift?: boolean;
  alt?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  ignoreInInputs?: boolean;
}

/**
 * Custom hook to register keyboard shortcuts (e.g. Cmd+K / Ctrl+K, Escape)
 * Automatically respects form elements when ignoreInInputs is true (default for non-escape/non-cmd shortcuts)
 */
export function useKeyboardShortcut(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options: ShortcutOptions = {}
) {
  const {
    ctrlOrCmd = false,
    shift = false,
    alt = false,
    preventDefault = true,
    stopPropagation = false,
    ignoreInInputs = true,
  } = options;

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      // If user is typing in an input, ignore normal shortcuts unless ctrl/cmd is pressed or key is Escape
      if (isInput && ignoreInInputs && !ctrlOrCmd && event.key.toLowerCase() !== 'escape') {
        return;
      }

      const matchKey = event.key.toLowerCase() === key.toLowerCase();
      const matchCtrlOrCmd = ctrlOrCmd ? event.metaKey || event.ctrlKey : true;
      const matchShift = shift ? event.shiftKey : !event.shiftKey;
      const matchAlt = alt ? event.altKey : !event.altKey;

      if (matchKey && matchCtrlOrCmd && matchShift && matchAlt) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        callbackRef.current(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, ctrlOrCmd, shift, alt, preventDefault, stopPropagation, ignoreInInputs]);
}
