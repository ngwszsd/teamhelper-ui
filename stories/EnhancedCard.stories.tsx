import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../src/components/enhance-ui/Card';
import { Button } from '../src/components/ui/button';
import {
  Settings,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share2,
} from 'lucide-react';

const meta: Meta<typeof Card> = {
  title: 'Enhanced UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: '卡片标题' },
    extra: { control: 'text', description: '卡片右上角额外内容' },
    hoverable: { control: 'boolean', description: '是否可浮起' },
    bordered: { control: 'boolean', description: '是否有边框' },
    loading: { control: 'boolean', description: '是否加载中' },
    size: {
      control: 'select',
      options: ['default', 'small'],
      description: '卡片尺寸',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: 'Default Card',
    children: <p>Card content</p>,
    className: 'w-[350px]',
  },
};

export const Small: Story = {
  args: {
    title: 'Small Card',
    size: 'small',
    extra: (
      <a href="#" className="text-blue-500 text-sm">
        More
      </a>
    ),
    children: <p>Small size card content</p>,
    className: 'w-[300px]',
  },
};

export const WithExtra: Story = {
  args: {
    title: 'Card Title',
    extra: (
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),
    children: <p>Card with extra action in header</p>,
    className: 'w-[350px]',
  },
};

export const Hoverable: Story = {
  args: {
    title: 'Hoverable Card',
    hoverable: true,
    children: <p>Hover over me!</p>,
    className: 'w-[350px]',
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading Card',
    loading: true,
    children: (
      <p>This content will be replaced by skeleton when loading is true.</p>
    ),
    className: 'w-[350px]',
  },
};

export const Borderless: Story = {
  args: {
    title: 'Borderless Card',
    bordered: false,
    children: <p>Card without border.</p>,
    className: 'w-[350px] bg-slate-50',
  },
};

export const WithCover: Story = {
  args: {
    cover: (
      <img
        alt="example"
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?&auto=format&fit=crop&w=400&q=80"
        className="w-full h-48 object-cover"
      />
    ),
    title: 'Card with Cover',
    children: <p>Card with a cover image.</p>,
    className: 'w-[350px]',
  },
};

export const WithActions: Story = {
  args: {
    title: 'Card with Actions',
    children: <p>Card with action buttons in footer.</p>,
    actions: [
      <Button variant="ghost" size="sm" className="w-full">
        <ThumbsUp className="h-4 w-4 mr-2" />
        Like
      </Button>,
      <Button variant="ghost" size="sm" className="w-full">
        <MessageCircle className="h-4 w-4 mr-2" />
        Comment
      </Button>,
      <Button variant="ghost" size="sm" className="w-full">
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>,
    ],
    className: 'w-[350px]',
  },
};
