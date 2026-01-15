import type { Meta, StoryObj } from '@storybook/react';
import { Upload } from '../src/components/enhance-ui/Upload';
import { Button } from '../src/components/ui/button';
import { UploadCloud } from 'lucide-react';

const meta: Meta<typeof Upload> = {
  title: 'Enhanced UI/Upload',
  component: Upload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Upload>;

export const Default: Story = {
  args: {
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    children: (
      <Button variant="outline">
        <UploadCloud className="mr-2 h-4 w-4" /> Click to Upload
      </Button>
    ),
  },
};

export const WithDefaultFileList: Story = {
  args: {
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    defaultFileList: [
      {
        uid: '1',
        name: 'image.png',
        status: 'done',
        url: 'https://github.com/shadcn.png',
        size: 1024,
        type: 'image/png',
        originFileObj: new File([], 'image.png'),
      },
      {
        uid: '2',
        name: 'report.pdf',
        status: 'error',
        size: 2048,
        type: 'application/pdf',
        originFileObj: new File([], 'report.pdf'),
      },
    ],
    children: (
      <Button variant="outline">
        <UploadCloud className="mr-2 h-4 w-4" /> Upload Files
      </Button>
    ),
  },
};

export const MaxCount: Story = {
  args: {
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    maxCount: 2,
    children: (
      <Button variant="outline">
        <UploadCloud className="mr-2 h-4 w-4" /> Max 2 Files
      </Button>
    ),
  },
};

export const Dragger: Story = {
  render: (args) => (
    <div className="w-[400px]">
      <Upload.Dragger {...(args as any)}>
        <div className="p-8 text-center">
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm font-semibold">
            Click or drag file to this area to upload
          </p>
          <p className="text-xs text-gray-500">
            Support for a single or bulk upload.
          </p>
        </div>
      </Upload.Dragger>
    </div>
  ),
  args: {
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    multiple: true,
  },
};
