/**
 * SiteHeader - Organism
 * One-line description.
 * Used in: TBD
 */
import React from 'react';
import type { SiteHeaderProps } from './SiteHeader.types';

export const SiteHeader: React.FC<SiteHeaderProps> = (props) => {
  return (
    <div className="p-4" data-testid="SiteHeader">
      SiteHeader Component
    </div>
  );
};
