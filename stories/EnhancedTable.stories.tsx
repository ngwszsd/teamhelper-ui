import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedTable } from '../src/components/enhance-ui/Table';
import { Button } from '../src/components/ui/button';

const meta: Meta<typeof EnhancedTable> = {
  title: 'Enhanced UI/Table',
  component: EnhancedTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
    },
    bordered: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof EnhancedTable>;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 100,
    sorter: (a: any, b: any) => a.age - b.age,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Action',
    key: 'action',
    width: 150,
    render: () => <Button variant="link">Delete</Button>,
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
];

export const Default: Story = {
  args: {
    columns,
    dataSource: data,
    bordered: true,
  },
  render: (args) => (
    <div className="w-[800px]">
      <EnhancedTable {...args} />
    </div>
  ),
};

export const Loading: Story = {
  args: {
    columns,
    dataSource: [],
    loading: true,
    bordered: true,
  },
  render: (args) => (
    <div className="w-[800px] h-[300px]">
      <EnhancedTable {...args} />
    </div>
  ),
};

export const EmptyData: Story = {
  args: {
    columns,
    dataSource: [],
    bordered: true,
  },
  render: (args) => (
    <div className="w-[800px]">
      <EnhancedTable {...args} />
    </div>
  ),
};

export const RowSelection: Story = {
  args: {
    columns,
    dataSource: data,
    bordered: true,
    rowSelection: {
      type: 'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys', selectedRowKeys);
        console.log('selectedRows', selectedRows);
      },
    },
  },
  render: (args) => (
    <div className="w-[800px]">
      <EnhancedTable {...args} />
    </div>
  ),
};

export const RadioSelection: Story = {
  args: {
    columns,
    dataSource: data,
    bordered: true,
    rowSelection: {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys', selectedRowKeys);
        console.log('selectedRows', selectedRows);
      },
    },
  },
  render: (args) => (
    <div className="w-[800px]">
      <EnhancedTable {...args} />
    </div>
  ),
};

export const FixedHeader: Story = {
  args: {
    columns,
    dataSource: Array.from({ length: 20 }).map((_, i) => ({
      key: i,
      name: `User ${i}`,
      age: 20 + i,
      address: `Address ${i}`,
    })),
    bordered: true,
    scroll: { y: 300 },
  },
  render: (args) => (
    <div className="w-[800px]">
      <EnhancedTable {...args} />
    </div>
  ),
};

const fixedColumns = [
  {
    title: 'Full Name',
    width: 150,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left' as const,
  },
  {
    title: 'Age',
    width: 100,
    dataIndex: 'age',
    key: 'age',
    fixed: 'left' as const,
  },
  { title: 'Column 1', dataIndex: 'address', key: '1', width: 200 },
  { title: 'Column 2', dataIndex: 'address', key: '2', width: 200 },
  { title: 'Column 3', dataIndex: 'address', key: '3', width: 200 },
  { title: 'Column 4', dataIndex: 'address', key: '4', width: 200 },
  { title: 'Column 5', dataIndex: 'address', key: '5', width: 200 },
  { title: 'Column 6', dataIndex: 'address', key: '6', width: 200 },
  { title: 'Column 7', dataIndex: 'address', key: '7', width: 200 },
  { title: 'Column 8', dataIndex: 'address', key: '8', width: 200 },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right' as const,
    width: 100,
    render: () => <a>action</a>,
  },
];

export const FixedColumns: Story = {
  args: {
    columns: fixedColumns,
    dataSource: data,
    bordered: true,
    scroll: { x: 1500 },
  },
  render: (args) => (
    <div className="w-[800px]">
      <EnhancedTable {...args} />
    </div>
  ),
};
