import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { Button } from '../src/components/enhance-ui/Button';
import { useState } from 'react';

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

// Component that throws an error
const BuggyComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('I crashed!');
  }
  return (
    <div className="p-4 border rounded bg-green-50 text-green-800">
      I am a healthy component.
    </div>
  );
};

const ErrorTrigger = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  return (
    <div className="flex flex-col gap-4 items-center">
      <BuggyComponent shouldThrow={shouldThrow} />
      <Button onClick={() => setShouldThrow(true)} danger>
        Throw Error
      </Button>
      <p className="text-sm text-muted-foreground">
        Clicking the button will trigger a React error, which will be caught by
        the ErrorBoundary.
      </p>
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <ErrorBoundary>
      <ErrorTrigger />
    </ErrorBoundary>
  ),
};

export const WithCustomChildren: Story = {
  render: () => (
    <ErrorBoundary>
      <div className="p-8 border border-dashed rounded-lg text-center">
        <h1>Safe Content</h1>
        <p>This content is protected by the error boundary.</p>
      </div>
    </ErrorBoundary>
  ),
};
