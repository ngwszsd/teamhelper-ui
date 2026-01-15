import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedAlert as Alert } from '../src/components/enhance-ui/Alert';
import { Terminal, AlertCircle } from 'lucide-react';

const meta: Meta<typeof Alert> = {
  title: 'Enhanced UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'error', 'warning'],
      description: 'Alert 类型',
    },
    showIcon: {
      control: 'boolean',
      description: '是否显示图标',
    },
    closable: {
      control: 'boolean',
      description: '是否可关闭',
    },
    title: {
      control: 'text',
      description: '标题',
    },
    description: {
      control: 'text',
      description: '描述内容',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    type: 'info',
    title: 'Tips',
    description: 'This is an info alert to display some useful information.',
    closable: true,
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    title: 'Warning',
    description: 'This is a warning alert. Please be careful.',
    closable: true,
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    title: 'Error',
    description: 'Something went wrong. Please try again.',
    closable: true,
  },
};

export const CustomIcon: Story = {
  args: {
    type: 'info',
    icon: <Terminal className="h-4 w-4" />,
    title: 'Terminal',
    description: 'You can add components to your app using the cli.',
  },
};

export const NoIcon: Story = {
  args: {
    type: 'info',
    showIcon: false,
    title: 'No Icon',
    description: 'This alert has no icon.',
  },
};

export const OnlyDescription: Story = {
  args: {
    type: 'info',
    description: 'This alert only has a description.',
  },
};
