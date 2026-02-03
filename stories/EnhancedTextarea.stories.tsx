import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedTextarea as Textarea } from '../src/components/enhance-ui/Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Enhanced/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    placeholder: {
      control: 'text',
      description: '占位符文本',
    },
    className: {
      control: 'text',
      description: '额外的 CSS 类名',
    },
    showCount: {
      control: 'boolean',
      description: '是否显示字数统计',
    },
    maxLength: {
      control: 'number',
      description: '最大字数限制',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Type your message here.',
  },
};

export const WithCount: Story = {
  args: {
    placeholder: 'Type your message here.',
    showCount: true,
    maxLength: 100,
  },
};
