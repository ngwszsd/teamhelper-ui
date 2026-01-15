import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedPopover } from '../src/components/enhance-ui/Popover';
import { Button } from '../src/components/ui/button';

const meta: Meta<typeof EnhancedPopover> = {
  title: 'Enhanced UI/Popover',
  component: EnhancedPopover,
  tags: ['autodocs'],
  argTypes: {
    trigger: {
      control: 'select',
      options: ['hover', 'click', 'focus', 'contextMenu'],
      description: '触发方式',
    },
    placement: {
      control: 'select',
      options: [
        'top',
        'left',
        'right',
        'bottom',
        'topLeft',
        'topRight',
        'bottomLeft',
        'bottomRight',
        'leftTop',
        'leftBottom',
        'rightTop',
        'rightBottom',
      ],
      description: '弹出位置',
    },
    title: { control: 'text', description: '标题' },
    arrow: { control: 'boolean', description: '是否显示箭头' },
    open: { control: 'boolean', description: '是否打开（受控）' },
  },
  args: {
    title: 'Popover Title',
    content: 'This is the content of the popover. It can be any ReactNode.',
    children: <Button variant="outline">Click me</Button>,
  },
};

export default meta;
type Story = StoryObj<typeof EnhancedPopover>;

export const Basic: Story = {
  args: {},
};

export const Hover: Story = {
  args: {
    trigger: 'hover',
    children: <Button variant="outline">Hover me</Button>,
  },
};

export const NoArrow: Story = {
  args: {
    arrow: false,
    children: <Button variant="outline">No Arrow</Button>,
  },
};

export const Placement: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 items-center pt-10">
      <div className="flex gap-4">
        <EnhancedPopover {...args} placement="top" content="Top Content">
          <Button variant="outline">Top</Button>
        </EnhancedPopover>
        <EnhancedPopover {...args} placement="bottom" content="Bottom Content">
          <Button variant="outline">Bottom</Button>
        </EnhancedPopover>
      </div>
      <div className="flex gap-4">
        <EnhancedPopover {...args} placement="left" content="Left Content">
          <Button variant="outline">Left</Button>
        </EnhancedPopover>
        <EnhancedPopover {...args} placement="right" content="Right Content">
          <Button variant="outline">Right</Button>
        </EnhancedPopover>
      </div>
    </div>
  ),
};
