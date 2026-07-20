import { render, screen } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('renders correctly', () => {
    render(<SearchBar />);
    expect(screen.getByTestId('SearchBar')).toBeInTheDocument();
  });
});
