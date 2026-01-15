import type { Meta, StoryObj } from '@storybook/react';
import { Tree } from '../src/components/enhance-ui/Tree';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

const meta: Meta<typeof Tree> = {
  title: 'Enhanced UI/Tree',
  component: Tree,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tree>;

const treeData = [
  {
    key: '0-0',
    title: 'Parent 1',
    children: [
      { key: '0-0-0', title: 'Child 1-1', isLeaf: true },
      { key: '0-0-1', title: 'Child 1-2', isLeaf: true },
      {
        key: '0-0-2',
        title: 'Child 1-3',
        children: [
          { key: '0-0-2-0', title: 'Grandchild 1-3-1', isLeaf: true },
          { key: '0-0-2-1', title: 'Grandchild 1-3-2', isLeaf: true },
        ],
      },
    ],
  },
  {
    key: '0-1',
    title: 'Parent 2',
    children: [
      { key: '0-1-0', title: 'Child 2-1', isLeaf: true },
      { key: '0-1-1', title: 'Child 2-2', isLeaf: true },
    ],
  },
  {
    key: '0-2',
    title: 'Parent 3',
    isLeaf: true,
  },
];

export const Default: Story = {
  args: {
    treeData,
    defaultExpandAll: true,
    className: 'w-[300px] border rounded-md p-2',
  },
};

export const WithIcons: Story = {
  args: {
    treeData: [
      {
        key: 'docs',
        title: 'Documents',
        icon: <Folder className="w-4 h-4" />,
        children: [
          {
            key: 'doc-1',
            title: 'Report.pdf',
            icon: <File className="w-4 h-4" />,
          },
          {
            key: 'doc-2',
            title: 'Notes.txt',
            icon: <File className="w-4 h-4" />,
          },
        ],
      },
      {
        key: 'images',
        title: 'Images',
        icon: <Folder className="w-4 h-4" />,
        children: [
          {
            key: 'img-1',
            title: 'Logo.png',
            icon: <File className="w-4 h-4" />,
          },
        ],
      },
    ],
    defaultExpandAll: true,
    className: 'w-[300px] border rounded-md p-2',
  },
};

export const SelectionMultiple: Story = {
  args: {
    treeData,
    selectable: true,
    selectionMode: 'multiple',
    defaultExpandAll: true,
    className: 'w-[300px] border rounded-md p-2',
    defaultSelectedKeys: ['0-0-0', '0-1-1'],
  },
};

export const CustomToggleIcon: Story = {
  args: {
    treeData,
    defaultExpandAll: true,
    className: 'w-[300px] border rounded-md p-2',
    toggleIcon: ({ expanded }) =>
      expanded ? (
        <ChevronDown className="w-4 h-4 text-blue-500" />
      ) : (
        <ChevronRight className="w-4 h-4 text-gray-500" />
      ),
  },
};

export const LargeData: Story = {
  args: {
    treeData: Array.from({ length: 50 }).map((_, i) => ({
      key: `node-${i}`,
      title: `Node ${i}`,
      children: Array.from({ length: 10 }).map((_, j) => ({
        key: `node-${i}-${j}`,
        title: `Child ${i}-${j}`,
        isLeaf: true,
      })),
    })),
    containerHeight: 400,
    className: 'w-[300px] border rounded-md',
  },
};
