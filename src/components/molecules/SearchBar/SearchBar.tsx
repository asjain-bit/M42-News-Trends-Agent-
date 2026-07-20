/**
 * SearchBar - Molecule
 * One-line description.
 * Used in: TBD
 */
import React from 'react';
import type { SearchBarProps } from './SearchBar.types';

export const SearchBar: React.FC<SearchBarProps> = (props) => {
  return (
    <div className="p-4" data-testid="SearchBar">
      SearchBar Component
    </div>
  );
};
