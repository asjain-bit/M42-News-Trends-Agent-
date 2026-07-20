/**
 * AppDialog - Molecule
 * One-line description.
 * Used in: TBD
 */
import React from 'react';
import type { AppDialogProps } from './AppDialog.types';

export const AppDialog: React.FC<AppDialogProps> = (props) => {
  return (
    <div className="p-4" data-testid="AppDialog">
      AppDialog Component
    </div>
  );
};
