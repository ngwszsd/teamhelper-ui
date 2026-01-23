import * as React from 'react';
import { cn } from '../../lib/utils';
import { Checkbox as BaseCheckbox } from '../ui/checkbox';
import { Minus } from 'lucide-react';

export type CheckboxValue = string | number;

export type CheckboxOption = {
  label: React.ReactNode;
  value: CheckboxValue;
  disabled?: boolean;
  className?: string;
};

export interface EnhancedCheckboxProps extends Omit<
  React.ComponentPropsWithoutRef<typeof BaseCheckbox>,
  'checked' | 'onCheckedChange' | 'onChange'
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: {
    target: { checked: boolean; value?: CheckboxValue };
  }) => void;
  indeterminate?: boolean;
  label?: React.ReactNode;
  labelClassName?: string;
  value?: CheckboxValue;
}

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof BaseCheckbox>,
  EnhancedCheckboxProps
>(
  (
    {
      checked,
      defaultChecked,
      onChange,
      indeterminate,
      label,
      children,
      labelClassName,
      className,
      disabled,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const isControlled = checked !== undefined;
    const [internal, setInternal] = React.useState<boolean>(!!defaultChecked);
    const current = isControlled ? !!checked : internal;

    const handleChange = (next: boolean) => {
      if (!isControlled) setInternal(next);
      onChange?.({ target: { checked: next, value } });
    };

    const generatedId =
      id ||
      `checkbox-${String(value ?? '')}-${Math.random().toString(36).slice(2)}`;
    const labelNode = children ?? label;

    return (
      <div className={cn('inline-flex items-center', className)}>
        <div className="relative">
          <BaseCheckbox
            ref={ref}
            id={generatedId}
            checked={current && !indeterminate}
            onCheckedChange={(v) => handleChange(!!v)}
            aria-checked={indeterminate ? 'mixed' : current}
            disabled={disabled}
            {...props}
          />
          {indeterminate && !current && (
            <span className="pointer-events-none absolute inset-0 grid place-content-center text-primary">
              <Minus className="h-3 w-3" />
            </span>
          )}
        </div>
        {labelNode && (
          <span
            className={cn(
              'ml-2 text-sm leading-5 text-foreground',
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              labelClassName
            )}
            onClick={() => {
              if (disabled) return;
              handleChange(!current);
            }}
          >
            {labelNode}
          </span>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'EnhancedCheckbox';

export interface EnhancedCheckboxGroupProps {
  options: CheckboxOption[];
  value?: CheckboxValue[];
  defaultValue?: CheckboxValue[];
  onChange?: (value: CheckboxValue[]) => void;
  disabled?: boolean;
  direction?: 'horizontal' | 'vertical';
  gap?: number;
  itemClassName?: string;
  labelClassName?: string;
  className?: string;
  name?: string;
}

const Group = React.forwardRef<HTMLDivElement, EnhancedCheckboxGroupProps>(
  (
    {
      options,
      value,
      defaultValue,
      onChange,
      disabled = false,
      direction = 'horizontal',
      gap = 24,
      itemClassName,
      labelClassName,
      className,
      name,
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<CheckboxValue[]>(
      () => defaultValue ?? []
    );
    const selected = isControlled ? (value as CheckboxValue[]) : internal;

    const toggle = (val: CheckboxValue, checked: boolean) => {
      const set = new Set(selected);
      if (checked) set.add(val);
      else set.delete(val);
      const next = Array.from(set);
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    return (
      <div
        ref={ref}
        className={cn(
          direction === 'horizontal'
            ? 'flex items-center'
            : 'flex flex-col items-start',
          className
        )}
      >
        {options.map((opt, idx) => {
          const id = name
            ? `${name}-${String(opt.value)}`
            : `checkbox-${String(opt.value)}-${idx}`;
          const checked = selected.includes(opt.value);
          return (
            <div
              key={String(opt.value)}
              className={cn(
                'inline-flex items-center select-none',
                direction === 'horizontal'
                  ? `mr-[${gap}px] last:mr-0`
                  : `mb-[${gap / 2}px] last:mb-0`,
                disabled || opt.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer',
                opt.className
              )}
              style={
                direction === 'horizontal'
                  ? { marginRight: idx === options.length - 1 ? 0 : gap }
                  : { marginBottom: idx === options.length - 1 ? 0 : gap / 2 }
              }
              onClick={() => {
                if (disabled || opt.disabled) return;
                toggle(opt.value, !checked);
              }}
            >
              <BaseCheckbox
                id={id}
                checked={checked}
                onCheckedChange={(v) => toggle(opt.value, !!v)}
                disabled={disabled || opt.disabled}
                className={cn(itemClassName)}
              />
              <span
                className={cn(
                  'ml-2 text-sm leading-5 text-foreground',
                  labelClassName
                )}
              >
                {opt.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
);
Group.displayName = 'EnhancedCheckboxGroup';

type CheckboxComponent = typeof Checkbox & { Group: typeof Group };
const ExportedCheckbox = Checkbox as CheckboxComponent;
ExportedCheckbox.Group = Group;

export { ExportedCheckbox as EnhancedCheckbox, Group as EnhancedCheckboxGroup };
