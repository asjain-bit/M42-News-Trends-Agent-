import { render, screen } from '@testing-library/react';
import { SiteHeader } from './SiteHeader';

describe('SiteHeader', () => {
  it('renders correctly', () => {
    render(<SiteHeader />);
    expect(screen.getByTestId('SiteHeader')).toBeInTheDocument();
  });
});
