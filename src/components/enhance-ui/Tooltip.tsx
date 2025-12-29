import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { TooltipTrigger, TooltipContent, TooltipProvider } from '../ui/tooltip';
import { cn } from '../../lib/utils';

export interface EnhancedTooltipProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  trigger?: 'hover' | 'click' | 'focus';
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  arrow?: boolean;
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  getPopupContainer?: () => HTMLElement; // 保留与 antd 对齐（当前未使用）
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  zIndex?: number;
  className?: string;
  triggerClassName?: string;
}

const Tooltip: React.FC<EnhancedTooltipProps> = ({
  children,
  title,
  trigger = 'click',
  placement = 'top',
  open,
  defaultOpen,
  onOpenChange,
  arrow = true,
  overlayClassName,
  overlayStyle,
  mouseEnterDelay = 0.1,
  mouseLeaveDelay = 0.1,
  zIndex,
  className,
  triggerClassName,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen || false);
  const [closeTimeout, setCloseTimeout] = React.useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  const getSideAndAlign = () => {
    switch (placement) {
      case 'top':
        return { side: 'top' as const, align: 'center' as const };
      case 'topLeft':
        return { side: 'top' as const, align: 'start' as const };
      case 'topRight':
        return { side: 'top' as const, align: 'end' as const };
      case 'bottom':
        return { side: 'bottom' as const, align: 'center' as const };
      case 'bottomLeft':
        return { side: 'bottom' as const, align: 'start' as const };
      case 'bottomRight':
        return { side: 'bottom' as const, align: 'end' as const };
      case 'left':
        return { side: 'left' as const, align: 'center' as const };
      case 'leftTop':
        return { side: 'left' as const, align: 'start' as const };
      case 'leftBottom':
        return { side: 'left' as const, align: 'end' as const };
      case 'right':
        return { side: 'right' as const, align: 'center' as const };
      case 'rightTop':
        return { side: 'right' as const, align: 'start' as const };
      case 'rightBottom':
        return { side: 'right' as const, align: 'end' as const };
      default:
        return { side: 'top' as const, align: 'center' as const };
    }
  };

  const { side, align } = getSideAndAlign();

  const clearCloseTimeout = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  const handleRadixOpenChange = (next: boolean) => {
    if (trigger === 'hover') {
      if (next) {
        clearCloseTimeout();
        handleOpenChange(true);
      } else {
        const timeout = setTimeout(() => {
          handleOpenChange(false);
        }, mouseLeaveDelay * 1000);
        setCloseTimeout(timeout);
      }
    } else if (trigger === 'focus') {
      handleOpenChange(next);
    }
  };

  const triggerProps = React.useMemo(() => {
    const baseProps: any = {};

    if (trigger === 'hover') {
      baseProps.onMouseEnter = clearCloseTimeout;
    } else if (trigger === 'click') {
      baseProps.onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleOpenChange(!isOpen);
      };
    }

    return baseProps;
  }, [trigger, isOpen, closeTimeout]);

  const contentNode = React.isValidElement(title) ? title : <>{title}</>;

  return (
    <div className={cn('max-w-fit', className)}>
      <TooltipProvider
        delayDuration={trigger === 'hover' ? mouseEnterDelay * 1000 : 0}
      >
        <TooltipPrimitive.Root
          open={isOpen}
          onOpenChange={handleRadixOpenChange}
          delayDuration={trigger === 'hover' ? mouseEnterDelay * 1000 : 0}
        >
          <TooltipTrigger asChild>
            <div className={cn(triggerClassName)} {...triggerProps}>
              {children}
            </div>
          </TooltipTrigger>

          <TooltipContent
            side={side}
            align={align}
            showArrow={arrow}
            className={cn('break-all', overlayClassName)}
            style={{ ...overlayStyle, zIndex }}
            onMouseEnter={trigger === 'hover' ? clearCloseTimeout : undefined}
            onPointerDownOutside={() => {
              if (trigger === 'click') {
                handleOpenChange(false);
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {contentNode}
          </TooltipContent>
        </TooltipPrimitive.Root>
      </TooltipProvider>
    </div>
  );
};

Tooltip.displayName = 'EnhancedTooltip';

export { Tooltip as EnhancedTooltip };
