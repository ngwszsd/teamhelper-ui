import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '../../lib/utils';
import { useLocale } from '../ConfigProvider';

export type TimelineMode = 'left' | 'right' | 'alternate';

export interface TimelineItemProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  color?: 'blue' | 'red' | 'green' | 'gray' | 'primary' | string;
  dot?: React.ReactNode;
  position?: 'left' | 'right';
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
  lineTop?: number;
  isShowLastLine?: boolean;
  /** 启用虚拟滚动（默认 false）。启用时需确保容器有固定高度。 */
  virtual?: boolean;
  /** 虚拟滚动预估项目高度（默认 80） */
  estimatedItemSize?: number;
  /** 虚拟滚动可视区外缓冲项数（默认 5） */
  overscan?: number;
}

/* ------------------------------------------------------------------ */
/*  共享：颜色映射 & 圆点                                              */
/* ------------------------------------------------------------------ */

const colorClassMap: Record<string, string> = {
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  green: 'bg-green-500',
  gray: 'bg-gray-300',
  primary: 'bg-primary',
};

function Dot({
  color,
  dot,
}: {
  color?: TimelineItemProps['color'];
  dot?: React.ReactNode;
}) {
  if (dot) return <span className="timeline-dot relative z-10">{dot}</span>;
  const cls = color ? (colorClassMap[color] ?? '') : 'bg-gray-300';
  const inlineStyle: React.CSSProperties = cls
    ? {}
    : color
      ? { backgroundColor: color as string }
      : {};
  return (
    <span
      className={cn(
        'timeline-dot relative z-10 inline-block rounded-full',
        'w-1.5 h-1.5',
        cls
      )}
      style={inlineStyle}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  共享：单条 item 的 grid 内容（dot/line + label + children）          */
/* ------------------------------------------------------------------ */

/** item 间距，对应非虚拟模式下的 mb-3（12px） */
const ITEM_GAP = 12;

interface ItemGridProps {
  item: TimelineItemProps;
  mode: TimelineMode;
  index: number;
  isShowLine: boolean;
  className?: string;
}

function ItemGrid({ item, mode, index, isShowLine, className }: ItemGridProps) {
  const isRight = item.position
    ? item.position === 'right'
    : mode === 'right' || (mode === 'alternate' && index % 2 === 1);

  const leftCol = isRight ? item.children : item.label;
  const rightCol = isRight ? item.label : item.children;

  return (
    <div
      className={cn(
        'relative grid grid-cols-[1.25rem_1fr] grid-rows-[auto_auto] gap-x-3 gap-y-1 items-center',
        className,
        item.className,
      )}
      style={item.style}
    >
      <div className="relative col-start-1 row-start-1 row-span-2 self-stretch">
        {isShowLine ? (
          <div
            className="pointer-events-none absolute bottom-0 z-0 h-full w-px bg-border"
            style={{
              left: 'var(--timeline-line-left, 50%)',
              top: 'var(--timeline-line-top)',
              transform: 'translateX(-50%)',
            }}
          />
        ) : null}
        <div
          className="absolute z-10"
          style={{
            left: 'var(--timeline-line-left, 50%)',
            top: 'var(--timeline-dot-top, var(--timeline-line-top))',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Dot color={item.color} dot={item.dot} />
        </div>
      </div>
      <div className="text-sm text-muted-foreground text-left col-start-2 row-start-1">
        {leftCol}
      </div>
      <div className="text-sm text-left col-start-2 row-start-2">
        {rightCol}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CSS 变量                                                            */
/* ------------------------------------------------------------------ */

function buildCssVars(
  lineTop: number,
  lineLeft?: number,
): React.CSSProperties {
  return {
    ['--timeline-line-top' as string]: `${lineTop}px`,
    ['--timeline-dot-top' as string]: `${lineTop}px`,
    ...(typeof lineLeft === 'number'
      ? { ['--timeline-line-left' as string]: `${lineLeft}px` }
      : {}),
  };
}

/* ------------------------------------------------------------------ */
/*  非虚拟渲染                                                          */
/* ------------------------------------------------------------------ */

const TimelineItem: React.FC<
  TimelineItemProps & {
    mode?: TimelineMode;
    index?: number;
    isShowLine?: boolean;
  }
> = ({
  children,
  label,
  color,
  dot,
  position,
  className,
  style,
  mode = 'left',
  index = 0,
  isShowLine,
}) => {
  const item: TimelineItemProps = {
    children,
    label,
    color,
    dot,
    position,
    className: undefined,
    style,
  };

  return (
    <li className={cn('mb-3', className)}>
      <ItemGrid
        item={item}
        mode={mode}
        index={index}
        isShowLine={!!isShowLine}
      />
    </li>
  );
};

/* ------------------------------------------------------------------ */
/*  虚拟滚动渲染                                                        */
/* ------------------------------------------------------------------ */

interface TimelineVirtualProps {
  list: TimelineItemProps[];
  mode: TimelineMode;
  className?: string;
  itemClassName?: string;
  style?: React.CSSProperties;
  cssVars: React.CSSProperties;
  isShowLastLine: boolean;
  estimatedItemSize: number;
  overscan: number;
}

const TimelineVirtual: React.FC<TimelineVirtualProps> = ({
  list,
  mode,
  className,
  itemClassName,
  style,
  cssVars,
  isShowLastLine,
  estimatedItemSize,
  overscan,
}) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: list.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedItemSize,
    overscan,
    gap: ITEM_GAP,
    measureElement: (el) =>
      el?.getBoundingClientRect().height ?? estimatedItemSize,
  });

  return (
    <div
      ref={parentRef}
      className={cn('relative overflow-auto', className)}
      style={{ ...style, ...cssVars }}
      role="list"
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((vi) => {
          const it = list[vi.index];
          const idx = vi.index;
          const itemMode: TimelineMode = it.position
            ? it.position === 'right'
              ? 'right'
              : 'left'
            : mode;
          const isShowLine = isShowLastLine || idx < list.length - 1;

          return (
            <div
              key={vi.key}
              ref={virtualizer.measureElement}
              data-index={idx}
              role="listitem"
              className="absolute top-0 left-0 w-full"
              style={{ transform: `translateY(${vi.start}px)` }}
            >
              <ItemGrid
                item={it}
                mode={itemMode}
                index={idx}
                isShowLine={isShowLine}
                className={itemClassName}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  入口组件                                                            */
/* ------------------------------------------------------------------ */

const TimelineBase: React.FC<EnhancedTimelineProps> = ({
  items,
  mode = 'left',
  reverse = false,
  pending,
  className,
  itemClassName,
  style,
  children,
  lineLeft,
  lineTop = 8,
  isShowLastLine = true,
  virtual = false,
  estimatedItemSize = 80,
  overscan = 5,
}) => {
  const locale = useLocale();
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
        children:
          typeof pending === 'boolean'
            ? locale.pending || 'Pending...'
            : pending,
        color: 'gray',
        dot: (
          <span className="size-2.5 rounded-full bg-muted-foreground animate-pulse" />
        ),
      },
    ];
  }

  if (reverse) {
    list = [...list].reverse();
  }

  const cssVars = buildCssVars(lineTop, lineLeft);

  if (virtual) {
    return (
      <TimelineVirtual
        list={list}
        mode={mode}
        className={className}
        itemClassName={itemClassName}
        style={style}
        cssVars={cssVars}
        isShowLastLine={isShowLastLine}
        estimatedItemSize={estimatedItemSize}
        overscan={overscan}
      />
    );
  }

  return (
    <ul
      className={cn('relative', className)}
      style={{ ...(style || {}), ...cssVars }}
      role="list"
    >
      {list.map((it, idx, arr) => (
        <TimelineItem
          key={idx}
          {...it}
          mode={
            it.position ? (it.position === 'right' ? 'right' : 'left') : mode
          }
          index={idx}
          className={itemClassName}
          isShowLine={isShowLastLine ? true : idx < arr.length - 1}
        />
      ))}
    </ul>
  );
};

TimelineBase.displayName = 'EnhancedTimeline';

type TimelineComponent = React.FC<EnhancedTimelineProps> & {
  Item: React.FC<TimelineItemProps>;
};

const Timeline = TimelineBase as TimelineComponent;

Timeline.Item = () => <>{/* 仅用于 children API，占位 */}</>;

export { Timeline };
export type { EnhancedTimelineProps as TimelineProps };
