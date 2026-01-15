import type { Meta, StoryObj } from '@storybook/react';
import Breadcrumb, {
  type Crumb,
} from '../src/components/enhance-ui/Breadcrumb';
import { Home, User, Settings, ChevronRight } from 'lucide-react';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Enhanced UI/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    separator: { control: 'text', description: '分隔符' },
    maxItems: { control: 'number', description: '最大显示数量' },
    itemsBefore: { control: 'number', description: '省略号前保留的项目数量' },
    itemsAfter: { control: 'number', description: '省略号后保留的项目数量' },
    lastItemClickable: {
      control: 'boolean',
      description: '最后一项是否可点击',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

const defaultItems = [
  { label: 'Home', href: '/' },
  { label: 'Components', href: '/components' },
  { label: 'Breadcrumb' },
];

export const Default: Story = {
  args: {
    items: defaultItems,
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { label: <Home className="h-4 w-4" />, href: '/' },
      {
        label: (
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" /> Users
          </span>
        ),
        href: '/users',
      },
      {
        label: (
          <span className="flex items-center gap-1">
            <Settings className="h-4 w-4" /> Settings
          </span>
        ),
      },
    ],
  },
};

export const CustomSeparator: Story = {
  args: {
    items: defaultItems,
    separator: <ChevronRight className="h-4 w-4" />,
  },
};

export const Collapsed: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Category 1', href: '/c1' },
      { label: 'Category 2', href: '/c2' },
      { label: 'Category 3', href: '/c3' },
      { label: 'Category 4', href: '/c4' },
      { label: 'Current Page' },
    ],
    maxItems: 3,
  },
};

export const CollapsedCustomConfig: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Category 1', href: '/c1' },
      { label: 'Category 2', href: '/c2' },
      { label: 'Category 3', href: '/c3' },
      { label: 'Category 4', href: '/c4' },
      { label: 'Current Page' },
    ],
    maxItems: 3,
    itemsBefore: 2,
    itemsAfter: 1,
  },
};

export const LastItemClickable: Story = {
  args: {
    items: defaultItems,
    lastItemClickable: true,
  },
};

export const WithOnClick: Story = {
  args: {
    items: [
      { label: 'Click Me 1', onClick: () => alert('Clicked 1') },
      { label: 'Click Me 2', onClick: () => alert('Clicked 2') },
      { label: 'Current' },
    ],
    onClick: (item: Crumb) => console.log('Global click handler:', item),
  },
};
