/**
 * DataTable - Organism
 * One-line description.
 * Used in: TBD
 */
import React from 'react';
import type { DataTableProps } from './DataTable.types';

export const DataTable: React.FC<DataTableProps> = (props) => {
  return (
    <div className="p-4" data-testid="DataTable">
      DataTable Component
    </div>
  );
};
