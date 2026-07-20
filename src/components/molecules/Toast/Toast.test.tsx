import { render, screen } from '@testing-library/react';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders correctly', () => {
    render(<Toast />);
    expect(screen.getByTestId('Toast')).toBeInTheDocument();
  });
});
