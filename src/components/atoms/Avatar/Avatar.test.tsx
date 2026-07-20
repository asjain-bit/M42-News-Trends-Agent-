import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders correctly', () => {
    render(<Avatar />);
    expect(screen.getByTestId('Avatar')).toBeInTheDocument();
  });
});
