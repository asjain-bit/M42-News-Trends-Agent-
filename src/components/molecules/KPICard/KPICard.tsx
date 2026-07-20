/**
 * KPICard - Molecule
 * One-line description.
 * Used in: TBD
 */
import React from 'react';
import type { KPICardProps } from './KPICard.types';

export const KPICard: React.FC<KPICardProps> = (props) => {
  return (
    <div className="p-4" data-testid="KPICard">
      KPICard Component
    </div>
  );
};
