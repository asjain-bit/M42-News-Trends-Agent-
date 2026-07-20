import React from 'react';
import { render } from '@testing-library/react';
import { AuthLayout } from './AuthLayout';

describe('AuthLayout', () => {
  it('renders correctly', () => {
    render(<AuthLayout />);
  });
});