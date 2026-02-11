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
  thumbChildren,
  thumbClassName,
  ...props
}) => {
  const [internalValue, setInternalValue] = React.useState<number[]>(
    defaultValue || (range ? [0, 0] : [0])
  );

  const [isDragging, setIsDragging] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);

  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = (newValue: number[]) => {
    setIsDragging(true);
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleValueCommit = (newValue: number[]) => {
    setIsDragging(false);
    onAfterChange?.(newValue);
  };

  const renderThumbWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!tooltip) return children;

    // 劫持 Thumb 的事件以控制 Hover 状态
    return React.isValidElement(children)
      ? React.cloneElement(children as React.ReactElement<any>, {
          onMouseEnter: (e: React.MouseEvent) => {
            setIsHovering(true);
            (children as any).props.onMouseEnter?.(e);
          },
          onMouseLeave: (e: React.MouseEvent) => {
            setIsHovering(false);
            (children as any).props.onMouseLeave?.(e);
          },
        })
      : children;
  };

  const renderTooltip = () => {
    if (!tooltip) return null;

    const { formatter, open, placement = 'top' } = tooltip;
    const val = currentValue[0];
    const content = formatter ? formatter(val) : val;
    const isOpen = open ?? (isDragging || isHovering);

    if (!isOpen) return null;

    return (
      <div
        className={cn(
          'absolute z-50 flex items-center justify-center whitespace-nowrap rounded-md border bg-card px-2 py-1 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
          placement === 'top' && '-top-8 left-1/2 -translate-x-1/2',
          placement === 'bottom' && '-bottom-8 left-1/2 -translate-x-1/2',
          placement === 'left' && 'right-full mr-2 top-1/2 -translate-y-1/2',
          placement === 'right' && 'left-full ml-2 top-1/2 -translate-y-1/2'
        )}
      >
        {content}
      </div>
    );
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
        thumbChildren={
          <>
            {thumbChildren}
            {renderTooltip()}
          </>
        }
        renderThumb={renderThumbWrapper}
        thumbClassName={cn(thumbClassName, 'relative')} // 确保 Tip 相对于 Thumb 定位
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
