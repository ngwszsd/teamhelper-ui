import type { Meta, StoryObj } from '@storybook/react';
import { Steps } from '../src/components/enhance-ui/Steps';
import { User, CreditCard, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof Steps> = {
  title: 'Enhanced UI/Steps',
  component: Steps,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Steps>;

const items = [
  {
    title: 'Login',
    description: 'Enter your credentials',
  },
  {
    title: 'Verification',
    description: 'Check your email',
  },
  {
    title: 'Complete',
    description: 'Setup your profile',
  },
];

export const Default: Story = {
  args: {
    current: 1,
    items,
    className: 'w-[600px]',
  },
};

export const Vertical: Story = {
  args: {
    current: 1,
    direction: 'vertical',
    items,
    className: 'h-[400px]',
  },
};

export const Small: Story = {
  args: {
    current: 1,
    size: 'small',
    items,
    className: 'w-[600px]',
  },
};

export const WithIcons: Story = {
  args: {
    current: 1,
    items: [
      {
        title: 'User',
        icon: <User className="w-4 h-4" />,
      },
      {
        title: 'Payment',
        icon: <CreditCard className="w-4 h-4" />,
      },
      {
        title: 'Done',
        icon: <CheckCircle className="w-4 h-4" />,
      },
    ],
    className: 'w-[600px]',
  },
};

export const ProgressDot: Story = {
  args: {
    current: 1,
    progressDot: true,
    items,
    className: 'w-[600px]',
  },
};

export const ErrorStatus: Story = {
  args: {
    current: 1,
    status: 'error',
    items,
    className: 'w-[600px]',
  },
};

export const Clickable = () => {
  const [current, setCurrent] = useState(0);
  return (
    <Steps
      current={current}
      onChange={setCurrent}
      items={items}
      className="w-[600px]"
    />
  );
};
