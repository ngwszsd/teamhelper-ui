import type { Meta, StoryObj } from '@storybook/react';
import { InputNumber } from '../src/components/enhance-ui/InputNumber';
import { useState } from 'react';

const meta: Meta<typeof InputNumber> = {
  title: 'Enhanced UI/InputNumber',
  component: InputNumber,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
    },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    precision: { control: 'number' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    controls: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof InputNumber>;

export const Default: Story = {
  args: {
    placeholder: 'Basic usage',
    className: 'w-[200px]',
  },
};

export const WithControls: Story = {
  args: {
    controls: true,
    defaultValue: 1,
    className: 'w-[200px]',
  },
};

export const MinMax: Story = {
  args: {
    min: 0,
    max: 10,
    defaultValue: 5,
    className: 'w-[200px]',
  },
};

export const Step: Story = {
  args: {
    step: 0.1,
    defaultValue: 1,
    className: 'w-[200px]',
  },
};

export const Precision: Story = {
  args: {
    precision: 2,
    step: 0.1,
    defaultValue: 1.05,
    className: 'w-[200px]',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <InputNumber size="small" placeholder="Small" className="w-[200px]" />
      <InputNumber size="middle" placeholder="Middle" className="w-[200px]" />
      <InputNumber size="large" placeholder="Large" className="w-[200px]" />
    </div>
  ),
};

export const Formatter: Story = {
  args: {
    defaultValue: 1000,
    formatter: (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    parser: (value) => value?.replace(/\$\s?|(,*)/g, '') as any,
    className: 'w-[200px]',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 10,
    className: 'w-[200px]',
  },
};

export const Controlled = () => {
  const [value, setValue] = useState<number | null>(1);
  return (
    <div className="flex flex-col gap-4">
      <div>Current Value: {value}</div>
      <InputNumber
        value={value}
        onChange={setValue}
        className="w-[200px]"
        min={0}
        max={20}
      />
      <button
        onClick={() => setValue(10)}
        className="px-2 py-1 bg-primary text-primary-foreground rounded text-sm w-fit"
      >
        Set to 10
      </button>
    </div>
  );
};
