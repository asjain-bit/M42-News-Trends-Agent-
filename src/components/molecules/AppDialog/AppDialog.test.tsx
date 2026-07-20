import { render, screen } from '@testing-library/react';
import { AppDialog } from './AppDialog';

describe('AppDialog', () => {
  it('renders correctly', () => {
    render(<AppDialog />);
    expect(screen.getByTestId('AppDialog')).toBeInTheDocument();
  });
});
