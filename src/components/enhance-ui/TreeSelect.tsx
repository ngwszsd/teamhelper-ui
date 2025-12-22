import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { EnhancedInput as Input } from './Input';
import { Tree, type TreeNode, type TreeSelectInfo } from './Tree';
import { DirectoryTree } from './DirectoryTree';
import { cn } from '../../lib/utils';
import { ChevronDown, XIcon } from 'lucide-react';
import type { ClassValue } from 'clsx';

export interface TreeSelectProps<T extends React.Key = React.Key> {
  /** 树形数据 */
  treeData: TreeNode[];
  /** 当前选中值 (单选) */
  value?: T;
  /** 选中变化回调 */
  onChange?: (value: T, node: TreeNode) => void;
  /** 占位文案 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否可搜索 */
  searchable?: boolean;
  /** 是否允许清除 */
  allowClear?: boolean;
  /** 外层容器类名 */
  className?: ClassValue;
  /** 下拉弹窗类名 */
  popupClassName?: string;
  /** 弹窗高度 */
  listHeight?: number | string;
  /** 是否使用目录树样式 */
  isDirectory?: boolean;
  /** 搜索占位符 */
  searchPlaceholder?: string;
}

export const TreeSelect = <T extends React.Key = React.Key>({
  treeData,
  value,
  onChange,
  placeholder = '请选择',
  disabled,
  searchable = true,
  allowClear = true,
  className,
  popupClassName,
  listHeight = 300,
  isDirectory = false,
  searchPlaceholder = '搜索',
}: TreeSelectProps<T>) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [triggerWidth, setTriggerWidth] = React.useState<number>();

  React.useLayoutEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  // 查找选中节点的辅助函数
  const findNode = (nodes: TreeNode[], key: T): TreeNode | null => {
    for (const node of nodes) {
      if (node.key === key) return node;
      if (node.children) {
        const found = findNode(node.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = React.useMemo(() => {
    if (value === undefined) return null;
    return findNode(treeData, value);
  }, [treeData, value]);

  const displayText = selectedNode ? String(selectedNode.title) : '';

  const handleSelect = (_keys: React.Key[], info: TreeSelectInfo) => {
    if (onChange) {
      onChange(info.key as T, info.node);
    }
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      // @ts-ignore
      onChange(undefined, null);
    }
    setQuery('');
  };

  const TreeComponent = isDirectory ? DirectoryTree : Tree;

  const filteredTreeData = React.useMemo(() => {
    if (!query.trim()) return treeData;

    const lowQuery = query.toLowerCase();

    const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
      const result: TreeNode[] = [];

      nodes.forEach((node) => {
        // 尝试从 ReactNode 中提取文本用于搜索
        const titleText = typeof node.title === 'string' ? node.title : '';
        const isMatch = titleText.toLowerCase().includes(lowQuery);

        let filteredChildren: TreeNode[] | undefined = undefined;
        if (node.children) {
          filteredChildren = filterNodes(node.children);
        }

        if (isMatch || (filteredChildren && filteredChildren.length > 0)) {
          result.push({
            ...node,
            children: filteredChildren,
          });
        }
      });

      return result;
    };

    return filterNodes(treeData);
  }, [treeData, query]);

  return (
    <div className={cn('relative w-full', className)} ref={triggerRef}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full cursor-pointer group">
            <Input
              readOnly
              disabled={disabled}
              value={displayText}
              placeholder={placeholder}
              className={cn(
                'pr-8 cursor-pointer shadow-none text-left font-normal bg-background',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-4 h-4">
              {allowClear && value !== undefined && !disabled && (
                <XIcon
                  className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-all cursor-pointer absolute opacity-0 group-hover:opacity-100 z-10 bg-background"
                  onClick={handleClear}
                />
              )}
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-muted-foreground transition-all absolute',
                  open && 'rotate-180',
                  allowClear &&
                    value !== undefined &&
                    !disabled &&
                    'group-hover:opacity-0'
                )}
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className={cn('p-2 flex flex-col', popupClassName)}
          style={{ width: triggerWidth }}
          align="start"
          sideOffset={4}
        >
          {searchable && (
            <div className="mb-2">
              <Input
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-8 shadow-none"
              />
            </div>
          )}
          <div className="overflow-auto min-h-0">
            <TreeComponent
              treeData={filteredTreeData}
              selectedKeys={value !== undefined ? [value] : []}
              onSelect={handleSelect}
              containerHeight={listHeight}
              selectionMode="single"
              selectable={true}
              // 如果有查询文本，默认展开所有
              defaultExpandAll={query.length > 0}
              className="bg-transparent"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TreeSelect;
