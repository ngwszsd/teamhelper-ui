import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '../src/components/ui/label';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: '标签内容',
    },
    className: {
      control: 'text',
      description: '额外的 CSS 类名',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: 'Accept terms and conditions',
    htmlFor: 'terms',
  },
};
