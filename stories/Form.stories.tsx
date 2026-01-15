import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../src/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../src/components/ui/form';
import { Input } from '../src/components/ui/input';
import { Toaster } from '../src/components/ui/sonner';

const meta: Meta<typeof Form> = {
  title: 'UI/Form',
  component: Form,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex min-h-[350px] w-full items-center justify-center p-8">
        <Story />
        <Toaster />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Form>;

interface FormValues {
  username: string;
}

const ProfileForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      username: '',
    },
  });

  function onSubmit(data: FormValues) {
    toast.success('You submitted the following values:', {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="username"
          rules={{
            required: 'Username is required.',
            minLength: {
              value: 2,
              message: 'Username must be at least 2 characters.',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export const Default: Story = {
  render: () => <ProfileForm />,
  parameters: {
    docs: {
      source: {
        code: `
interface FormValues {
  username: string;
}

const ProfileForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      username: '',
    },
  });

  function onSubmit(data: FormValues) {
    toast.success('You submitted the following values:', {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="username"
          rules={{
            required: 'Username is required.',
            minLength: {
              value: 2,
              message: 'Username must be at least 2 characters.',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};`,
      },
    },
  },
};
