import type { Meta, StoryObj } from '@storybook/react';
import { message } from '../src/components/enhance-ui/Message';
import { Button } from '../src/components/enhance-ui/Button';
import { Toaster } from '../src/components/ui/sonner';

const meta: Meta = {
  title: 'Enhanced UI/Message',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Types: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Toaster />
      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => message.success('Success message')}>
          Success
        </Button>
        <Button onClick={() => message.error('Error message')}>Error</Button>
        <Button onClick={() => message.warning('Warning message')}>
          Warning
        </Button>
        <Button onClick={() => message.info('Info message')}>Info</Button>
      </div>
    </div>
  ),
};

export const Loading: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Toaster />
      <Button onClick={() => message.loading('Loading for 3s...')}>
        Default Loading (3s)
      </Button>
    </div>
  ),
};

export const ManualUpdate: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Toaster />
      <Button
        onClick={() => {
          const key = 'updatable';
          message.loading({ content: 'Loading...', key }, 0);
          setTimeout(() => {
            message.success({ content: 'Loaded!', key, duration: 2 });
          }, 2000);
        }}
      >
        Open then update
      </Button>
    </div>
  ),
};

export const WithOnClose: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Toaster />
      <Button
        onClick={() => {
          message.info('This will close in 2s', 2, () => {
            console.log('Message closed');
            alert('Message closed callback');
          });
        }}
      >
        With OnClose Callback
      </Button>
    </div>
  ),
};
