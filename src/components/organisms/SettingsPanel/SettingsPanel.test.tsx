import { render, screen } from '@testing-library/react';
import { SettingsPanel } from './SettingsPanel';

describe('SettingsPanel', () => {
  it('renders correctly', () => {
    render(<SettingsPanel />);
    expect(screen.getByTestId('SettingsPanel')).toBeInTheDocument();
  });
});
