import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '../src/components/ui/progress';

const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'The progress value.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 60,
    className: 'w-75',
  },
  render: (args) => <Progress {...args} className="w-75" />,
};
