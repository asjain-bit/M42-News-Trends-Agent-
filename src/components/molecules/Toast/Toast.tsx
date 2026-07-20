/**
 * Toast - Molecule
 * One-line description.
 * Used in: TBD
 */
import React from 'react';
import type { ToastProps } from './Toast.types';

export const Toast: React.FC<ToastProps> = (props) => {
  return (
    <div className="p-4" data-testid="Toast">
      Toast Component
    </div>
  );
};
