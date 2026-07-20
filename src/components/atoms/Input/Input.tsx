/**
 * Input - Atom
 * One-line description.
 * Used in: TBD
 */
import React from 'react';
import type { InputProps } from './Input.types';

export const Input: React.FC<InputProps> = (props) => {
  return (
    <div className="p-4" data-testid="Input">
      Input Component
    </div>
  );
};
