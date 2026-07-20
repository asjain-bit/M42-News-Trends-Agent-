import { render, screen } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('renders correctly', () => {
    render(<ThemeToggle />);
    expect(screen.getByTestId('ThemeToggle')).toBeInTheDocument();
  });
});
