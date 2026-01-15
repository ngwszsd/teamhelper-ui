import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedSpinner } from '../src/components/enhance-ui/Spinner';
import { Loader2 } from 'lucide-react';

const meta: Meta<typeof EnhancedSpinner> = {
  title: 'Enhanced UI/Spinner',
  component: EnhancedSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
    },
    spinning: {
      control: 'boolean',
    },
    tip: {
      control: 'text',
    },
    delay: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof EnhancedSpinner>;

export const Default: Story = {
  args: {
    spinning: true,
  },
};

export const WithTip: Story = {
  args: {
    spinning: true,
    tip: 'Loading...',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-8">
      <EnhancedSpinner {...args} size="small" tip="Small" />
      <EnhancedSpinner {...args} size="default" tip="Default" />
      <EnhancedSpinner {...args} size="large" tip="Large" />
    </div>
  ),
};

export const CustomIndicator: Story = {
  args: {
    spinning: true,
    indicator: <Loader2 className="h-8 w-8 animate-spin text-blue-500" />,
    tip: 'Custom Indicator',
  },
};

export const WithChildren: Story = {
  args: {
    spinning: true,
    tip: 'Loading...',
  },
  render: (args) => (
    <EnhancedSpinner {...args}>
      <div className="p-8 border rounded-md bg-muted/20 w-[400px]">
        <h3 className="text-lg font-medium mb-2">Content Title</h3>
        <p className="text-sm text-muted-foreground">
          This content is currently being loaded. You can still see it with
          reduced opacity while the spinner is active.
        </p>
      </div>
    </EnhancedSpinner>
  ),
};

export const WithDelay: Story = {
  args: {
    spinning: true,
    delay: 1000,
    tip: 'Delayed (1s)',
  },
  render: (args) => (
    <EnhancedSpinner {...args}>
      <div className="p-8 border rounded-md bg-muted/20 w-[400px]">
        <p>The spinner will appear after 1 second if spinning is true.</p>
      </div>
    </EnhancedSpinner>
  ),
};
