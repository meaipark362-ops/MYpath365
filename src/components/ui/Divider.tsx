import React from 'react';
import styles from './Divider.module.css';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  emphasis?: 'subtle' | 'medium';
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  emphasis = 'subtle',
  className,
  ...props
}) => {
  const classNames = [
    styles.divider,
    styles[orientation],
    styles[emphasis],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <hr className={classNames} aria-orientation={orientation} {...props} />;
};
