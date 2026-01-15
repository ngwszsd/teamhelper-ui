import type { Meta, StoryObj } from '@storybook/react';
import DatePicker from '../src/components/enhance-ui/DatePicker';
import { useState } from 'react';

const meta: Meta<typeof DatePicker> = {
  title: 'Enhanced UI/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    placeholder: 'Select date',
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [date, setDate] = useState<string | undefined>();
    return (
      <div className="flex flex-col gap-4">
        <DatePicker
          {...args}
          value={date}
          onChange={setDate}
          placeholder="Controlled Picker"
        />
        <div>Selected: {date}</div>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: '2024-01-01',
  },
};

export const WithClear: Story = {
  args: {
    allowClear: true,
    defaultValue: '2024-01-01',
  },
};

export const RangePicker: Story = {
  render: (args) => <DatePicker.RangePicker />,
};
