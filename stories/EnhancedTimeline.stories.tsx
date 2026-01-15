import type { Meta, StoryObj } from '@storybook/react';
import { Timeline } from '../src/components/enhance-ui/Timeline';
import { Clock, CheckCircle2 } from 'lucide-react';

const meta: Meta<typeof Timeline> = {
  title: 'Enhanced UI/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['left', 'right', 'alternate'],
      description: '模式',
    },
    reverse: { control: 'boolean', description: '是否倒序' },
    pending: { control: 'text', description: '幽灵节点内容' },
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

const items = [
  {
    children: 'Create a services site 2015-09-01',
  },
  {
    children: 'Solve initial network problems 2015-09-01',
  },
  {
    children: 'Technical testing 2015-09-01',
  },
  {
    children: 'Network problems being solved 2015-09-01',
  },
];

export const Default: Story = {
  args: {
    items,
  },
};

export const Alternate: Story = {
  args: {
    mode: 'alternate',
    items: [
      {
        children: 'Create a services site 2015-09-01',
      },
      {
        children: 'Solve initial network problems 2015-09-01',
        color: 'green',
      },
      {
        dot: <Clock className="w-4 h-4" />,
        color: 'red',
        children: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
      },
      {
        color: 'blue',
        children: 'Network problems being solved 2015-09-01',
      },
      {
        children: 'Create a services site 2015-09-01',
      },
      {
        dot: <CheckCircle2 className="w-4 h-4" />,
        children: 'Technical testing 2015-09-01',
      },
    ],
  },
};

export const Color: Story = {
  args: {
    items: [
      {
        color: 'green',
        children: 'Create a services site 2015-09-01',
      },
      {
        color: 'green',
        children: 'Create a services site 2015-09-01',
      },
      {
        color: 'red',
        children: (
          <>
            <p>Solve initial network problems 1</p>
            <p>Solve initial network problems 2</p>
            <p>Solve initial network problems 3 2015-09-01</p>
          </>
        ),
      },
      {
        children: (
          <>
            <p>Technical testing 1</p>
            <p>Technical testing 2</p>
            <p>Technical testing 3 2015-09-01</p>
          </>
        ),
      },
      {
        color: 'gray',
        children: (
          <>
            <p>Technical testing 1</p>
            <p>Technical testing 2</p>
            <p>Technical testing 3 2015-09-01</p>
          </>
        ),
      },
      {
        color: 'gray',
        children: (
          <>
            <p>Technical testing 1</p>
            <p>Technical testing 2</p>
            <p>Technical testing 3 2015-09-01</p>
          </>
        ),
      },
    ],
  },
};

export const Pending: Story = {
  args: {
    pending: 'Recording...',
    items: [
      {
        children: 'Create a services site 2015-09-01',
      },
      {
        children: 'Solve initial network problems 2015-09-01',
      },
      {
        children: 'Technical testing 2015-09-01',
      },
    ],
  },
};

export const Custom: Story = {
  args: {
    items: [
      {
        children: 'Create a services site 2015-09-01',
      },
      {
        children: 'Solve initial network problems 2015-09-01',
      },
      {
        dot: <Clock className="h-4 w-4" />,
        color: 'red',
        children: 'Technical testing 2015-09-01',
      },
      {
        children: 'Network problems being solved 2015-09-01',
      },
    ],
  },
};

export const Label: Story = {
  args: {
    mode: 'alternate',
    items: [
      {
        label: '2015-09-01',
        children: 'Create a services',
      },
      {
        label: '2015-09-01 09:12:11',
        children: 'Solve initial network problems',
      },
      {
        children: 'Technical testing',
      },
      {
        label: '2015-09-01 09:12:11',
        children: 'Network problems being solved',
      },
    ],
  },
};
