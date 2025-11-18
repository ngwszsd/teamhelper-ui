import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export interface TreeNode {
  /** 唯一标识（推荐提供），未提供时将根据路径自动生成 */
  key?: React.Key;
  /** 节点标题 */
  title: React.ReactNode;
  /** 子节点 */
  children?: TreeNode[];
  /** 图标（可选） */
  icon?: React.ReactNode;
  /** 额外区域（默认在右侧显示） */
  extra?: React.ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
}

export type SelectionMode = 'single' | 'multiple';

export interface TreeSelectInfo {
  /** 是否选中 */
  selected: boolean;
  /** 节点key */
  key: React.Key;
  /** 节点数据 */
  node: TreeNode;
  /** 当前所有选中的keys */
  selectedKeys: React.Key[];
}

export interface TreeProps {
  /** 树形数据 */
  treeData: TreeNode[];
  /** 自定义节点内容渲染（只负责内容，不处理选中状态和交互） */
  renderNodeContent?: (
    node: TreeNode,
    state: {
      key: React.Key;
      level: number;
      expanded: boolean;
      isLeaf: boolean;
    }
  ) => React.ReactNode;
  /** 自定义右侧额外区域（默认显示 node.extra） */
  renderRightExtra?: (
    node: TreeNode,
    state: {
      key: React.Key;
      level: number;
      expanded: boolean;
      isLeaf: boolean;
    }
  ) => React.ReactNode;
  /** 默认展开的节点 key 列表 */
  defaultExpandedKeys?: React.Key[];
  /** 默认展开全部（优先级高于 autoExpandRoot） */
  defaultExpandAll?: boolean;
  /** 受控展开 keys */
  expandedKeys?: React.Key[];
  /** 展开变化回调 */
  onExpandedKeysChange?: (keys: React.Key[]) => void;
  /** 受控选中 keys */
  selectedKeys?: React.Key[];
  /** 默认选中 keys（仅非受控模式） */
  defaultSelectedKeys?: React.Key[];
  /** 选中变化回调 */
  onSelect?: (keys: React.Key[], info: TreeSelectInfo) => void;
  /** 选择模式：单选或多选 */
  selectionMode?: SelectionMode;
  /** 是否可选择（默认true） */
  selectable?: boolean;
  /** 容器高度（虚拟滚动需要） */
  containerHeight?: number;
  /** 预估行高（虚拟滚动需要） */
  estimatedItemSize?: number;
  /** 每级缩进宽度 */
  indent?: number;
  /** 额外类名 */
  className?: string;
  /** 是否默认展开根节点 */
  autoExpandRoot?: boolean;
  /** 是否显示展开/收起图标 */
  showToggleIcon?: boolean;
  /** 自定义展开/收起图标 */
  toggleIcon?: (props: {
    expanded: boolean;
    isLeaf: boolean;
  }) => React.ReactNode;
  /** 展开/收起图标的样式类名 */
  toggleIconClassName?: string;
  toggleIconPosition?: 'left' | 'right';
  getTreeItemClassName?: (flat: FlatNode) => string;
}

type FlatNode = {
  key: React.Key;
  node: TreeNode;
  level: number;
  isLeaf: boolean;
  parentKey?: React.Key;
};

function getNodeKey(node: TreeNode, path: number[]): React.Key {
  if (node.key != null) return node.key;
  // 使用路径生成稳定 key，例如 "0-2-1"
  return path.join('-');
}

function flatten(tree: TreeNode[], expanded: Set<React.Key>): FlatNode[] {
  const result: FlatNode[] = [];
  const walk = (
    nodes: TreeNode[],
    level: number,
    parentPath: number[] = []
  ) => {
    nodes.forEach((n, idx) => {
      const path = [...parentPath, idx];
      const key = getNodeKey(n, path);
      const isLeaf = !n.children || n.children.length === 0;
      result.push({
        key,
        node: n,
        level,
        isLeaf,
        parentKey:
          parentPath.length > 0
            ? getNodeKey(nodes[0], parentPath.slice(0, -1))
            : undefined,
      });
      if (!isLeaf && expanded.has(key)) {
        walk(n.children!, level + 1, path);
      }
    });
  };
  walk(tree, 0, []);
  return result;
}

// 初始化展开状态的辅助函数
function initializeExpandedKeys(
  treeData: TreeNode[],
  options: {
    defaultExpandedKeys?: React.Key[];
    defaultExpandAll?: boolean;
    autoExpandRoot?: boolean;
    showToggleIcon?: boolean;
  }
): Set<React.Key> {
  const {
    defaultExpandedKeys,
    defaultExpandAll,
    autoExpandRoot,
    showToggleIcon,
  } = options;
  const initial = new Set<React.Key>(defaultExpandedKeys ?? []);

  const walkAdd = (nodes: TreeNode[], parentPath: number[] = []) => {
    nodes.forEach((n, idx) => {
      const path = [...parentPath, idx];
      if (n.children && n.children.length > 0) {
        initial.add(getNodeKey(n, path));
        walkAdd(n.children, path);
      }
    });
  };

  // 当隐藏展开图标时，默认展开全部节点
  if (!showToggleIcon) {
    walkAdd(treeData);
  } else if (defaultExpandAll) {
    walkAdd(treeData);
  } else if (autoExpandRoot) {
    // 默认展开第一级（分组）
    treeData.forEach((n, idx) => {
      const k = getNodeKey(n, [idx]);
      if (n.children && n.children.length > 0) initial.add(k);
    });
  }

  return initial;
}

export const Tree: React.FC<TreeProps> = ({
  treeData,
  renderNodeContent,
  renderRightExtra,
  defaultExpandedKeys,
  defaultExpandAll = false,
  expandedKeys,
  onExpandedKeysChange,
  selectedKeys,
  defaultSelectedKeys,
  onSelect,
  selectionMode = 'single',
  selectable = true,
  containerHeight = 360,
  estimatedItemSize = 40,
  indent = 16,
  className,
  autoExpandRoot = true,
  showToggleIcon = true,
  toggleIcon,
  toggleIconClassName,
  toggleIconPosition = 'left',
  getTreeItemClassName,
}) => {
  const parentRef = React.useRef<HTMLDivElement | null>(null);

  // 非受控展开状态
  const [innerExpanded, setInnerExpanded] = React.useState<Set<React.Key>>(() =>
    initializeExpandedKeys(treeData, {
      defaultExpandedKeys,
      defaultExpandAll,
      autoExpandRoot,
      showToggleIcon,
    })
  );

  // 当 showToggleIcon 变为隐藏时（非受控），同步展开全部
  React.useEffect(() => {
    if (!showToggleIcon && !expandedKeys) {
      const all = initializeExpandedKeys(treeData, {
        defaultExpandAll: true,
        showToggleIcon: false,
      });
      setInnerExpanded(all);
      onExpandedKeysChange?.(Array.from(all));
    }
  }, [showToggleIcon, treeData, expandedKeys, onExpandedKeysChange]);

  // 计算最终展开集合（受控优先）
  const expandedSet = React.useMemo(() => {
    return expandedKeys ? new Set(expandedKeys) : innerExpanded;
  }, [expandedKeys, innerExpanded]);

  const visibleList = React.useMemo(
    () => flatten(treeData, expandedSet),
    [treeData, expandedSet]
  );

  const virtualizer = useVirtualizer({
    count: visibleList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedItemSize,
    overscan: 10,
    measureElement: (el) =>
      el?.getBoundingClientRect().height ?? estimatedItemSize,
    getItemKey: (index) => visibleList[index].key,
  });

  const totalSize = virtualizer.getTotalSize();
  const items = virtualizer.getVirtualItems();

  // 非受控选中状态
  const [innerSelected, setInnerSelected] = React.useState<Set<React.Key>>(
    () => new Set(defaultSelectedKeys ?? [])
  );

  // 计算最终选中集合（受控优先）
  const selectedSet = React.useMemo(() => {
    return selectedKeys ? new Set(selectedKeys) : innerSelected;
  }, [selectedKeys, innerSelected]);

  const toggle = React.useCallback(
    (key: React.Key) => {
      const next = new Set(expandedSet);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      if (expandedKeys) {
        onExpandedKeysChange?.(Array.from(next));
      } else {
        setInnerExpanded(next);
        onExpandedKeysChange?.(Array.from(next));
      }
    },
    [expandedSet, expandedKeys, onExpandedKeysChange]
  );

  const select = React.useCallback(
    (key: React.Key, node: TreeNode) => {
      if (!selectable || node.disabled) return;

      let next: Set<React.Key>;
      const isSelected = selectedSet.has(key);

      if (selectionMode === 'multiple') {
        // 多选模式：切换当前节点选中状态
        next = new Set(selectedSet);
        if (isSelected) {
          next.delete(key);
        } else {
          next.add(key);
        }
      } else {
        // 单选模式：点击切换当前选中状态
        if (isSelected) {
          next = new Set<React.Key>();
        } else {
          next = new Set<React.Key>([key]);
        }
      }

      const nextKeys = Array.from(next);
      const selectInfo: TreeSelectInfo = {
        selected: !isSelected,
        key,
        node,
        selectedKeys: nextKeys,
      };

      if (selectedKeys) {
        onSelect?.(nextKeys, selectInfo);
      } else {
        setInnerSelected(next);
        onSelect?.(nextKeys, selectInfo);
      }
    },
    [selectedSet, selectedKeys, onSelect, selectionMode, selectable]
  );

  const renderToggleIcon = (flat: FlatNode) => {
    return (
      <button
        aria-label={expandedSet.has(flat.key) ? 'Collapse' : 'Expand'}
        className={cn(
          'inline-flex items-center justify-center rounded-sm',
          'transition-transform duration-200 ease-out',
          'hover:bg-muted/60 p-0.5',
          expandedSet.has(flat.key) ? 'rotate-0' : '-rotate-90',
          toggleIconPosition === 'left' && 'mr-1'
        )}
        onClick={(e) => {
          e.stopPropagation();
          toggle(flat.key);
        }}
        disabled={flat.node.disabled}
      >
        {toggleIcon ? (
          toggleIcon({
            expanded: expandedSet.has(flat.key),
            isLeaf: flat.isLeaf,
          })
        ) : (
          <ChevronDown
            className={cn('h-4 w-4 text-muted-foreground', toggleIconClassName)}
          />
        )}
      </button>
    );
  };

  return (
    <div
      ref={parentRef}
      className={cn('relative w-full overflow-auto ', className)}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalSize, width: '100%', position: 'relative' }}>
        {items.map((vi) => {
          const flat = visibleList[vi.index];
          const class_name = getTreeItemClassName?.(flat);

          return (
            <div
              key={flat.key}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${vi.start}px)`,
              }}
              onClick={() => select(flat.key, flat.node)}
            >
              <div
                className={cn(
                  'px-3 py-2  flex items-center justify-between',
                  'transition-colors duration-150',
                  !flat.node.disabled &&
                    selectable &&
                    'cursor-pointer hover:bg-tabs/15',
                  flat.isLeaf ? '' : 'bg-card/60',
                  selectedSet.has(flat.key) && 'bg-tabs/15 ',
                  flat.node.disabled && 'opacity-50 cursor-not-allowed',
                  class_name
                )}
                style={{ paddingLeft: flat.level * indent + 12 }}
              >
                <div className="flex items-center min-w-0 w-full">
                  {!flat?.isLeaf &&
                  showToggleIcon &&
                  toggleIconPosition === 'left'
                    ? renderToggleIcon(flat)
                    : null}

                  {flat.node.icon && (
                    <span className="mr-2">{flat.node.icon}</span>
                  )}

                  {renderNodeContent ? (
                    renderNodeContent(flat.node, {
                      key: flat.key,
                      level: flat.level,
                      expanded: expandedSet.has(flat.key),
                      isLeaf: flat.isLeaf,
                    })
                  ) : (
                    <span
                      className={cn(
                        'truncate',
                        flat.isLeaf ? 'font-normal' : 'font-medium',
                        selectedSet.has(flat.key) && 'font-medium'
                      )}
                    >
                      {flat.node.title}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1">
                    {renderRightExtra?.(flat.node, {
                      key: flat.key,
                      level: flat.level,
                      expanded: expandedSet.has(flat.key),
                      isLeaf: flat.isLeaf,
                    }) ?? flat.node.extra}
                  </div>

                  {!flat?.isLeaf &&
                  showToggleIcon &&
                  toggleIconPosition === 'right'
                    ? renderToggleIcon(flat)
                    : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

Tree.displayName = 'EnhancedTree';

export default Tree;
