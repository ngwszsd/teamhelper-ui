import type { Meta, StoryObj } from '@storybook/react';
import { DivSkeleton } from '../src/components/enhance-ui/DivSkeleton';

const meta: Meta<typeof DivSkeleton> = {
  title: 'Enhanced UI/DivSkeleton',
  component: DivSkeleton,
  tags: ['autodocs'],
  argTypes: {
    isSkeleton: {
      control: 'boolean',
      description: '是否显示骨架屏',
    },
    className: {
      control: 'text',
      description: '自定义类名',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DivSkeleton>;

export const Default: Story = {
  args: {
    isSkeleton: true,
    className: 'h-[100px] w-[200px] rounded-xl',
    children: <div>Content Loaded</div>,
  },
};

export const Loaded: Story = {
  args: {
    isSkeleton: false,
    className: 'h-[100px] w-[200px] rounded-xl',
    children: (
      <div className="h-[100px] w-[200px] rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
        Content Loaded
      </div>
    ),
  },
};

export const TextSkeleton: Story = {
  args: {
    isSkeleton: true,
    className: 'h-4 w-[250px]',
    children: <span>Some text content</span>,
  },
};

export const CircleSkeleton: Story = {
  args: {
    isSkeleton: true,
    className: 'h-12 w-12 rounded-full',
    children: <div className="h-12 w-12 rounded-full bg-slate-200" />,
  },
};
