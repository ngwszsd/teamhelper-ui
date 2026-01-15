import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedInput, SearchInput } from '../src/components/enhance-ui/Input';
import { Search } from 'lucide-react';

const meta: Meta<typeof EnhancedInput> = {
  title: 'Enhanced UI/Input',
  component: EnhancedInput,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
      description: '输入框尺寸',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    placeholder: {
      control: 'text',
      description: '占位符',
    },
  },
};

export default meta;
type Story = StoryObj<typeof EnhancedInput>;

export const Default: Story = {
  args: {
    placeholder: 'Basic usage',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 max-w-sm">
      <EnhancedInput {...args} size="large" placeholder="Large size" />
      <EnhancedInput {...args} size="middle" placeholder="Default size" />
      <EnhancedInput {...args} size="small" placeholder="Small size" />
    </div>
  ),
};

export const SearchDefault: StoryObj<typeof SearchInput> = {
  render: (args) => (
    <div className="flex flex-col gap-4 max-w-sm">
      <SearchInput
        {...args}
        placeholder="input search text"
        onSearch={(value) => console.log(value)}
      />
      <SearchInput
        {...args}
        placeholder="input search text"
        allowClear
        onSearch={(value) => console.log(value)}
      />
      <SearchInput
        {...args}
        placeholder="input search text"
        enterButton="Search"
        size="large"
        onSearch={(value) => console.log(value)}
      />
      <SearchInput
        {...args}
        placeholder="input search text"
        enterButton={<Search className="w-4 h-4" />}
        size="large"
        onSearch={(value) => console.log(value)}
      />
    </div>
  ),
};

export const SearchLoading: StoryObj<typeof SearchInput> = {
  render: (args) => (
    <div className="flex flex-col gap-4 max-w-sm">
      <SearchInput {...args} placeholder="Search loading" loading enterButton />
      <SearchInput {...args} placeholder="Search loading" loading />
    </div>
  ),
};
