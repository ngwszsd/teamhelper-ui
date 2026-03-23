'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SegmentedOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: (SegmentedOption | string)[];
  size?: 'small' | 'middle' | 'large';
  block?: boolean;
  disabled?: boolean;
}

function normalizeOptions(
  options: (SegmentedOption | string)[]
): SegmentedOption[] {
  return options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );
}

const SegmentedControl = React.forwardRef<
  HTMLDivElement,
  SegmentedControlProps
>(
  (
    {
      value,
      defaultValue,
      onChange,
      options: rawOptions,
      size = 'middle',
      block = false,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const options = normalizeOptions(rawOptions);
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState(
      defaultValue ?? options[0]?.value ?? ''
    );
    const currentValue = isControlled ? value : internal;

    const containerRef = React.useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({});

    const updateIndicator = React.useCallback(() => {
      const container = containerRef.current;
      if (!container) return;
      const activeEl = container.querySelector<HTMLElement>(
        '[data-state="active"]'
      );
      if (!activeEl) {
        setIndicatorStyle({ opacity: 0 });
        return;
      }
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1,
      });
    }, []);

    React.useEffect(() => {
      updateIndicator();
    }, [currentValue, updateIndicator]);

    React.useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const observer = new ResizeObserver(updateIndicator);
      observer.observe(container);
      return () => observer.disconnect();
    }, [updateIndicator]);

    const handleSelect = (val: string) => {
      if (disabled) return;
      if (!isControlled) setInternal(val);
      onChange?.(val);
    };

    const sizeClasses = {
      small: 'h-7 text-xs',
      middle: 'h-8 text-sm',
      large: 'h-9 text-sm',
    };

    const itemPadding = {
      small: 'px-2',
      middle: 'px-3',
      large: 'px-4',
    };

    return (
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        role="radiogroup"
        className={cn(
          'relative inline-flex items-center rounded-lg bg-muted p-1 gap-0.5',
          sizeClasses[size],
          block && 'flex w-full',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {/* Sliding indicator */}
        <div
          className="absolute top-1 bottom-1 rounded-md bg-background shadow-sm transition-all duration-200 ease-out"
          style={indicatorStyle}
        />

        {options.map((opt) => {
          const isActive = opt.value === currentValue;
          const isDisabled = disabled || opt.disabled;

          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              data-state={isActive ? 'active' : 'inactive'}
              disabled={isDisabled}
              onClick={() => !isDisabled && handleSelect(opt.value)}
              className={cn(
                'relative z-[1] inline-flex items-center justify-center gap-1.5 rounded-md font-medium whitespace-nowrap transition-colors select-none',
                itemPadding[size],
                block && 'flex-1',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
                isDisabled
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              )}
            >
              {opt.icon}
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }
);

SegmentedControl.displayName = 'SegmentedControl';

export { SegmentedControl };
