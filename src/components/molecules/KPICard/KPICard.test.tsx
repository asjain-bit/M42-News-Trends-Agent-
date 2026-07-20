import { render, screen } from '@testing-library/react';
import { KPICard } from './KPICard';

describe('KPICard', () => {
  it('renders correctly', () => {
    render(<KPICard />);
    expect(screen.getByTestId('KPICard')).toBeInTheDocument();
  });
});
