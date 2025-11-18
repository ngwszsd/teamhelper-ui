import * as React from "react";
import { cn } from "../../lib/utils";

export type TimelineMode = "left" | "right" | "alternate";

export interface TimelineItemProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  color?: "blue" | "red" | "green" | "gray" | "primary" | string;
  dot?: React.ReactNode;
  position?: "left" | "right";
  className?: string;
  style?: React.CSSProperties;
}

export interface EnhancedTimelineProps {
  items?: TimelineItemProps[];
  mode?: TimelineMode;
  reverse?: boolean;
  pending?: React.ReactNode | boolean;
  className?: string;
  itemClassName?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  // 新增：连线与留白的可调参数（px）
  lineLeft?: number;
  lineTopOffset?: number;
  lineBottomOffset?: number;
}

const colorClassMap: Record<string, string> = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
  gray: "bg-gray-300",
  primary: "bg-primary",
};

function Dot({
  color,
  dot,
}: {
  color?: TimelineItemProps["color"];
  dot?: React.ReactNode;
}) {
  if (dot) return <span className="timeline-dot relative z-10">{dot}</span>;
  const cls = color ? (colorClassMap[color] ?? "") : "bg-gray-300";
  const inlineStyle: React.CSSProperties = cls
    ? {}
    : color
      ? { backgroundColor: color as string }
      : {};
  return (
    <span
      className={cn(
        "timeline-dot relative z-10 inline-block size-2 rounded-full",
        cls,
      )}
      style={inlineStyle}
    />
  );
}

const TimelineItem: React.FC<
  TimelineItemProps & { mode?: TimelineMode; index?: number }
> = ({
  children,
  label,
  color,
  dot,
  position,
  className,
  style,
  mode = "left",
  index = 0,
}) => {
  // 优先使用显式的 position；否则根据 mode 判断，alternate 模式按索引奇偶交替
  const isRight = position
    ? position === "right"
    : mode === "right" || (mode === "alternate" && index % 2 === 1);

  const leftCol = isRight ? children : label;
  const rightCol = isRight ? label : children;

  return (
    <li
      className={cn(
        "grid grid-cols-[1.25rem_1fr] grid-rows-[auto_auto] gap-x-3 gap-y-1 items-center",
        className,
      )}
      style={style}
    >
      <div className="relative flex items-center justify-center col-start-1 row-start-1">
        <Dot color={color} dot={dot} />
      </div>
      <div className="text-sm text-muted-foreground text-left col-start-2 row-start-1">
        {leftCol}
      </div>
      <div className="text-sm text-left col-start-2 row-start-2">
        {rightCol}
      </div>
    </li>
  );
};

const TimelineBase: React.FC<EnhancedTimelineProps> = ({
  items,
  mode = "left",
  reverse = false,
  pending,
  className,
  itemClassName,
  style,
  children,
  lineLeft = 10,
  lineTopOffset = 0,
  lineBottomOffset = 0,
}) => {
  const childrenItems: TimelineItemProps[] = React.Children.toArray(children)
    .map((child) => {
      if (!React.isValidElement(child)) return null;
      const props = child.props as TimelineItemProps;
      return props;
    })
    .filter(Boolean) as TimelineItemProps[];

  let list: TimelineItemProps[] = items ?? childrenItems;

  if (pending) {
    list = [
      ...list,
      {
        label: undefined,
        children: typeof pending === "boolean" ? "Pending..." : pending,
        color: "gray",
        dot: (
          <span className="size-2.5 rounded-full bg-muted-foreground animate-pulse" />
        ),
      },
    ];
  }

  if (reverse) {
    list = [...list].reverse();
  }

  const containerRef = React.useRef<HTMLUListElement>(null);

  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateLineBounds = () => {
      const rect = el.getBoundingClientRect();
      const dots = el.querySelectorAll<HTMLElement>(".timeline-dot");
      if (!dots.length) {
        el.style.setProperty("--timeline-line-top", `${lineTopOffset}px`);
        el.style.setProperty("--timeline-line-bottom", `${lineBottomOffset}px`);
        return;
      }
      const firstRect = dots[0].getBoundingClientRect();
      const lastRect = dots[dots.length - 1].getBoundingClientRect();

      const firstCenter = firstRect.top - rect.top + firstRect.height / 2;
      const lastCenter = lastRect.top - rect.top + lastRect.height / 2;

      const top = Math.max(0, firstCenter + 0 - (lineTopOffset || 0));
      const bottom = Math.max(
        0,
        rect.height - lastCenter + 0 - (lineBottomOffset || 0),
      );

      el.style.setProperty("--timeline-line-top", `${top}px`);
      el.style.setProperty("--timeline-line-bottom", `${bottom}px`);
    };

    updateLineBounds();

    const ro = new ResizeObserver(() => updateLineBounds());
    ro.observe(el);
    window.addEventListener("resize", updateLineBounds);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateLineBounds);
    };
  }, [
    items,
    children,
    reverse,
    pending,
    mode,
    itemClassName,
    lineTopOffset,
    lineBottomOffset,
  ]);

  return (
    <ul
      ref={containerRef}
      className={cn(
        "relative space-y-6 before:content-[''] before:absolute before:z-0 before:left-[var(--timeline-line-left)] before:top-[var(--timeline-line-top)] before:bottom-[var(--timeline-line-bottom)] before:border-l before:border-border before:pointer-events-none",
        className,
      )}
      style={{
        ...(style || {}),
        ["--timeline-line-left" as any]: `${lineLeft}px`,
        ["--timeline-line-top" as any]: `${lineTopOffset}px`,
        ["--timeline-line-bottom" as any]: `${lineBottomOffset}px`,
      }}
      role="list"
    >
      {list.map((it, idx) => (
        <TimelineItem
          key={idx}
          {...it}
          mode={
            it.position ? (it.position === "right" ? "right" : "left") : mode
          }
          index={idx}
          className={itemClassName}
        />
      ))}
    </ul>
  );
};

TimelineBase.displayName = "EnhancedTimeline";

type TimelineComponent = React.FC<EnhancedTimelineProps> & {
  Item: React.FC<TimelineItemProps>;
};

const Timeline = TimelineBase as TimelineComponent;

Timeline.Item = () => (
  <>{/* 仅用于 children API，占位 */}</>
);

export { Timeline };
export type { EnhancedTimelineProps as TimelineProps };
