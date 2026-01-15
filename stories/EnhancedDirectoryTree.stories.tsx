import type { Meta, StoryObj } from '@storybook/react';
import { DirectoryTree } from '../src/components/enhance-ui/DirectoryTree';
import { Folder, FolderOpen, FileCode, FileImage } from 'lucide-react';

const meta: Meta<typeof DirectoryTree> = {
  title: 'Enhanced UI/DirectoryTree',
  component: DirectoryTree,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DirectoryTree>;

const treeData = [
  {
    key: 'src',
    title: 'src',
    children: [
      {
        key: 'components',
        title: 'components',
        children: [
          { key: 'Button.tsx', title: 'Button.tsx' },
          { key: 'Input.tsx', title: 'Input.tsx' },
        ],
      },
      {
        key: 'utils',
        title: 'utils',
        children: [{ key: 'index.ts', title: 'index.ts' }],
      },
      { key: 'App.tsx', title: 'App.tsx' },
    ],
  },
  {
    key: 'public',
    title: 'public',
    children: [
      { key: 'favicon.ico', title: 'favicon.ico' },
      { key: 'index.html', title: 'index.html' },
    ],
  },
  { key: 'package.json', title: 'package.json' },
];

export const Default: Story = {
  args: {
    treeData,
    defaultExpandAll: true,
    className: 'w-[300px] border rounded-md p-2',
  },
};

export const CustomIcons: Story = {
  args: {
    treeData: [
      {
        key: 'src',
        title: 'src',
        children: [
          {
            key: 'assets',
            title: 'assets',
            children: [
              {
                key: 'logo.png',
                title: 'logo.png',
                icon: <FileImage className="w-4 h-4 text-blue-500" />,
              },
            ],
          },
          {
            key: 'main.tsx',
            title: 'main.tsx',
            icon: <FileCode className="w-4 h-4 text-yellow-500" />,
          },
        ],
      },
    ],
    defaultExpandAll: true,
    className: 'w-[300px] border rounded-md p-2',
    folderIcon: <Folder className="w-4 h-4 text-blue-500" />,
    folderOpenIcon: <FolderOpen className="w-4 h-4 text-blue-500" />,
  },
};

export const DoubleClickExpand: Story = {
  args: {
    treeData,
    defaultExpandAll: false,
    expandAction: 'doubleClick',
    className: 'w-[300px] border rounded-md p-2',
  },
};
