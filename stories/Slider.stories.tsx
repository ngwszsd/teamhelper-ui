import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '../src/components/ui/slider';

const meta: Meta<typeof Slider> = {
  title: 'UI/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
    defaultValue: { control: 'object' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    className: 'w-[60%]',
  },
};

export const Range: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
    className: 'w-[60%]',
  },
};

export const WithMarks: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    className: 'w-[60%]',
    markContent: (
      <div className="absolute top-6 flex w-full justify-between px-2 text-xs text-muted-foreground">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="pb-8 pt-2">
        <Story />
      </div>
    ),
  ],
};
