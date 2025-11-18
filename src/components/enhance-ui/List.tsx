import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '../../lib/utils';

/**
 * 通用虚拟滚动 List 组件
 *
 * - 使用 @tanstack/react-virtual 提供高性能虚拟列表渲染
 * - 支持动态高度的节点内容，通过测量 DOM 元素实时更新高度
 * - 通过 `renderItem` 外部渲染每个节点内容，满足高度自定义需求
 */
export interface EnhancedListProps<T = any> {
  /** 列表数据源（必填） */
  dataSource: T[];
  /** 自定义节点渲染函数（必填） */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** 预估项目高度（默认 40） */
  estimatedItemSize?: number;
  /** 容器高度（默认 500px） */
  containerHeight?: number;
  /** 容器类名（可选） */
  className?: string;
  /** 容器样式（可选） */
  style?: React.CSSProperties;
  /** 行间距（可选，默认 0） */
  itemGap?: number;
  /** 自定义 key 提供更稳定的测量（可选） */
  itemKey?: (item: T, index: number) => React.Key;
}

/**
 * List 组件实现（虚拟滚动 + 动态高度测量）
 *
 * 技术要点：
 * - useVirtualizer：核心虚拟化逻辑，按可视区域渲染有限数量节点
 * - measureElement：通过 DOM 实时测量节点高度，解决动态内容高度问题
 * - 绝对定位 + translateY：将可视节点定位到正确位置，保持滚动平滑
 */
export const List = <T extends unknown = any>({
  dataSource,
  renderItem,
  estimatedItemSize = 40,
  containerHeight = 500,
  className,
  style,
  itemGap = 0,
  itemKey,
}: EnhancedListProps<T>) => {
  const parentRef = React.useRef<HTMLDivElement | null>(null);

  const virtualizer = useVirtualizer({
    count: dataSource.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedItemSize + itemGap,
    overscan: 8,
    // 动态高度测量：在节点渲染后测量真实高度，自动更新缓存
    measureElement: (el) => {
      // 使用 getBoundingClientRect 更准确地获取高度（包含子元素影响）
      const h = el?.getBoundingClientRect().height ?? estimatedItemSize;
      // 加回行间距以保持整体滚动高度一致
      return h + itemGap;
    },
    getItemKey: (index) => {
      if (itemKey) return itemKey(dataSource[index], index);
      return index;
    },
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  return (
    <div
      ref={parentRef}
      className={cn('relative w-full overflow-auto ', className)}
      style={{ height: containerHeight, ...style }}
    >
      <div
        style={{
          height: totalSize,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((vi) => {
          const index = vi.index;
          const item = dataSource[index];
          const key = (itemKey ? itemKey(item, index) : vi.key) as React.Key;

          return (
            <div
              key={key}
              ref={virtualizer.measureElement}
              data-index={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${vi.start}px)`,
                // 给动态内容提供基础样式，外部可覆盖
                // 保留 itemGap（下边距），在测量逻辑中已计入
                marginBottom: itemGap,
              }}
            >
              {renderItem(item, index)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

List.displayName = 'EnhancedList';

export type ListItem = unknown;
