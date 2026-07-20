/**
 * Textarea - Atom
 * One-line description.
 * Used in: TBD
 */
import React from 'react';
import type { TextareaProps } from './Textarea.types';

export const Textarea: React.FC<TextareaProps> = (props) => {
  return (
    <div className="p-4" data-testid="Textarea">
      Textarea Component
    </div>
  );
};
