import * as React from "react";
import {
  Badge as BaseBadge,
  type BadgeProps as BaseBadgeProps,
} from "../ui/badge";
import { cn } from "../../lib/utils";

export interface EnhancedBadgeProps extends Omit<BaseBadgeProps, "variant"> {
  count?: number | React.ReactNode;
  showZero?: boolean;
  overflowCount?: number;
  dot?: boolean;
  status?: "success" | "processing" | "default" | "error" | "warning";
  text?: React.ReactNode;
  color?: string;
  size?: "default" | "small";
  offset?: [number, number];
  title?: string;
}

const Badge = React.forwardRef<HTMLDivElement, EnhancedBadgeProps>(
  (
    {
      className,
      children,
      count,
      showZero = false,
      overflowCount = 99,
      dot = false,
      status,
      text,
      color,
      size = "default",
      offset,
      title,
      ...props
    },
    ref,
  ) => {
    // 获取显示的数字
    const getDisplayCount = () => {
      if (dot) return "";
      if (typeof count === "number") {
        if (count === 0 && !showZero) return "";
        if (count > overflowCount) return `${overflowCount}+`;
        return count.toString();
      }
      return count;
    };

    // 获取badge的variant
    const getVariant = () => {
      switch (status) {
        case "success":
          return "default"; // 绿色
        case "processing":
          return "secondary"; // 蓝色
        case "error":
          return "destructive"; // 红色
        case "warning":
          return "secondary"; // 黄色
        default:
          return "default";
      }
    };

    const displayCount = getDisplayCount();
    const shouldShow = dot || displayCount !== "";

    // 如果是状态点模式（没有children）
    if (!children && (status || dot)) {
      return (
        <span className="inline-flex items-center gap-2">
          <BaseBadge
            variant={getVariant()}
            className={cn(
              "h-2 w-2 p-0 rounded-full",
              dot && "h-1.5 w-1.5",
              size === "small" && "h-1.5 w-1.5",
              status === "success" && "bg-green-500",
              status === "processing" && "bg-blue-500 animate-pulse",
              status === "warning" && "bg-yellow-500",
              status === "error" && "bg-red-500",
              color && { backgroundColor: color },
              className,
            )}
            style={color ? { backgroundColor: color } : undefined}
            title={title}
            {...props}
          >
            {!dot && displayCount}
          </BaseBadge>
          {text && (
            <span className="text-sm text-muted-foreground">{text}</span>
          )}
        </span>
      );
    }

    // 如果没有children，只显示badge
    if (!children) {
      return (
        <BaseBadge
          variant={getVariant()}
          className={cn(
            size === "small" && "text-xs px-1.5 py-0.5",
            status === "success" && "bg-green-500 hover:bg-green-600",
            status === "processing" && "bg-blue-500 hover:bg-blue-600",
            status === "warning" && "bg-yellow-500 hover:bg-yellow-600",
            status === "error" && "bg-red-500 hover:bg-red-600",
            className,
          )}
          style={color ? { backgroundColor: color } : undefined}
          title={title}
          {...props}
        >
          {displayCount}
        </BaseBadge>
      );
    }

    // 带有children的徽章模式
    return (
      <span className="relative inline-block" ref={ref}>
        {children}
        {shouldShow && (
          <BaseBadge
            variant={getVariant()}
            className={cn(
              "absolute -top-2 -right-2 flex items-center justify-center min-w-5 h-5 text-xs px-1",
              dot && "w-2 h-2 min-w-2 p-0 rounded-full",
              size === "small" && "min-w-4 h-4 text-xs",
              size === "small" && dot && "w-1.5 h-1.5 min-w-1.5",
              status === "success" && "bg-green-500 hover:bg-green-600",
              status === "processing" && "bg-blue-500 hover:bg-blue-600",
              status === "warning" && "bg-yellow-500 hover:bg-yellow-600",
              status === "error" && "bg-red-500 hover:bg-red-600",
              offset && "transform",
              className,
            )}
            style={{
              backgroundColor: color,
              ...(offset && {
                transform: `translate(${offset[0]}px, ${offset[1]}px)`,
              }),
            }}
            title={title}
            {...props}
          >
            {!dot && displayCount}
          </BaseBadge>
        )}
      </span>
    );
  },
);

Badge.displayName = "EnhancedBadge";

export { Badge };
