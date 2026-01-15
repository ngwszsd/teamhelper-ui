import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '../src/components/ui/spinner';

const meta: Meta<typeof Spinner> = {
  title: 'UI/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    spinning: {
      control: 'boolean',
      description: '是否处于加载状态',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    className: {
      control: 'text',
      description: '额外的 CSS 类名',
    },
    children: {
      control: 'text',
      description: 'Spinner 的子元素',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    spinning: true,
  },
};

export const NotSpinning: Story = {
  args: {
    spinning: false,
    children: <div>Content Loaded</div>,
  },
};

export const WithChildren: Story = {
  args: {
    spinning: true,
    children: <div className="opacity-50">Loading Content...</div>,
  },
};
