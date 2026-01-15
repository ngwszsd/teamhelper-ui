import type { Meta, StoryObj } from '@storybook/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../src/components/ui/tooltip';
import { Button } from '../src/components/ui/button';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithLongText: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me (Long)</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          This is a tooltip with a lot of text to demonstrate how it wraps and
          behaves with larger content.
        </p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithoutArrow: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <Button variant="outline">No Arrow</Button>
      </TooltipTrigger>
      <TooltipContent showArrow={false}>
        <p>This tooltip has no arrow</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const Controlled: Story = {
  render: (args) => (
    <TooltipProvider delayDuration={500}>
      <div className="flex gap-4">
        {/* Note: The default Tooltip component wraps itself in a TooltipProvider with 0 delay. 
            If you need custom delay, you might need to modify the Tooltip component or use primitives directly.
            For this story, we demonstrate the standard usage.
        */}
        <Tooltip {...args}>
          <TooltipTrigger asChild>
            <Button variant="outline">Default Delay (0ms)</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>I appear instantly</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};
