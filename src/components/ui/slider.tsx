import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '../../lib/utils';

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    trackClassName?: string;
    rangeClassName?: string;
    thumbClassName?: string;
    markContent?: React.ReactNode;
    thumbChildren?: React.ReactNode;
  }
>(
  (
    {
      className,
      trackClassName,
      rangeClassName,
      thumbClassName,
      markContent,
      thumbChildren,
      ...props
    },
    ref
  ) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          'relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20',
          trackClassName
        )}
      >
        <SliderPrimitive.Range
          className={cn('absolute h-full bg-primary', rangeClassName)}
        />
      </SliderPrimitive.Track>

      {markContent}

      <SliderPrimitive.Thumb
        className={cn(
          'block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          thumbClassName
        )}
      >
        {thumbChildren}
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  )
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
