import type { Meta, StoryObj } from '@storybook/react';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '../src/components/ui/button-group';
import { Button } from '../src/components/ui/button';
import { ChevronDown, Plus } from 'lucide-react';

const meta: Meta<typeof ButtonGroup> = {
  title: 'UI/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: '排列方向',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">One</Button>
      <Button variant="outline">Two</Button>
      <Button variant="outline">Three</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">One</Button>
      <Button variant="outline">Two</Button>
      <Button variant="outline">Three</Button>
    </ButtonGroup>
  ),
};

export const WithSeparatorAndIcon: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline" size="icon">
        <Plus className="h-4 w-4" />
      </Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Create</Button>
      <ButtonGroupSeparator />
      <Button variant="outline" size="icon">
        <ChevronDown className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  ),
};

export const WithText: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupText>Label</ButtonGroupText>
      <Button variant="outline">Action</Button>
    </ButtonGroup>
  ),
};
