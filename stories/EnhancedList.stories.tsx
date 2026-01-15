import type { Meta, StoryObj } from '@storybook/react';
import { List } from '../src/components/enhance-ui/List';

const meta: Meta<typeof List> = {
  title: 'Enhanced UI/List',
  component: List,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof List>;

const generateData = (count: number) => {
  return Array.from({ length: count }).map((_, index) => ({
    id: index,
    title: `Item ${index + 1}`,
    description: `This is the description for item ${index + 1}`,
  }));
};

export const Default: Story = {
  args: {
    dataSource: generateData(20),
    containerHeight: 300,
    className: 'w-[300px] border rounded-md',
    renderItem: (item: any) => (
      <div className="p-4 border-b hover:bg-slate-50">
        <div className="font-bold">{item.title}</div>
        <div className="text-sm text-gray-500">{item.description}</div>
      </div>
    ),
  },
};

export const WithItemGap: Story = {
  args: {
    dataSource: generateData(20),
    containerHeight: 300,
    itemGap: 10,
    className: 'w-[300px] border rounded-md p-2',
    renderItem: (item: any) => (
      <div className="p-4 border rounded-md bg-white shadow-sm">
        <div className="font-bold">{item.title}</div>
        <div className="text-sm text-gray-500">{item.description}</div>
      </div>
    ),
    style: { backgroundColor: '#f5f5f5' },
  },
};

export const LargeData: Story = {
  args: {
    dataSource: generateData(1000),
    containerHeight: 400,
    className: 'w-[400px] border rounded-md',
    renderItem: (item: any) => (
      <div className="px-4 py-2 border-b flex justify-between items-center hover:bg-slate-50">
        <span>{item.title}</span>
        <span className="text-xs text-gray-400">ID: {item.id}</span>
      </div>
    ),
  },
};
