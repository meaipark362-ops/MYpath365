import React from 'react';
import styles from './IconButton.module.css';
import { ComponentSize } from './Button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  'aria-label': string; // Enforce accessible label for screen readers
  size?: ComponentSize;
  variant?: 'ghost' | 'secondary' | 'outline';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      'aria-label': ariaLabel,
      size = 'md',
      variant = 'ghost',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const classNames = [
      styles.iconButton,
      styles[`size-${size}`],
      styles[`variant-${variant}`],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={props.type || 'button'}
        className={classNames}
        aria-label={ariaLabel}
        disabled={disabled}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
