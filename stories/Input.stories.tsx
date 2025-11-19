import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../src/components/ui/input';
import React from 'react';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: '输入框类型',
    },
    placeholder: {
      control: 'text',
      description: '占位符文本',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    className: {
      control: 'text',
      description: '自定义 CSS 类名',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// 基础输入框
export const Default: Story = {
  args: {
    placeholder: '请输入内容...',
    type: 'text',
  },
};

// 邮箱输入框
export const Email: Story = {
  args: {
    placeholder: '请输入邮箱地址',
    type: 'email',
  },
};

// 密码输入框
export const Password: Story = {
  args: {
    placeholder: '请输入密码',
    type: 'password',
  },
};

// 禁用状态
export const Disabled: Story = {
  args: {
    placeholder: '禁用输入框',
    disabled: true,
  },
};

// 数字输入框
export const Number: Story = {
  args: {
    placeholder: '请输入数字',
    type: 'number',
  },
};

// 搜索输入框
export const Search: Story = {
  args: {
    placeholder: '搜索...',
    type: 'search',
  },
};

// 带默认值的输入框
export const WithDefaultValue: Story = {
  args: {
    defaultValue: '默认文本',
    placeholder: '请输入内容...',
  },
};

// 自定义样式的输入框
export const CustomStyle: Story = {
  args: {
    placeholder: '自定义样式输入框',
    className: 'border-2 border-blue-500 focus:ring-blue-500',
  },
};

// 错误状态的输入框
export const ErrorState: Story = {
  args: {
    placeholder: '错误状态输入框',
    className: 'border-red-500 focus:ring-red-500',
  },
};

// 不同尺寸的输入框
export const LargeSize: Story = {
  args: {
    placeholder: '大尺寸输入框',
    className: 'h-12 text-lg',
  },
};

export const SmallSize: Story = {
  args: {
    placeholder: '小尺寸输入框',
    className: 'h-7 text-sm',
  },
};

// 带前缀/后缀的示例（演示如何使用包装器）
export const WithPrefix: Story = {
  render: (args) => (
    <div className="flex items-center rounded-md border border-input bg-transparent px-3 py-1 shadow-sm focus-within:ring-1 focus-within:ring-ring">
      <span className="text-muted-foreground mr-2">¥</span>
      <Input {...args} className="border-0 p-0 focus-visible:ring-0" />
    </div>
  ),
  args: {
    placeholder: '0.00',
    type: 'number',
  },
};

export const WithSuffix: Story = {
  render: (args) => (
    <div className="flex items-center rounded-md border border-input bg-transparent px-3 py-1 shadow-sm focus-within:ring-1 focus-within:ring-ring">
      <Input {...args} className="border-0 p-0 focus-visible:ring-0" />
      <span className="text-muted-foreground ml-2">%</span>
    </div>
  ),
  args: {
    placeholder: '100',
    type: 'number',
  },
};
