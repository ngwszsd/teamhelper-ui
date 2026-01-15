import type { Meta, StoryObj } from '@storybook/react';
import {
  EnhancedRadio,
  EnhancedRadioGroup,
} from '../src/components/enhance-ui/Radio';
import { RadioGroup } from '../src/components/ui/radio-group';

const meta: Meta<typeof EnhancedRadio> = {
  title: 'Enhanced UI/Radio',
  component: EnhancedRadio,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: '值',
    },
    label: {
      control: 'text',
      description: '标签文本',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof EnhancedRadio>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup defaultValue={args.value}>
      <EnhancedRadio {...args} />
    </RadioGroup>
  ),
  args: {
    value: 'option-1',
    label: 'Radio Option',
  },
};

export const Group: Story = {
  render: (args) => (
    <EnhancedRadioGroup
      options={[
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3', disabled: true },
      ]}
      defaultValue="1"
      onChange={(val) => console.log(val)}
    />
  ),
};

export const GroupVertical: Story = {
  render: (args) => (
    <EnhancedRadioGroup
      direction="vertical"
      options={[
        { label: 'Option A', value: 'a' },
        { label: 'Option B', value: 'b' },
        { label: 'Option C', value: 'c' },
      ]}
      defaultValue="b"
    />
  ),
};
