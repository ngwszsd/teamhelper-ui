import type { Meta, StoryObj } from '@storybook/react';
import { Empty } from '../src/components/enhance-ui/Empty';
import { Button } from '../src/components/ui/button';

const meta: Meta<typeof Empty> = {
  title: 'Enhanced UI/Empty',
  component: Empty,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    image: {
      description: '自定义图片',
    },
    title: {
      control: 'text',
      description: '空状态标题',
    },
    description: {
      control: 'text',
      description: '空状态描述文字',
    },
    footer: {
      description: '底部内容',
    },
    children: {
      description: '自定义空状态内容',
    },
    classNames: {
      description: '语义化类名映射',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Empty>;

export const Default: Story = {
  args: {
    description: '暂无数据',
  },
};

export const Simple: Story = {
  args: {
    image: Empty.PRESENTED_IMAGE_SIMPLE,
    description: '此目录下还没有内容',
  },
};

export const WithTitle: Story = {
  args: {
    image: Empty.PRESENTED_IMAGE_OPEN,
    title: '暂无任务',
    description: '所有的工作都已圆满完成，放松一下吧！',
  },
};

export const WithFooter: Story = {
  args: {
    title: '权限限制',
    description: '您目前没有权限访问该资源，请联系管理员申请访问权限。',
    footer: (
      <Button variant="default" size="sm">
        申请权限
      </Button>
    ),
  },
};

export const CustomImage: Story = {
  args: {
    image: 'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg',
    title: '网络连接异常',
    description: '请检查您的网络连接并重试',
    footer: (
      <Button variant="outline" size="sm">
        刷新重试
      </Button>
    ),
  },
};
