import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '../../lib/utils';

function Switch({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof SwitchPrimitives.Root>) {
  const [internalChecked, setInternalChecked] = React.useState(
    defaultChecked ?? false,
  );
  const on = checked ?? internalChecked;

  const handleChange = React.useCallback(
    (val: boolean) => {
      if (checked === undefined) setInternalChecked(val);
      onCheckedChange?.(val);
    },
    [checked, onCheckedChange],
  );

  return (
    <SwitchPrimitives.Root
      data-slot="switch"
      className={cn(
        'peer inline-flex h-4.5 w-8 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      style={{ backgroundColor: on ? 'var(--primary)' : 'var(--input)' }}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={handleChange}
      {...props}
    >
      <SwitchPrimitives.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block h-3.5 w-3.5 rounded-full bg-background ring-0 transition-transform duration-200"
        style={{ transform: on ? 'translateX(13px)' : 'translateX(1px)' }}
      />
    </SwitchPrimitives.Root>
  );
}

export { Switch };
