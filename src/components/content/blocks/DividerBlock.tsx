import React from 'react';
import type { DividerBlockData, ContentBlockProps } from '../types';
import styles from './Blocks.module.css';

export const DividerBlock: React.FC<ContentBlockProps<DividerBlockData>> = () => {
  return <hr className={styles.divider} />;
};
