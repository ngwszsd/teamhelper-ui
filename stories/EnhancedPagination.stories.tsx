import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedPagination } from '../src/components/enhance-ui/Pagination';
import { useState } from 'react';

const meta: Meta<typeof EnhancedPagination> = {
  title: 'Enhanced UI/Pagination',
  component: EnhancedPagination,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: '尺寸',
    },
    showSizeChanger: {
      control: 'boolean',
      description: '是否显示每页条数选择器',
    },
    showQuickJumper: { control: 'boolean', description: '是否显示快速跳转' },
    disabled: { control: 'boolean', description: '是否禁用' },
    startFromZero: { control: 'boolean', description: '页码是否从 0 开始' },
    total: { control: 'number', description: '总数据条数' },
    pageSize: { control: 'number', description: '每页显示条数' },
    current: { control: 'number', description: '当前页码' },
  },
  args: {
    total: 500,
    pageSize: 10,
    current: 1,
  },
};

export default meta;
type Story = StoryObj<typeof EnhancedPagination>;

export const Basic: Story = {
  args: {},
};

export const Controlled: Story = {
  render: (args) => {
    const [current, setCurrent] = useState(args.current || 1);
    const [pageSize, setPageSize] = useState(args.pageSize || 10);
    return (
      <EnhancedPagination
        {...args}
        current={current}
        pageSize={pageSize}
        onChange={(page, size) => {
          setCurrent(page);
          setPageSize(size);
        }}
        onShowSizeChange={(page, size) => {
          setCurrent(page);
          setPageSize(size);
        }}
      />
    );
  },
};

export const ShowTotal: Story = {
  args: {
    showTotal: (total, range) =>
      `Showing ${range[0]}-${range[1]} of ${total} items`,
  },
};

export const FullFeatures: Story = {
  args: {
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50, 100],
    showTotal: (total) => `Total ${total} items`,
  },
  render: (args) => {
    const [current, setCurrent] = useState(args.current || 1);
    const [pageSize, setPageSize] = useState(args.pageSize || 10);
    return (
      <EnhancedPagination
        {...args}
        current={current}
        pageSize={pageSize}
        onChange={(page, size) => {
          setCurrent(page);
          setPageSize(size);
        }}
        onShowSizeChange={(page, size) => {
          setCurrent(page);
          setPageSize(size);
        }}
      />
    );
  },
};

export const SmallSize: Story = {
  args: {
    size: 'sm',
    total: 100,
    showSizeChanger: true,
  },
};
