import * as React from 'react';
import { cn } from '../../lib/utils';
import { Input as BaseInput } from '../ui/input';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { EnhancedButton } from './Button';
import { useMemo } from 'react';

type InputSize = 'small' | 'middle' | 'large';

const sizeClasses: Record<InputSize, string> = {
  small: 'h-8 px-2 text-sm',
  middle: 'h-9 px-3 text-base md:text-sm',
  large: 'h-11 px-4 text-base',
};

export interface InputNumberProps extends Omit<
  React.ComponentProps<'input'>,
  'size' | 'onChange' | 'value' | 'defaultValue' | 'min' | 'max'
> {
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
  size?: InputSize;
  min?: number;
  max?: number;
  step?: number | string;
  precision?: number;
  controls?: boolean;
  formatter?: (value: number | undefined) => string;
  parser?: (displayValue: string | undefined) => number | undefined;
  inputClassName?: string;
  isUpdateToMin?: boolean;
}

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      className,
      inputClassName,
      size = 'middle',
      min = Number.MIN_SAFE_INTEGER,
      max = Number.MAX_SAFE_INTEGER,
      step = 1,
      precision,
      controls = true,
      value,
      defaultValue,
      onChange,
      formatter,
      parser,
      disabled,
      readOnly,
      onBlur,
      onFocus,
      onKeyDown,
      isUpdateToMin = false,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<number | null>(
      defaultValue ?? null
    );
    const [inputValue, setInputValue] = React.useState<string>('');

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const lastEmittedValue = React.useRef<number | null | undefined>(
      defaultValue ?? value
    );

    // Sync inputValue with currentValue when currentValue changes externally
    React.useEffect(() => {
      if (currentValue === lastEmittedValue.current) return;

      const formatted =
        currentValue !== null && currentValue !== undefined
          ? formatter
            ? formatter(currentValue)
            : currentValue.toString()
          : '';
      setInputValue(formatted);
      lastEmittedValue.current = currentValue;
    }, [currentValue, formatter]);

    // Initial load
    React.useEffect(() => {
      // This is needed to set initial inputValue if defaultValue/value is present
      // and to handle the first render if not covered by the above effect
      const val = isControlled ? value : internalValue;
      const formatted =
        val !== null && val !== undefined
          ? formatter
            ? formatter(val)
            : val.toString()
          : '';
      if (inputValue === '' && formatted !== '') {
        setInputValue(formatted);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const parseValue = (text: string): number | null => {
      if (text === '') return null;
      if (parser) {
        const val = parser(text);
        return val ?? null;
      }
      const parsed = parseFloat(text);
      return isNaN(parsed) ? null : parsed;
    };

    const updateValue = (nextVal: number | null, triggerChange = true) => {
      let finalVal = nextVal;

      if (finalVal !== null) {
        if (finalVal < min) finalVal = min;
        if (finalVal > max) finalVal = max;

        if (precision !== undefined) {
          finalVal = parseFloat(finalVal.toFixed(precision));
        }
      }

      if (triggerChange) {
        if (isUpdateToMin) {
          finalVal = finalVal ?? min;
        }
        if (!isControlled) {
          setInternalValue(finalVal);
        }
        lastEmittedValue.current = finalVal;
        onChange?.(finalVal);
      }

      return finalVal;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);

      const parsed = parseValue(val);
      // Only fire onChange if it's a valid number or empty
      // And we don't clamp while typing
      if (parsed !== null && !isNaN(parsed)) {
        if (!isControlled) setInternalValue(parsed);
        lastEmittedValue.current = parsed;
        onChange?.(parsed);
      } else if (val === '' || val === '-') {
        if (!isControlled) setInternalValue(null);
        lastEmittedValue.current = null;
        onChange?.(null);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);

      let parsed = parseValue(inputValue);

      // If invalid input, revert to currentValue
      if (inputValue !== '' && inputValue !== '-' && parsed === null) {
        parsed = currentValue ?? null;
      }

      const finalVal = updateValue(parsed, true);

      // Format display
      const formatted =
        finalVal !== null && finalVal !== undefined
          ? formatter
            ? formatter(finalVal)
            : finalVal.toString()
          : '';
      setInputValue(formatted);
    };

    const handleStep = (type: 'up' | 'down') => {
      if (disabled || readOnly) return;

      const current = currentValue ?? 0;
      const stepNum = Number(step);

      let nextVal;
      if (type === 'up') {
        nextVal = current + stepNum;
      } else {
        nextVal = current - stepNum;
      }

      // Basic float fix if precision not provided, but better to use precision if available
      if (precision !== undefined) {
        nextVal = parseFloat(nextVal.toFixed(precision));
      }

      const finalVal = updateValue(nextVal, true);

      const formatted =
        finalVal !== null && finalVal !== undefined
          ? formatter
            ? formatter(finalVal)
            : finalVal.toString()
          : '';
      setInputValue(formatted);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleStep('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleStep('down');
      } else if (e.key === 'Enter') {
        // Trigger blur logic effectively
        e.currentTarget.blur();
      }
      onKeyDown?.(e);
    };

    const isDisabledUp = useMemo(() => {
      const bool =
        currentValue !== null &&
        currentValue !== undefined &&
        currentValue >= max;
      return bool;
    }, [currentValue, max]);

    const isDisabledDown = useMemo(() => {
      const bool =
        currentValue !== null &&
        currentValue !== undefined &&
        currentValue <= min;
      return bool;
    }, [currentValue, min]);

    return (
      <div className={cn('relative inline-flex w-full', className)}>
        <BaseInput
          ref={ref}
          type="text"
          autoComplete="off"
          role="spinbutton"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue ?? undefined}
          disabled={disabled}
          readOnly={readOnly}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={onFocus}
          onKeyDown={handleKeyDown}
          className={cn(
            'shadow-none',
            sizeClasses[size],
            controls && 'pr-8',
            inputClassName
          )}
          {...props}
        />
        {controls && !disabled && !readOnly && (
          <div
            className="absolute right-px top-px border-l border-border flex flex-col justify-between overflow-hidden rounded-tr-md rounded-br-md"
            style={{
              height: 'calc(100% - 1px * 2)',
            }}
          >
            <EnhancedButton
              className={cn(
                'border-0 shadow-none text-foreground bg-transparent',
                'hover:text-foreground hover:bg-foreground/5',
                'py-0 h-auto border-b border-border rounded-none px-2!',
                'flex-1',
                isDisabledUp && 'cursor-not-allowed'
              )}
              onClick={() => handleStep('up')}
              disabled={isDisabledUp}
            >
              <ChevronUp className="w-3! h-3!" />
            </EnhancedButton>

            <EnhancedButton
              className={cn(
                'border-0 shadow-none text-foreground bg-transparent',
                'hover:text-foreground hover:bg-foreground/5',
                'py-0 h-auto rounded-none px-2!',
                'flex-1',
                isDisabledDown && 'cursor-not-allowed'
              )}
              onClick={() => handleStep('down')}
              disabled={isDisabledDown}
            >
              <ChevronDown className="w-3! h-3!" />
            </EnhancedButton>
          </div>
        )}
      </div>
    );
  }
);

InputNumber.displayName = 'EnhancedInputNumber';

export { InputNumber };
