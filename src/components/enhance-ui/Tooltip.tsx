import * as React from 'react';
import {
  Tooltip as BaseTooltip,
  TooltipTrigger,
  TooltipContent,
} from '../ui/tooltip';
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
  trigger = 'hover',
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
  const [hoverTimeout, setHoverTimeout] = React.useState<ReturnType<
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

  const clearHoverTimeout = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      clearHoverTimeout();
      const timeout = setTimeout(() => {
        handleOpenChange(true);
      }, mouseEnterDelay * 1000);
      setHoverTimeout(timeout);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      clearHoverTimeout();
      const timeout = setTimeout(() => {
        handleOpenChange(false);
      }, mouseLeaveDelay * 1000);
      setHoverTimeout(timeout);
    }
  };

  const triggerProps = React.useMemo(() => {
    const baseProps: any = {};

    if (trigger === 'hover') {
      baseProps.onMouseEnter = handleMouseEnter;
      baseProps.onMouseLeave = handleMouseLeave;
    } else if (trigger === 'focus') {
      baseProps.onFocus = () => handleOpenChange(true);
      baseProps.onBlur = () => handleOpenChange(false);
    } else if (trigger === 'click') {
      baseProps.onClick = () => handleOpenChange(!isOpen);
    }

    return baseProps;
  }, [trigger, isOpen]);

  const contentNode = React.isValidElement(title) ? title : <>{title}</>;

  return (
    <div className={cn('w-fit', className)}>
      <BaseTooltip open={isOpen} onOpenChange={handleOpenChange}>
        <TooltipTrigger asChild>
          <div className={cn(triggerClassName)} {...triggerProps}>
            {children}
          </div>
        </TooltipTrigger>

        <TooltipContent
          side={side}
          align={align}
          className={cn(
            overlayClassName,
            !arrow && '[&>svg]:hidden' // 隐藏箭头
          )}
          style={{ ...overlayStyle, zIndex }}
          onMouseEnter={trigger === 'hover' ? handleMouseEnter : undefined}
          onMouseLeave={trigger === 'hover' ? handleMouseLeave : undefined}
        >
          {contentNode}
        </TooltipContent>
      </BaseTooltip>
    </div>
  );
};

Tooltip.displayName = 'EnhancedTooltip';

export { Tooltip as EnhancedTooltip };
