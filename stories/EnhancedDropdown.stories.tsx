import type { Meta, StoryObj } from '@storybook/react';
import {
  Dropdown,
  DropdownButton,
} from '../src/components/enhance-ui/Dropdown';
import { Button } from '../src/components/enhance-ui/Button';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';

const items = [
  {
    key: '1',
    label: 'My Account',
    icon: <User className="w-4 h-4" />,
  },
  {
    key: '2',
    label: 'Settings',
    icon: <Settings className="w-4 h-4" />,
  },
  {
    key: '3',
    label: 'Logout',
    icon: <LogOut className="w-4 h-4" />,
    danger: true,
    divided: true,
  },
];

const meta: Meta<typeof Dropdown> = {
  title: 'Enhanced UI/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  args: {
    menu: { items },
    children: (
      <Button>
        Hover me <ChevronDown className="ml-2 w-4 h-4" />
      </Button>
    ),
    trigger: ['hover'],
  },
};

export const ClickTrigger: Story = {
  args: {
    menu: { items },
    trigger: ['click'],
    children: (
      <Button>
        Click me <ChevronDown className="ml-2 w-4 h-4" />
      </Button>
    ),
  },
};

export const ContextMenu: Story = {
  args: {
    menu: { items },
    trigger: ['contextMenu'],
    children: (
      <div className="h-32 w-64 bg-muted flex items-center justify-center rounded-md border border-dashed text-muted-foreground">
        Right Click Me
      </div>
    ),
  },
};

export const WithDropdownButton: Story = {
  render: (args) => (
    <Dropdown.Button
      {...args}
      dropdownProps={{ menu: { items } }}
      onClick={() => alert('Button clicked')}
    >
      Dropdown Button
    </Dropdown.Button>
  ),
};

export const Disabled: Story = {
  args: {
    menu: { items },
    disabled: true,
    children: (
      <Button disabled>
        Disabled <ChevronDown className="ml-2 w-4 h-4" />
      </Button>
    ),
  },
};
