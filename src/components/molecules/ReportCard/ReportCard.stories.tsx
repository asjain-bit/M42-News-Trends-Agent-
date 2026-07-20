import type { Meta, StoryObj } from '@storybook/react';
import { ReportCard } from './ReportCard';

const meta: Meta<typeof ReportCard> = {
  component: ReportCard,
};
export default meta;
type Story = StoryObj<typeof ReportCard>;

export const Default: Story = {};