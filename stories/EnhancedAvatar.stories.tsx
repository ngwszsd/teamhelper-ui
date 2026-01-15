import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../src/components/enhance-ui/Avatar';
import { User, Cat } from 'lucide-react';

const meta: Meta<typeof Avatar> = {
  title: 'Enhanced UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    shape: {
      control: 'select',
      options: ['circle', 'square'],
      description: '头像形状',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large', 'xlarge', 26, 18],
      description: '头像尺寸',
    },
    src: {
      control: 'text',
      description: '图片地址',
    },
    alt: {
      control: 'text',
      description: '替代文本',
    },
    autoColor: {
      control: 'boolean',
      description: '是否自动生成背景色（仅在显示文本时有效）',
    },
    initialOnly: {
      control: 'boolean',
      description: '是否仅显示首字母',
    },
    gap: {
      control: 'number',
      description: '文本内容距离容器边缘的间距',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    alt: 'User',
    size: 'default',
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: '@shadcn',
    size: 'default',
  },
};

export const WithIcon: Story = {
  args: {
    icon: <User className="h-4 w-4" />,
    size: 'default',
  },
};

export const WithText: Story = {
  args: {
    children: 'Tom',
    autoColor: true,
  },
};

export const AutoColor: Story = {
  args: {
    children: 'Alice',
    autoColor: true,
    size: 'large',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args} size="small" children="SM" autoColor />
      <Avatar {...args} size="default" children="DF" autoColor />
      <Avatar {...args} size="large" children="LG" autoColor />
      <Avatar {...args} size="xlarge" children="XL" autoColor />
    </div>
  ),
};

export const Shapes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args} shape="circle" src="https://github.com/shadcn.png" />
      <Avatar {...args} shape="square" src="https://github.com/shadcn.png" />
    </div>
  ),
};
