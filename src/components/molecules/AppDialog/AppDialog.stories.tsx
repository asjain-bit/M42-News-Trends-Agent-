import type { Meta, StoryObj } from '@storybook/react';
import { AppDialog } from './AppDialog';

const meta: Meta<typeof AppDialog> = {
  title: 'Molecules/AppDialog',
  component: AppDialog,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppDialog>;

export const Default: Story = {
  args: {},
};

export const EdgeCases: Story = {
  args: {},
};
