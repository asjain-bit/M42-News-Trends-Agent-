import React from 'react';
import { render } from '@testing-library/react';
import { ReportCard } from './ReportCard';

describe('ReportCard', () => {
  it('renders correctly', () => {
    render(<ReportCard />);
  });
});