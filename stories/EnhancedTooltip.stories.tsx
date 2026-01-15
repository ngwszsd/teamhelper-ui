import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedTooltip } from '../src/components/enhance-ui/Tooltip';
import { Button } from '../src/components/enhance-ui/Button';

const meta: Meta<typeof EnhancedTooltip> = {
  title: 'Enhanced UI/Tooltip',
  component: EnhancedTooltip,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: '提示文字' },
    trigger: {
      control: 'select',
      options: ['hover', 'click', 'focus'],
      description: '触发行为',
    },
    placement: {
      control: 'select',
      options: [
        'top',
        'left',
        'right',
        'bottom',
        'topLeft',
        'topRight',
        'bottomLeft',
        'bottomRight',
        'leftTop',
        'leftBottom',
        'rightTop',
        'rightBottom',
      ],
      description: '气泡框位置',
    },
    arrow: { control: 'boolean', description: '是否显示箭头' },
    mouseEnterDelay: {
      control: 'number',
      description: '鼠标移入后延时多少秒显示',
    },
    mouseLeaveDelay: {
      control: 'number',
      description: '鼠标移出后延时多少秒隐藏',
    },
  },
};

export default meta;
type Story = StoryObj<typeof EnhancedTooltip>;

export const Default: Story = {
  args: {
    title: 'Prompt Text',
    children: <Button>Tooltip will show on mouse enter.</Button>,
  },
};

export const Placement: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 items-center mt-10 ml-20">
      <div className="flex gap-4">
        <EnhancedTooltip placement="topLeft" title="Prompt Text">
          <Button>TL</Button>
        </EnhancedTooltip>
        <EnhancedTooltip placement="top" title="Prompt Text">
          <Button>Top</Button>
        </EnhancedTooltip>
        <EnhancedTooltip placement="topRight" title="Prompt Text">
          <Button>TR</Button>
        </EnhancedTooltip>
      </div>
      <div className="flex w-full justify-between px-10">
        <div className="flex flex-col gap-4">
          <EnhancedTooltip placement="leftTop" title="Prompt Text">
            <Button>LT</Button>
          </EnhancedTooltip>
          <EnhancedTooltip placement="left" title="Prompt Text">
            <Button>Left</Button>
          </EnhancedTooltip>
          <EnhancedTooltip placement="leftBottom" title="Prompt Text">
            <Button>LB</Button>
          </EnhancedTooltip>
        </div>
        <div className="flex flex-col gap-4">
          <EnhancedTooltip placement="rightTop" title="Prompt Text">
            <Button>RT</Button>
          </EnhancedTooltip>
          <EnhancedTooltip placement="right" title="Prompt Text">
            <Button>Right</Button>
          </EnhancedTooltip>
          <EnhancedTooltip placement="rightBottom" title="Prompt Text">
            <Button>RB</Button>
          </EnhancedTooltip>
        </div>
      </div>
      <div className="flex gap-4">
        <EnhancedTooltip placement="bottomLeft" title="Prompt Text">
          <Button>BL</Button>
        </EnhancedTooltip>
        <EnhancedTooltip placement="bottom" title="Prompt Text">
          <Button>Bottom</Button>
        </EnhancedTooltip>
        <EnhancedTooltip placement="bottomRight" title="Prompt Text">
          <Button>BR</Button>
        </EnhancedTooltip>
      </div>
    </div>
  ),
};

export const Triggers: Story = {
  render: (args) => (
    <div className="flex gap-4">
      <EnhancedTooltip title="Hover me" trigger="hover">
        <Button>Hover</Button>
      </EnhancedTooltip>
      <EnhancedTooltip title="Click me" trigger="click">
        <Button>Click</Button>
      </EnhancedTooltip>
      <EnhancedTooltip title="Focus me" trigger="focus">
        <Button>Focus</Button>
      </EnhancedTooltip>
    </div>
  ),
};
