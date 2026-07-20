import { render, screen } from '@testing-library/react';
import { AppShell } from './AppShell';

describe('AppShell', () => {
  it('renders correctly', () => {
    render(<AppShell />);
    expect(screen.getByTestId('AppShell')).toBeInTheDocument();
  });
});
