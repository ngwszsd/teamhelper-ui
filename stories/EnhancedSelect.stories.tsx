import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedSelect } from '../src/components/enhance-ui/Select';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date', disabled: true },
  { label: 'Elderberry', value: 'elderberry' },
];

const meta: Meta<typeof EnhancedSelect> = {
  title: 'Enhanced UI/Select',
  component: EnhancedSelect,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'multiple'],
      description: '模式：单选或多选',
    },
    disabled: { control: 'boolean', description: '是否禁用' },
    searchable: { control: 'boolean', description: '是否可搜索' },
    allowClear: { control: 'boolean', description: '是否允许清除' },
    placeholder: { control: 'text', description: '占位文案' },
    matchTriggerWidth: {
      control: 'boolean',
      description: '弹层宽度是否匹配触发器宽度',
    },
  },
  args: {
    options,
    placeholder: 'Select a fruit',
    className: 'w-[200px]',
  },
};

export default meta;
type Story = StoryObj<typeof EnhancedSelect>;

export const Single: Story = {
  args: {
    mode: 'single',
  },
};

export const Multiple: Story = {
  args: {
    mode: 'multiple',
    maxTagCount: 2,
    placeholder: 'Select fruits',
  },
};

export const Searchable: Story = {
  args: {
    searchable: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'apple',
  },
};

export const CustomContentWidth: Story = {
  args: {
    matchTriggerWidth: false,
    contentWidth: 300,
    placeholder: 'Wide dropdown',
  },
};
