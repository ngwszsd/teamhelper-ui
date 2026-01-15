import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from '../src/components/enhance-ui/Modal';
import { Button } from '../src/components/enhance-ui/Button';
import { useState } from 'react';

const meta: Meta<typeof Modal> = {
  title: 'Enhanced UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'danger'],
      description: 'Modal type',
    },
    footerBtnPosition: {
      control: 'select',
      options: ['left', 'center', 'right', 'block'],
      description: 'Footer button position',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Basic: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
        <Modal
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="Basic Modal"
          onOk={() => console.log('OK clicked')}
          onCancel={() => console.log('Cancel clicked')}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </>
    );
  },
};

export const AsyncLogic: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open Async Modal
        </Button>
        <Modal
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="Async Modal"
          onOk={async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log('Async OK clicked');
          }}
        >
          <p>Click OK to trigger async loading (2s delay)...</p>
        </Modal>
      </>
    );
  },
};

export const DangerType: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button danger type="primary" onClick={() => setOpen(true)}>
          Open Danger Modal
        </Button>
        <Modal
          {...args}
          type="danger"
          open={open}
          onOpenChange={setOpen}
          title="Danger Modal"
          okText="Delete"
          onOk={() => console.log('Delete clicked')}
        >
          <p>Are you sure you want to delete this item?</p>
        </Modal>
      </>
    );
  },
};

export const CustomFooter: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Custom Footer Modal</Button>
        <Modal
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="Custom Footer"
          isShowFooter={false}
        >
          <p>This modal has hidden default footer.</p>
          <div className="flex justify-end mt-4 gap-2">
            <Button onClick={() => setOpen(false)}>Custom Cancel</Button>
            <Button type="primary" onClick={() => setOpen(false)}>
              Custom OK
            </Button>
          </div>
        </Modal>
      </>
    );
  },
};
