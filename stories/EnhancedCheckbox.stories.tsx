import type { Meta, StoryObj } from '@storybook/react';
import {
  EnhancedCheckbox,
  EnhancedCheckboxGroup,
} from '../src/components/enhance-ui/Checkbox';

const meta: Meta<typeof EnhancedCheckbox> = {
  title: 'Enhanced UI/Checkbox',
  component: EnhancedCheckbox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: '是否选中',
    },
    defaultChecked: {
      control: 'boolean',
      description: '默认是否选中',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    indeterminate: {
      control: 'boolean',
      description: '是否处于不确定状态',
    },
    label: {
      control: 'text',
      description: '标签文本',
    },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof EnhancedCheckbox>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked Option',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Option',
    disabled: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Indeterminate Option',
    indeterminate: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: (
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept terms and conditions
        </label>
        <p className="text-sm text-muted-foreground">
          You agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    ),
  },
};

export const Group: Story = {
  render: (args) => (
    <EnhancedCheckboxGroup
      options={[
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3', disabled: true },
      ]}
      defaultValue={['1']}
      onChange={(val) => console.log(val)}
    />
  ),
};

export const GroupVertical: Story = {
  render: (args) => (
    <EnhancedCheckboxGroup
      direction="vertical"
      options={[
        { label: 'Option A', value: 'a' },
        { label: 'Option B', value: 'b' },
        { label: 'Option C', value: 'c' },
      ]}
      defaultValue={['b']}
    />
  ),
};
