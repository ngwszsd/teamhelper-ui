import type { Meta, StoryObj } from '@storybook/react';
import { DatePickerBase } from '../src/components/ui/date-picker';

const meta: Meta<typeof DatePickerBase> = {
  title: 'UI/DatePickerBase',
  component: DatePickerBase,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatePickerBase>;

export const Default: Story = {
  render: (args) => <DatePickerBase />,
};
