import * as React from 'react';
import { cn } from '../../lib/utils';
import {
  RadioGroup as BaseRadioGroup,
  RadioGroupItem as BaseRadioItem,
} from '../ui/radio-group';

export type RadioOption = {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
};

export interface EnhancedRadioGroupProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseRadioGroup>,
    'value' | 'onValueChange' | 'onChange'
  > {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  direction?: 'horizontal' | 'vertical';
  gap?: number;
  itemClassName?: string;
  labelClassName?: string;
}

const StyledRadioItem = React.forwardRef<
  React.ElementRef<typeof BaseRadioItem>,
  React.ComponentPropsWithoutRef<typeof BaseRadioItem>
>(({ className, ...props }, ref) => {
  return (
    <BaseRadioItem
      ref={ref}
      className={cn(
        'h-4 w-4 rounded-full transition-colors shadow-none',
        'data-[state=unchecked]:border-muted-foreground/30',
        'data-[state=checked]:border-primary',
        className
      )}
      indicatorClassName="w-2 h-2"
      {...props}
    />
  );
});
StyledRadioItem.displayName = 'StyledRadioItem';

const Group = React.forwardRef<
  React.ElementRef<typeof BaseRadioGroup>,
  EnhancedRadioGroupProps
>(
  (
    {
      value,
      defaultValue,
      onChange,
      options,
      direction = 'horizontal',
      gap = 24,
      itemClassName,
      labelClassName,
      className,
      name,
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<string | undefined>(
      defaultValue
    );
    const currentValue = isControlled ? value : internal;

    const handleChange = (val: string) => {
      if (!isControlled) setInternal(val);
      onChange?.(val);
    };

    return (
      <BaseRadioGroup
        ref={ref}
        value={currentValue}
        onValueChange={handleChange}
        className={cn(
          direction === 'horizontal'
            ? 'flex items-center'
            : 'flex flex-col items-start',
          className
        )}
        {...props}
      >
        {options.map((opt, idx) => {
          const id = name
            ? `${name}-${opt.value}`
            : `radio-${opt.value}-${idx}`;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={cn(
                'inline-flex items-center select-none',
                direction === 'horizontal'
                  ? `mr-[${gap}px] last:mr-0`
                  : `mb-[${gap / 2}px] last:mb-0`,
                opt.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer',
                opt.className
              )}
              style={
                direction === 'horizontal'
                  ? { marginRight: idx === options.length - 1 ? 0 : gap }
                  : { marginBottom: idx === options.length - 1 ? 0 : gap / 2 }
              }
            >
              <StyledRadioItem
                id={id}
                value={opt.value}
                disabled={opt.disabled}
                className={cn(itemClassName)}
              />
              <span
                className={cn(
                  'ml-2 text-[14px] leading-5 text-[#1f2329] font-normal',
                  labelClassName
                )}
              >
                {opt.label}
              </span>
            </label>
          );
        })}
      </BaseRadioGroup>
    );
  }
);
Group.displayName = 'EnhancedRadioGroup';

export interface EnhancedRadioProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseRadioItem>,
    'value' | 'onChange'
  > {
  label?: React.ReactNode;
  value: string;
  onChange?: (e: { target: { value: string } }) => void;
  labelClassName?: string;
}

const Radio = React.forwardRef<
  React.ElementRef<typeof BaseRadioItem>,
  EnhancedRadioProps
>(
  (
    { label, value, onChange, className, labelClassName, id, ...props },
    ref
  ) => {
    const handleClick = () => {
      onChange?.({ target: { value } });
    };

    const generatedId = id || `radio-${value}`;

    return (
      <div className="inline-flex items-center">
        <StyledRadioItem
          ref={ref}
          id={generatedId}
          value={value}
          onClick={handleClick}
          className={cn(className)}
          {...props}
        />
        {label && (
          <label
            htmlFor={generatedId}
            className={cn(
              'ml-2 text-[14px] leading-5 text-[#1f2329] font-normal cursor-pointer',
              labelClassName
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Radio.displayName = 'EnhancedRadio';

type RadioComponent = typeof Radio & {
  Group: typeof Group;
};
const ExportedRadio = Radio as RadioComponent;
ExportedRadio.Group = Group;

export { ExportedRadio as EnhancedRadio, Group as EnhancedRadioGroup };
