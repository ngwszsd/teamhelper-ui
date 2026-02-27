import * as React from 'react';
import {
  Card as BaseCard,
  CardHeader as BaseCardHeader,
  CardTitle as BaseCardTitle,
  CardContent as BaseCardContent,
  CardFooter as BaseCardFooter,
} from '../ui/card';
import { cn } from '../../lib/utils';

export interface EnhancedCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  cover?: React.ReactNode;
  actions?: React.ReactNode[];
  hoverable?: boolean;
  bordered?: boolean;
  size?: 'default' | 'small';
  loading?: boolean;
  headerClassName?: string;
  headerWrapperClassName?: string;
  titleWrapperClassName?: string;
  titleClassName?: string;
  extraClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}

const Card = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  (
    {
      className,
      title,
      extra,
      cover,
      actions,
      hoverable = false,
      bordered = true,
      size = 'default',
      loading = false,
      headerClassName,
      headerWrapperClassName,
      titleWrapperClassName,
      titleClassName,
      extraClassName,
      contentClassName,
      footerClassName,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <BaseCard
        ref={ref}
        className={cn(
          hoverable && 'hover:shadow-md transition-shadow cursor-pointer',
          !bordered && 'border-0 shadow-none',
          size === 'small' && 'text-sm',
          loading && 'opacity-60 pointer-events-none',
          className
        )}
        {...props}
      >
        {cover && <div className="rounded-t-xl overflow-hidden">{cover}</div>}

        {(title || extra) && (
          <BaseCardHeader
            className={cn(size === 'small' && 'p-4', headerClassName)}
          >
            <div
              className={cn(
                'flex items-center justify-between',
                headerWrapperClassName
              )}
            >
              <div className={cn('flex-1', titleWrapperClassName)}>
                {title && (
                  <BaseCardTitle
                    className={cn(
                      size === 'small' && 'text-base',
                      titleClassName
                    )}
                  >
                    {title}
                  </BaseCardTitle>
                )}
              </div>
              {extra && (
                <div className={cn('shrink-0 ml-4', extraClassName)}>
                  {extra}
                </div>
              )}
            </div>
          </BaseCardHeader>
        )}

        {children && (
          <BaseCardContent
            className={cn(
              size === 'small' && 'p-4 pt-0',
              !title && !extra && size === 'small' && 'pt-4',
              contentClassName
            )}
          >
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : (
              children
            )}
          </BaseCardContent>
        )}

        {actions && actions.length > 0 && (
          <BaseCardFooter
            className={cn(
              'flex justify-end space-x-2',
              size === 'small' && 'p-4 pt-0',
              footerClassName
            )}
          >
            {actions.map((action, index) => (
              <div key={index}>{action}</div>
            ))}
          </BaseCardFooter>
        )}
      </BaseCard>
    );
  }
);

Card.displayName = 'EnhancedCard';

export { Card };
