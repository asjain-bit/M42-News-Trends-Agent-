import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders correctly', () => {
    render(<Icon />);
    expect(screen.getByTestId('Icon')).toBeInTheDocument();
  });
});
