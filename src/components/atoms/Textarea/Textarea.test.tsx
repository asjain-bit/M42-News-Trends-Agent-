import { render, screen } from '@testing-library/react';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders correctly', () => {
    render(<Textarea />);
    expect(screen.getByTestId('Textarea')).toBeInTheDocument();
  });
});
