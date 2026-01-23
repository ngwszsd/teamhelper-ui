import * as React from 'react';
import { cn } from '../../lib/utils';
import { type ClassValue } from 'clsx';
import { Input as BaseInput } from '../ui/input';
import { Button } from './Button';
import { Search as SearchIcon, X as XIcon, Loader2 } from 'lucide-react';

type InputSize = 'small' | 'middle' | 'large';

const sizeClasses: Record<InputSize, string> = {
  small: 'h-8 px-2 text-sm',
  middle: 'h-9 px-3 text-base md:text-sm',
  large: 'h-11 px-4 text-base',
};

export type InternalInputProps = Omit<React.ComponentProps<'input'>, 'size'> & {
  size?: InputSize;
};

const InternalInput = React.forwardRef<HTMLInputElement, InternalInputProps>(
  ({ className, size = 'middle', ...props }, ref) => {
    return (
      <BaseInput
        ref={ref}
        className={cn('shadow-none', sizeClasses[size as InputSize], className)}
        {...props}
      />
    );
  }
);
InternalInput.displayName = 'EnhancedInput';

export interface EnhancedInputSearchProps extends Omit<
  React.ComponentProps<'input'>,
  'size'
> {
  value?: string;
  defaultValue?: string;
  allowClear?: boolean;
  enterButton?: boolean | React.ReactNode;
  loading?: boolean;
  size?: InputSize;
  inputClassName?: ClassValue;
  className?: string;
  onSearch?: (
    value: string,
    event?: React.KeyboardEvent | React.MouseEvent
  ) => void;
}

const SearchInput = React.forwardRef<
  HTMLInputElement,
  EnhancedInputSearchProps
>(
  (
    {
      value,
      defaultValue,
      onChange,
      onSearch,
      allowClear = true,
      enterButton = false,
      loading = false,
      size = 'middle',
      disabled,
      inputClassName,
      className,
      ...rest
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? ''
    );
    const isControlled = value !== undefined;
    const currentValue = isControlled ? (value ?? '') : internalValue;

    const updateValue = (next: string) => {
      if (!isControlled) setInternalValue(next);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      updateValue(e.target.value);
    };

    const triggerSearch = (e: React.KeyboardEvent | React.MouseEvent) => {
      if (disabled || loading) return;
      onSearch?.(currentValue, e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') triggerSearch(e);
    };

    const showClear = allowClear && !disabled && !!currentValue;

    const renderEnterButton = () => {
      if (!enterButton) return null;

      if (enterButton === true) {
        return (
          <Button
            type="primary"
            size={size}
            className="ml-2"
            disabled={disabled}
            loading={loading}
            icon={<SearchIcon className="h-4 w-4" />}
            onClick={(e) => triggerSearch(e)}
          />
        );
      }

      if (React.isValidElement(enterButton)) {
        const existingOnClick = (enterButton as any).props?.onClick;
        return React.cloneElement(enterButton as React.ReactElement<any>, {
          className: cn((enterButton as any).props?.className, 'ml-2'),
          onClick: (e: React.MouseEvent) => {
            existingOnClick?.(e);
            triggerSearch(e);
          },
        });
      }

      return null;
    };

    return (
      <div className={cn('flex w-full items-center', className)}>
        <div className="relative flex-1">
          {!enterButton && (
            <div className="pointer-events-none absolute left-2 top-1/2 flex -translate-y-1/2 items-center">
              <button
                type="button"
                className="pointer-events-auto text-muted-foreground disabled:opacity-50"
                disabled={disabled || loading}
                onClick={(e) => triggerSearch(e)}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SearchIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          )}

          <InternalInput
            ref={ref}
            disabled={disabled}
            value={currentValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={cn(
              sizeClasses[size],
              !enterButton && 'pl-8 pr-7',
              inputClassName
            )}
            {...rest}
          />

          {!enterButton && (
            <div className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center">
              {showClear && (
                <button
                  type="button"
                  className="pointer-events-auto text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => {
                    updateValue('');
                    onChange?.({
                      target: { value: '' },
                    } as unknown as React.ChangeEvent<HTMLInputElement>);
                  }}
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {renderEnterButton()}
      </div>
    );
  }
);
SearchInput.displayName = 'InputSearch';

type EnhancedInputComponent = typeof InternalInput & {
  Search: typeof SearchInput;
};

const Input = InternalInput as EnhancedInputComponent;
Input.Search = SearchInput;

export { Input as EnhancedInput, SearchInput };
