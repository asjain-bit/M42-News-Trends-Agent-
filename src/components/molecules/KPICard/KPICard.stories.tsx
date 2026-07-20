import type { Meta, StoryObj } from '@storybook/react';
import { KPICard } from './KPICard';

const meta: Meta<typeof KPICard> = {
  title: 'Molecules/KPICard',
  component: KPICard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KPICard>;

export const Default: Story = {
  args: {},
};

export const EdgeCases: Story = {
  args: {},
};
