import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedTabs } from '../src/components/enhance-ui/Tabs';
import { Button } from '../src/components/enhance-ui/Button';

const meta: Meta<typeof EnhancedTabs> = {
  title: 'Enhanced UI/Tabs',
  component: EnhancedTabs,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['line', 'card'],
      description: '页签的基本样式',
    },
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
      description: '大小',
    },
    tabPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: '页签位置',
    },
    underline: { control: 'boolean', description: '是否使用下划线风格' },
    animated: { control: 'boolean', description: '是否使用动画切换' },
  },
};

export default meta;
type Story = StoryObj<typeof EnhancedTabs>;

const items = [
  {
    key: '1',
    label: 'Tab 1',
    children: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: 'Tab 2',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'Tab 3',
    children: 'Content of Tab Pane 3',
  },
];

export const Default: Story = {
  args: {
    defaultActiveKey: '1',
    items,
  },
};

export const Card: Story = {
  args: {
    type: 'card',
    defaultActiveKey: '1',
    items,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <EnhancedTabs {...args} size="small" items={items} />
      <EnhancedTabs {...args} size="middle" items={items} />
      <EnhancedTabs {...args} size="large" items={items} />
    </div>
  ),
  args: {
    defaultActiveKey: '1',
  },
};

export const Position: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-2 font-bold">Top</h3>
        <EnhancedTabs {...args} tabPosition="top" items={items} />
      </div>
      <div>
        <h3 className="mb-2 font-bold">Left</h3>
        <EnhancedTabs
          {...args}
          tabPosition="left"
          items={items}
          className="h-40"
        />
      </div>
      <div>
        <h3 className="mb-2 font-bold">Right</h3>
        <EnhancedTabs
          {...args}
          tabPosition="right"
          items={items}
          className="h-40"
        />
      </div>
      <div>
        <h3 className="mb-2 font-bold">Bottom</h3>
        <EnhancedTabs {...args} tabPosition="bottom" items={items} />
      </div>
    </div>
  ),
  args: {
    defaultActiveKey: '1',
  },
};

export const Underline: Story = {
  args: {
    underline: true,
    defaultActiveKey: '1',
    items,
  },
};

export const WithExtraContent: Story = {
  args: {
    defaultActiveKey: '1',
    items,
    tabBarExtraContent: {
      left: (
        <Button size="small" type="text">
          Left Action
        </Button>
      ),
      right: <Button size="small">Right Action</Button>,
    },
  },
};

export const Editable: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [tabs, setTabs] = React.useState([
      {
        key: '1',
        label: 'Tab 1',
        children: 'Content of Tab 1',
        closable: false,
      },
      {
        key: '2',
        label: 'Tab 2',
        children: 'Content of Tab 2',
        closable: true,
      },
      {
        key: '3',
        label: 'Tab 3',
        children: 'Content of Tab 3',
        closable: true,
      },
    ]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeKey, setActiveKey] = React.useState('1');

    const handleEdit = (targetKey: string, action: 'add' | 'remove') => {
      if (action === 'remove') {
        const targetIndex = tabs.findIndex((pane) => pane.key === targetKey);
        const newTabs = tabs.filter((pane) => pane.key !== targetKey);
        if (newTabs.length && targetKey === activeKey) {
          const { key } =
            newTabs[
              targetIndex === newTabs.length ? targetIndex - 1 : targetIndex
            ];
          setActiveKey(key);
        }
        setTabs(newTabs);
      }
    };

    return (
      <EnhancedTabs
        type="card"
        activeKey={activeKey}
        onChange={setActiveKey}
        items={tabs}
        onEdit={handleEdit}
      />
    );
  },
};
