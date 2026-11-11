import React from 'react';
import type { TableBlockData, ContentBlockProps } from '../types';
import { RichText } from '../RichText';
import styles from './Blocks.module.css';

export const TableBlock: React.FC<ContentBlockProps<TableBlockData>> = ({ block }) => {
  const rows = block.rows || [];
  if (rows.length === 0) return null;

  const hasColHeader = Boolean(block.hasColumnHeader);
  const hasRowHeader = Boolean(block.hasRowHeader);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <tbody>
          {rows.map((row, rowIndex) => {
            const isHeaderRow = hasColHeader && rowIndex === 0;

            return (
              <tr key={rowIndex}>
                {row.cells.map((cellRichText, colIndex) => {
                  const isHeaderCell = isHeaderRow || (hasRowHeader && colIndex === 0);

                  if (isHeaderCell) {
                    return (
                      <th key={colIndex} className={styles.th} scope={isHeaderRow ? 'col' : 'row'}>
                        <RichText richText={cellRichText} />
                      </th>
                    );
                  }

                  return (
                    <td key={colIndex} className={styles.td}>
                      <RichText richText={cellRichText} />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
