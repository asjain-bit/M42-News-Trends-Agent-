import { render, screen } from '@testing-library/react';
import { DataTable } from './DataTable';

describe('DataTable', () => {
  it('renders correctly', () => {
    render(<DataTable />);
    expect(screen.getByTestId('DataTable')).toBeInTheDocument();
  });
});
