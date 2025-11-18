import * as React from 'react';
import {
  Popover as BasePopover,
  PopoverTrigger,
  PopoverContent,
} from '../ui/popover';
import { cn } from '../../lib/utils';

export interface EnhancedPopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
  title?: React.ReactNode;
  trigger?: 'hover' | 'click' | 'focus' | 'contextMenu';
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
  getPopupContainer?: () => HTMLElement;
  destroyTooltipOnHide?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  zIndex?: number;
}

const Popover: React.FC<EnhancedPopoverProps> = ({
  children,
  content,
  title,
  trigger = 'click',
  placement = 'bottom',
  open,
  defaultOpen,
  onOpenChange,
  arrow = true,
  overlayClassName,
  overlayStyle,
  mouseEnterDelay = 0.1,
  mouseLeaveDelay = 0.1,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen || false);
  const [hoverTimeout, setHoverTimeout] = React.useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  // 映射 placement 到 shadcn 的 side 和 align
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
        return { side: 'bottom' as const, align: 'center' as const };
    }
  };

  const { side, align } = getSideAndAlign();

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      const timeout = setTimeout(() => {
        handleOpenChange(true);
      }, mouseEnterDelay * 1000);
      setHoverTimeout(timeout);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
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
    }

    return baseProps;
  }, [trigger]);

  const popoverContent = (
    <div className={cn('min-w-0', overlayClassName)} style={overlayStyle}>
      {title && (
        <div className="font-medium text-sm mb-2 pb-2 border-b border-border">
          {title}
        </div>
      )}
      <div className="text-sm">{content}</div>
    </div>
  );

  return (
    <BasePopover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div {...triggerProps}>{children}</div>
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        className={cn(
          'w-auto max-w-xs',
          !arrow &&
            'data-[side=bottom]:slide-in-from-top-0 data-[side=left]:slide-in-from-right-0 data-[side=right]:slide-in-from-left-0 data-[side=top]:slide-in-from-bottom-0'
        )}
        onMouseEnter={trigger === 'hover' ? handleMouseEnter : undefined}
        onMouseLeave={trigger === 'hover' ? handleMouseLeave : undefined}
      >
        {popoverContent}
      </PopoverContent>
    </BasePopover>
  );
};

Popover.displayName = 'EnhancedPopover';

export { Popover as EnhancedPopover };
