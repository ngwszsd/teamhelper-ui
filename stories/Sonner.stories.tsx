import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from '../src/components/ui/sonner';
import { toast } from 'sonner';
import { Button } from '../src/components/ui/button';

const meta: Meta<typeof Toaster> = {
  title: 'UI/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
      description: 'Toast 显示的位置',
      table: {
        defaultValue: { summary: 'top-center' },
      },
    },
    theme: {
      control: 'select',
      options: ['light', 'dark', 'system'],
      description: 'Toast 的主题',
    },
    richColors: {
      control: 'boolean',
      description: '是否使用丰富颜色',
    },
    expand: {
      control: 'boolean',
      description: '是否展开',
    },
    closeButton: {
      control: 'boolean',
      description: '是否显示关闭按钮',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: (args) => (
    <div>
      <Toaster {...args} />
      <Button
        variant="outline"
        onClick={() =>
          toast('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM',
            action: {
              label: 'Undo',
              onClick: () => console.log('Undo'),
            },
          })
        }
      >
        Show Toast
      </Button>
    </div>
  ),
};

export const Success: Story = {
  render: (args) => (
    <div>
      <Toaster {...args} />
      <Button
        variant="outline"
        onClick={() => toast.success('Event has been created')}
      >
        Show Success Toast
      </Button>
    </div>
  ),
};

export const Error: Story = {
  render: (args) => (
    <div>
      <Toaster {...args} />
      <Button
        variant="destructive"
        onClick={() => toast.error('Something went wrong')}
      >
        Show Error Toast
      </Button>
    </div>
  ),
};

export const Info: Story = {
  render: (args) => (
    <div>
      <Toaster {...args} />
      <Button
        variant="outline"
        onClick={() => toast.info('New notification available')}
      >
        Show Info Toast
      </Button>
    </div>
  ),
};

export const Warning: Story = {
  render: (args) => (
    <div>
      <Toaster {...args} />
      <Button
        variant="outline"
        onClick={() => toast.warning('Please check your network')}
      >
        Show Warning Toast
      </Button>
    </div>
  ),
};
