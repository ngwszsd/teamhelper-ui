import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedSlider } from '../src/components/enhance-ui/Slider';

const meta: Meta<typeof EnhancedSlider> = {
  title: 'Enhanced UI/Slider',
  component: EnhancedSlider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    vertical: { control: 'boolean' },
    range: { control: 'boolean' },
    dots: { control: 'boolean' },
    showMarkText: { control: 'boolean' },
    showMarkDot: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof EnhancedSlider>;

export const Default: Story = {
  args: {
    defaultValue: [30],
    className: 'w-[300px]',
  },
};

export const Range: Story = {
  args: {
    range: true,
    defaultValue: [20, 50],
    className: 'w-[300px]',
  },
};

export const WithMarks: Story = {
  args: {
    defaultValue: [30],
    className: 'w-[300px] mt-8',
    marks: {
      0: '0°C',
      26: '26°C',
      37: '37°C',
      100: {
        style: { color: '#f50' },
        label: <strong>100°C</strong>,
      },
    },
    showMarkText: true,
    showMarkDot: true,
  },
};

export const WithDots: Story = {
  args: {
    defaultValue: [30],
    className: 'w-[300px]',
    step: 10,
    dots: true,
    min: 0,
    max: 100,
  },
};

export const Vertical: Story = {
  args: {
    vertical: true,
    defaultValue: [30],
    className: 'h-[300px]',
    marks: {
      0: '0°C',
      26: '26°C',
      37: '37°C',
      100: {
        style: { color: '#f50' },
        label: <strong>100°C</strong>,
      },
    },
    showMarkText: true,
    showMarkDot: true,
  },
  render: (args) => (
    <div className="h-[300px] flex items-center justify-center p-8">
      <EnhancedSlider {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: [30],
    disabled: true,
    className: 'w-[300px]',
  },
};
