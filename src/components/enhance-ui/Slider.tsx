import React from 'react';
import { Slider as BaseSlider } from '../ui/slider';
import { cn } from '../../lib/utils';

export interface EnhancedSliderProps {
  value?: number[];
  defaultValue?: number[];
  onChange?: (value: number[]) => void;
  onAfterChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number | null;
  range?: boolean;
  disabled?: boolean;
  vertical?: boolean;
  included?: boolean;
  marks?: Record<
    number,
    React.ReactNode | { style?: React.CSSProperties; label?: React.ReactNode }
  >;
  dots?: boolean;
  tooltip?: {
    open?: boolean;
    placement?: 'top' | 'left' | 'right' | 'bottom';
    formatter?: (value?: number) => React.ReactNode;
  };
  className?: string;
  trackClassName?: string;
  rangeClassName?: string;
  thumbClassName?: string;
  showMarkText?: boolean;
  showMarkDot?: boolean;
  thumbChildren?: React.ReactNode;
}

export const EnhancedSlider: React.FC<EnhancedSliderProps> = ({
  value,
  defaultValue,
  onChange,
  onAfterChange,
  min = 0,
  max = 100,
  step = 1,
  range = false,
  disabled = false,
  vertical = false,
  included = true,
  marks,
  dots = false,
  tooltip,
  className,
  showMarkText,
  showMarkDot,
  ...props
}) => {
  const [internalValue, setInternalValue] = React.useState<number[]>(
    defaultValue || (range ? [0, 0] : [0])
  );

  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = (newValue: number[]) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleValueCommit = (newValue: number[]) => {
    onAfterChange?.(newValue);
  };

  return (
    <div className={cn('relative w-full', vertical && 'h-48', className)}>
      <BaseSlider
        value={currentValue}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
        min={min}
        max={max}
        step={step || 1}
        disabled={disabled}
        orientation={vertical ? 'vertical' : 'horizontal'}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          vertical && 'h-full flex-col',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        markContent={
          marks && Object.keys(marks).length && showMarkDot ? (
            <div
              className={cn(
                'absolute flex pointer-events-none',
                vertical ? 'flex-col h-full left-2' : 'top-0'
              )}
              style={{ width: 'calc(100% - 4px * 2)' }}
            >
              {Object.keys(marks).map((key) => {
                const position = ((Number(key) - min) / (max - min)) * 100;
                const style = vertical
                  ? { bottom: `${position}%` }
                  : { left: `${position}%` };

                return (
                  <div
                    key={key}
                    className={cn(
                      'absolute bg-[#D6D6D6]',
                      'w-1 h-1 rounded-full'
                    )}
                    style={style}
                  />
                );
              })}
            </div>
          ) : null
        }
        {...props}
      />

      {/* 显示刻度标记 */}
      {marks && showMarkText && (
        <div
          className={cn(
            'absolute flex w-full justify-between',
            vertical ? 'flex-col h-full left-6' : 'top-6'
          )}
        >
          {Object.entries(marks).map(([key, mark]) => {
            const position = ((Number(key) - min) / (max - min)) * 100;
            const style = vertical
              ? { bottom: `${position}%` }
              : { left: `${position}%` };

            let content: React.ReactNode = null;
            if (mark && typeof mark === 'object' && 'label' in mark) {
              content = mark.label;
            } else {
              content = mark as React.ReactNode;
            }

            return (
              <div
                key={key}
                className="absolute text-xs text-gray-500"
                style={style}
              >
                {content}
              </div>
            );
          })}
        </div>
      )}

      {/* 显示点 */}
      {dots && (
        <div
          className={cn(
            'absolute flex w-full',
            vertical ? 'flex-col h-full left-2' : 'top-2'
          )}
        >
          {Array.from(
            { length: Math.floor((max - min) / (step || 1)) + 1 },
            (_, i) => {
              const position = ((i * (step || 1)) / (max - min)) * 100;
              const style = vertical
                ? { bottom: `${position}%` }
                : { left: `${position}%` };

              return (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-gray-400 rounded-full"
                  style={style}
                />
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export type { EnhancedSliderProps as SliderProps };
