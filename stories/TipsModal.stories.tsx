import type { Meta, StoryObj } from '@storybook/react';
import TipsModalComponent, {
  openTipsModal,
  openModalWarning,
  openModalError,
  openModalWarning02,
} from '../src/components/TipsModal';
import NiceModal from '@ebay/nice-modal-react';
import { Button } from '../src/components/enhance-ui/Button';

// Wrapper to provide NiceModal context
const NiceModalWrapper = (Story: any) => (
  <NiceModal.Provider>
    <Story />
    <TipsModalComponent id="tips-modal" />
  </NiceModal.Provider>
);

const meta: Meta<typeof TipsModalComponent> = {
  title: 'Components/TipsModal',
  component: TipsModalComponent,
  decorators: [NiceModalWrapper],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TipsModalComponent>;

export const Basic: Story = {
  render: () => (
    <Button
      onClick={() =>
        openTipsModal('This is a basic tips modal', { title: 'Basic Hint' })
      }
    >
      Open Basic Modal
    </Button>
  ),
};

export const AsyncAction: Story = {
  render: () => (
    <Button
      onClick={() =>
        openTipsModal('Click Confirm to see loading state (waits 2s)', {
          title: 'Async Operation',
          onOkBeforeFunction: async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return true;
          },
        })
      }
    >
      Open Async Modal
    </Button>
  ),
};

export const Warning: Story = {
  render: () => (
    <Button
      onClick={() =>
        openModalWarning({
          title: 'Warning',
          description: 'This operation cannot be undone. Are you sure?',
          onOk: () => console.log('Confirmed'),
        })
      }
    >
      Open Warning Modal
    </Button>
  ),
};

export const Warning02: Story = {
  render: () => (
    <Button
      onClick={() =>
        openModalWarning02({
          title: 'Warning Type 2',
          content: 'This is another style of warning modal.',
          onOk: () => console.log('Confirmed'),
        })
      }
    >
      Open Warning 02 Modal
    </Button>
  ),
};

export const Error: Story = {
  render: () => (
    <Button
      danger
      onClick={() =>
        openModalError({
          title: 'Error Occurred',
          content: 'Something went wrong while processing your request.',
          onOk: () => console.log('Acknowledged'),
        })
      }
    >
      Open Error Modal
    </Button>
  ),
};

export const CustomContent: Story = {
  render: () => (
    <Button
      onClick={() =>
        openTipsModal(
          <div className="p-4 bg-muted rounded-md">
            <h4 className="font-bold mb-2">Custom Content</h4>
            <p>You can render complex React nodes here.</p>
            <ul className="list-disc pl-4 mt-2">
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </div>,
          { title: 'Custom Content Modal' }
        )
      }
    >
      Open Custom Content Modal
    </Button>
  ),
};

export const WithCountdown: Story = {
  render: () => (
    <Button
      onClick={() =>
        openTipsModal('Please wait for the countdown before confirming.', {
          title: 'Countdown Timer',
          countdown: 5,
          onOk: () => console.log('Confirmed after countdown'),
        })
      }
    >
      Open Countdown Modal
    </Button>
  ),
};
