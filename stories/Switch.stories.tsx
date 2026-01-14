import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '../src/components/ui/switch';
import { Label } from '../src/components/ui/label';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: '开关是否开启状态',
    },
    onCheckedChange: {
      description: '开关状态改变时的回调函数',
      action: 'changed',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用开关',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      description: '额外的 CSS 类名',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
