import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../src/components/enhance-ui/Badge';
import { Mail } from 'lucide-react';

const meta: Meta<typeof Badge> = {
  title: 'Enhanced UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['success', 'processing', 'default', 'error', 'warning'],
      description: '状态点类型',
    },
    count: {
      control: 'number',
      description: '展示的数字',
    },
    overflowCount: {
      control: 'number',
      description: '封顶数字',
    },
    dot: {
      control: 'boolean',
      description: '不展示数字，只有一个小红点',
    },
    showZero: {
      control: 'boolean',
      description: '当数值为 0 时，是否展示 Badge',
    },
    size: {
      control: 'radio',
      options: ['default', 'small'],
      description: '尺寸',
    },
    color: {
      control: 'color',
      description: '自定义小圆点的颜色',
    },
    text: {
      control: 'text',
      description: '状态点模式下的文本',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    count: 5,
    children: <div className="w-10 h-10 bg-slate-200 rounded-md" />,
  },
};

export const Status: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Badge {...args} status="success" text="Success" />
      <Badge {...args} status="processing" text="Processing" />
      <Badge {...args} status="default" text="Default" />
      <Badge {...args} status="error" text="Error" />
      <Badge {...args} status="warning" text="Warning" />
    </div>
  ),
};

export const Dot: Story = {
  args: {
    dot: true,
    children: <Mail className="h-6 w-6" />,
  },
};

export const Overflow: Story = {
  args: {
    count: 100,
    overflowCount: 99,
    children: <div className="w-10 h-10 bg-slate-200 rounded-md" />,
  },
};

export const Standalone: Story = {
  args: {
    count: 25,
    className: 'bg-blue-500',
  },
  render: (args) => <Badge {...args} />,
};

export const Small: Story = {
  args: {
    count: 5,
    size: 'small',
    children: <div className="w-8 h-8 bg-slate-200 rounded-md" />,
  },
};
