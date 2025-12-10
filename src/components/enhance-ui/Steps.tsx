import * as React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StepItem {
  key?: React.Key;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  status?: 'wait' | 'process' | 'finish' | 'error';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface StepsProps {
  className?: string;
  style?: React.CSSProperties;
  current?: number;
  direction?: 'horizontal' | 'vertical';
  labelPlacement?: 'horizontal' | 'vertical';
  progressDot?: boolean;
  size?: 'default' | 'small';
  status?: 'wait' | 'process' | 'finish' | 'error';
  items?: StepItem[];
  onChange?: (current: number, info: StepItem) => void;
}

export const Steps = React.forwardRef<HTMLDivElement, StepsProps>(
  (
    {
      className,
      style,
      current = 0,
      direction = 'horizontal',
      labelPlacement = 'horizontal',
      progressDot = false,
      size = 'default',
      status = 'process',
      items = [],
      onChange,
      ...props
    },
    ref
  ) => {
    const isVertical = direction === 'vertical';
    const isLabelVertical = !isVertical && labelPlacement === 'vertical';

    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full',
          isVertical ? 'flex-col' : 'flex-row',
          className
        )}
        style={style}
        {...props}
      >
        {items.map((item, index) => {
          const stepNumber = index + 1;
          const isLast = index === items.length - 1;

          let stepStatus: 'wait' | 'process' | 'finish' | 'error' = 'wait';
          if (item.status) {
            stepStatus = item.status;
          } else if (index < current) {
            stepStatus = 'finish';
          } else if (index === current) {
            stepStatus = status;
          }

          const isClickable = onChange && !item.disabled;

          const renderIcon = () => {
            if (item.icon) return item.icon;
            if (progressDot) {
              return (
                <span
                  className={cn(
                    'block rounded-full transition-all duration-300',
                    stepStatus === 'process'
                      ? 'w-2.5 h-2.5 bg-primary'
                      : 'w-2 h-2 bg-muted-foreground/30',
                    stepStatus === 'finish' && 'bg-primary',
                    stepStatus === 'error' && 'bg-destructive'
                  )}
                />
              );
            }
            if (stepStatus === 'finish') return <Check className="w-4 h-4" />;
            if (stepStatus === 'error') return <X className="w-4 h-4" />;
            return <span className="text-base font-medium">{stepNumber}</span>;
          };

          const iconSizeClass =
            size === 'small' && !progressDot ? 'w-7 h-7' : 'w-8 h-8';
          const iconWrapperClass = cn(
            'relative z-10 flex items-center justify-center rounded-full border transition-colors duration-200 bg-background',
            iconSizeClass,
            progressDot &&
              'w-2 h-2 border-0 bg-transparent p-0 items-center justify-center',
            stepStatus === 'wait' &&
              !progressDot &&
              'border-muted-foreground/10 bg-muted-foreground/20 text-muted-foreground/90',
            stepStatus === 'process' &&
              !progressDot &&
              'border-primary bg-primary text-primary-foreground',
            stepStatus === 'finish' &&
              !progressDot &&
              'border-primary bg-primary text-primary-foreground',
            stepStatus === 'error' &&
              !progressDot &&
              'border-destructive text-destructive',
            isClickable && 'cursor-pointer hover:opacity-80'
          );

          const titleClass = cn(
            'text-sm font-medium leading-none whitespace-nowrap',
            stepStatus === 'wait' && 'text-muted-foreground',
            stepStatus === 'process' && 'text-foreground font-semibold',
            stepStatus === 'finish' && 'text-foreground',
            stepStatus === 'error' && 'text-destructive',
            isClickable && 'cursor-pointer hover:text-primary transition-colors'
          );

          const subTitleClass = 'text-xs text-muted-foreground ml-2';
          const descriptionClass = cn(
            'text-xs text-muted-foreground mt-1',
            isLabelVertical && 'text-center'
          );

          if (isVertical) {
            return (
              <div
                key={index}
                className={cn('flex flex-1 last:flex-none', item.className)}
                style={item.style}
              >
                <div
                  className={cn(
                    'flex flex-col items-center mr-4',
                    size === 'small' ? 'min-w-[24px]' : 'min-w-[32px]'
                  )}
                >
                  <div
                    className={iconWrapperClass}
                    onClick={() => isClickable && onChange(index, { ...item })}
                  >
                    {renderIcon()}
                  </div>
                  {!isLast && (
                    <div
                      className={cn(
                        'w-[1px] flex-1 my-1 bg-foreground/10 transition-colors duration-300',
                        stepStatus === 'finish' && 'bg-primary'
                      )}
                    />
                  )}
                </div>
                <div className="pb-8 pt-0.5">
                  <div className="flex items-center">
                    <div
                      className={titleClass}
                      onClick={() =>
                        isClickable && onChange(index, { ...item })
                      }
                    >
                      {item.title}
                    </div>
                    {item.subTitle && (
                      <span className={subTitleClass}>{item.subTitle}</span>
                    )}
                  </div>
                  {item.description && (
                    <div className={descriptionClass}>{item.description}</div>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div
              key={index}
              className={cn(
                'flex group overflow-hidden',
                isLabelVertical ? 'flex-col flex-1' : 'flex-row items-center',
                !isLabelVertical && !isLast && 'flex-1',
                !isLabelVertical && isLast && 'flex-none',
                item.className
              )}
              style={item.style}
            >
              <div
                className={cn(
                  'flex items-center',
                  isLabelVertical
                    ? 'relative justify-center w-full mb-2'
                    : 'mr-3'
                )}
              >
                {isLabelVertical && !isLast && (
                  <div
                    className={cn(
                      'absolute top-1/2 left-[50%] w-full h-[1px] bg-foreground/10 -translate-y-1/2',
                      stepStatus === 'finish' && 'bg-primary'
                    )}
                  />
                )}

                <div
                  className={iconWrapperClass}
                  onClick={() => isClickable && onChange(index, { ...item })}
                >
                  {renderIcon()}
                </div>
              </div>

              <div
                className={cn(
                  'flex flex-col',
                  isLabelVertical ? 'items-center' : 'text-left'
                )}
              >
                <div
                  className={cn(
                    'flex items-center',
                    isLabelVertical && 'justify-center'
                  )}
                >
                  <div
                    className={titleClass}
                    onClick={() => isClickable && onChange(index, { ...item })}
                  >
                    {item.title}
                  </div>
                  {item.subTitle && (
                    <span className={subTitleClass}>{item.subTitle}</span>
                  )}
                </div>
                {item.description && (
                  <div className={descriptionClass}>{item.description}</div>
                )}
              </div>

              {!isLabelVertical && !isLast && (
                <div
                  className={cn(
                    'flex-1 h-[1px] mx-4 bg-foreground/10 transition-colors duration-300',
                    stepStatus === 'finish' && 'bg-primary'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
);
Steps.displayName = 'EnhancedSteps';
