/**
 * Spinner - Atom
 * One-line description.
 * Used in: TBD
 */
import React from 'react';
import type { SpinnerProps } from './Spinner.types';

export const Spinner: React.FC<SpinnerProps> = (props) => {
  return (
    <div className="p-4" data-testid="Spinner">
      Spinner Component
    </div>
  );
};
