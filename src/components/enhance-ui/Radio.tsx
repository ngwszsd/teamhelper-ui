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

export interface EnhancedRadioGroupProps extends Omit<
  React.ComponentPropsWithoutRef<typeof BaseRadioGroup>,
  'value' | 'onValueChange' | 'onChange'
> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  direction?: 'horizontal' | 'vertical';
  itemClassName?: string;
  labelClassName?: string;
  optionClassName?: string;
}

const StyledRadioItem = React.forwardRef<
  React.ComponentRef<typeof BaseRadioItem>,
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
  React.ComponentRef<typeof BaseRadioGroup>,
  EnhancedRadioGroupProps
>(
  (
    {
      value,
      defaultValue,
      onChange,
      options,
      direction = 'horizontal',
      itemClassName,
      labelClassName,
      className,
      name,
      optionClassName,
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
                'inline-flex items-center select-none gap-[14px]',
                opt.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer',
                optionClassName,
                opt.className
              )}
            >
              <StyledRadioItem
                id={id}
                value={opt.value}
                disabled={opt.disabled}
                className={cn('shrink-0', itemClassName)}
              />
              <div
                className={cn(
                  'text-sm leading-5 text-foreground font-normal',
                  labelClassName
                )}
              >
                {opt.label}
              </div>
            </label>
          );
        })}
      </BaseRadioGroup>
    );
  }
);
Group.displayName = 'EnhancedRadioGroup';

export interface EnhancedRadioProps extends Omit<
  React.ComponentPropsWithoutRef<typeof BaseRadioItem>,
  'value' | 'onChange'
> {
  label?: React.ReactNode;
  value: string;
  onChange?: (e: { target: { value: string } }) => void;
  labelClassName?: string;
}

const Radio = React.forwardRef<
  React.ComponentRef<typeof BaseRadioItem>,
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
          className={cn('shrink-0', className)}
          {...props}
        />
        {label && (
          <label
            htmlFor={generatedId}
            className={cn(
              'ml-2 text-sm leading-5 text-foreground font-normal cursor-pointer',
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
