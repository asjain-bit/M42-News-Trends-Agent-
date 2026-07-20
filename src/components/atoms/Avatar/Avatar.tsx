/**
 * Avatar - Atom
 * One-line description.
 * Used in: TBD
 */
import React from 'react';
import type { AvatarProps } from './Avatar.types';

export const Avatar: React.FC<AvatarProps> = (props) => {
  return (
    <div className="p-4" data-testid="Avatar">
      Avatar Component
    </div>
  );
};
