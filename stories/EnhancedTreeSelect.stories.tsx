import type { Meta, StoryObj } from '@storybook/react';
import { TreeSelect } from '../src/components/enhance-ui/TreeSelect';
import { useState } from 'react';

const meta: Meta<typeof TreeSelect> = {
  title: 'Enhanced UI/TreeSelect',
  component: TreeSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TreeSelect>;

const treeData = [
  {
    key: '0-0',
    title: 'Parent 1',
    children: [
      { key: '0-0-0', title: 'Child 1-1' },
      { key: '0-0-1', title: 'Child 1-2' },
      {
        key: '0-0-2',
        title: 'Child 1-3',
        children: [
          { key: '0-0-2-0', title: 'Grandchild 1-3-1' },
          { key: '0-0-2-1', title: 'Grandchild 1-3-2' },
        ],
      },
    ],
  },
  {
    key: '0-1',
    title: 'Parent 2',
    children: [
      { key: '0-1-0', title: 'Child 2-1' },
      { key: '0-1-1', title: 'Child 2-2' },
    ],
  },
  {
    key: '0-2',
    title: 'Parent 3',
  },
];

export const Default: Story = {
  args: {
    treeData,
    placeholder: 'Please select',
    className: 'w-[300px]',
  },
};

export const WithSearch: Story = {
  args: {
    treeData,
    placeholder: 'Searchable select',
    searchable: true,
    searchPlaceholder: 'Search...',
    className: 'w-[300px]',
  },
};

export const DirectoryMode: Story = {
  args: {
    treeData,
    isDirectory: true,
    placeholder: 'Select directory',
    className: 'w-[300px]',
  },
};

export const Disabled: Story = {
  args: {
    treeData,
    disabled: true,
    value: '0-0-0',
    className: 'w-[300px]',
  },
};

export const Controlled = () => {
  const [value, setValue] = useState<React.Key | undefined>(undefined);
  return (
    <TreeSelect
      treeData={treeData}
      value={value}
      onChange={(val) => setValue(val)}
      className="w-[300px]"
      placeholder="Controlled mode"
    />
  );
};
