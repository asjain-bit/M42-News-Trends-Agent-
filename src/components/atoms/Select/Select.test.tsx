import { render, screen } from '@testing-library/react';
import { Select } from './Select';

describe('Select', () => {
  it('renders correctly', () => {
    render(<Select />);
    expect(screen.getByTestId('Select')).toBeInTheDocument();
  });
});
