import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/components/enhance-ui/Button';
import { Search, Download, Power } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Enhanced UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'primary', 'dashed', 'text', 'link'],
      description: '按钮类型',
    },
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
      description: '按钮尺寸',
    },
    shape: {
      control: 'select',
      options: ['default', 'circle', 'round'],
      description: '按钮形状',
    },
    danger: { control: 'boolean', description: '危险按钮' },
    ghost: { control: 'boolean', description: '幽灵按钮（背景透明）' },
    disabled: { control: 'boolean', description: '禁用状态' },
    loading: { control: 'boolean', description: '加载状态' },
    block: {
      control: 'boolean',
      description: '将按钮宽度调整为其父宽度的选项',
    },
    href: { control: 'text', description: '点击跳转的地址' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    type: 'primary',
    children: 'Primary Button',
  },
};

export const Default: Story = {
  args: {
    type: 'default',
    children: 'Default Button',
  },
};

export const Dashed: Story = {
  args: {
    type: 'dashed',
    children: 'Dashed Button',
  },
};

export const Text: Story = {
  args: {
    type: 'text',
    children: 'Text Button',
  },
};

export const Link: Story = {
  args: {
    type: 'link',
    children: 'Link Button',
    href: '#',
  },
};

export const Danger: Story = {
  render: (args) => (
    <div className="flex gap-2">
      <Button {...args} type="primary" danger>
        Primary Danger
      </Button>
      <Button {...args} type="default" danger>
        Default Danger
      </Button>
      <Button {...args} type="dashed" danger>
        Dashed Danger
      </Button>
      <Button {...args} type="text" danger>
        Text Danger
      </Button>
      <Button {...args} type="link" danger>
        Link Danger
      </Button>
    </div>
  ),
};

export const Ghost: Story = {
  render: (args) => (
    <div className="flex gap-2 p-4 bg-slate-400 rounded">
      <Button {...args} type="primary" ghost>
        Primary Ghost
      </Button>
      <Button {...args} type="default" ghost>
        Default Ghost
      </Button>
      <Button {...args} type="dashed" ghost>
        Dashed Ghost
      </Button>
      <Button {...args} type="primary" danger ghost>
        Danger Ghost
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button {...args} size="large" type="primary">
          Large
        </Button>
        <Button {...args} size="middle" type="primary">
          Middle
        </Button>
        <Button {...args} size="small" type="primary">
          Small
        </Button>
      </div>
    </div>
  ),
};

export const Shapes: Story = {
  render: (args) => (
    <div className="flex gap-2">
      <Button {...args} type="primary" shape="round">
        Round Button
      </Button>
      <Button
        {...args}
        type="primary"
        shape="circle"
        icon={<Search className="h-4 w-4" />}
      />
      <Button
        {...args}
        type="default"
        shape="circle"
        icon={<Search className="h-4 w-4" />}
      />
      <Button
        {...args}
        type="default"
        shape="circle"
        icon={<Search className="h-4 w-4" />}
      />
    </div>
  ),
};

export const Loading: Story = {
  render: (args) => (
    <div className="flex gap-2">
      <Button {...args} type="primary" loading>
        Loading
      </Button>
      <Button {...args} type="primary" size="small" loading>
        Loading
      </Button>
      <Button
        {...args}
        type="default"
        icon={<Power className="h-4 w-4" />}
        loading
      />
      <Button {...args} type="primary" shape="circle" loading />
    </div>
  ),
};

export const Block: Story = {
  args: {
    type: 'primary',
    block: true,
    children: 'Block Button',
  },
};

export const WithIcon: Story = {
  render: (args) => (
    <div className="flex gap-2">
      <Button {...args} type="primary" icon={<Search className="h-4 w-4" />}>
        Search
      </Button>
      <Button
        {...args}
        type="default"
        icon={<Download className="h-4 w-4" />}
        iconPosition="end"
      >
        Download
      </Button>
    </div>
  ),
};
