import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '../src/components/ui/calendar';
import { useState } from 'react';

const meta: Meta<typeof Calendar> = {
  title: 'UI/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <Calendar
        {...args}
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow"
      />
    );
  },
};

export const Multiple: Story = {
  render: (args) => {
    const [days, setDays] = useState<Date[] | undefined>([new Date()]);
    return (
      <Calendar
        {...args}
        mode="multiple"
        selected={days}
        onSelect={setDays}
        className="rounded-md border shadow"
      />
    );
  },
};
