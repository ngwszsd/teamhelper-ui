import * as React from 'react';
import Tree, {
  type TreeProps,
  type TreeNode,
  type TreeSelectInfo,
} from './Tree';
import { cn } from '../../lib/utils';
import { File, Folder, FolderOpen } from 'lucide-react';

export interface DirectoryTreeProps extends TreeProps {
  expandAction?: 'click' | 'doubleClick' | false;
  fileIcon?: React.ReactNode;
  folderIcon?: React.ReactNode;
  folderOpenIcon?: React.ReactNode;
}

function getNodeKey(node: TreeNode, path: number[]): React.Key {
  if (node.key != null) return node.key;
  return path.join('-');
}

function initializeExpandedKeys(
  treeData: TreeNode[],
  options: {
    defaultExpandedKeys?: React.Key[];
    defaultExpandAll?: boolean;
    autoExpandRoot?: boolean;
    showToggleIcon?: boolean;
  }
): React.Key[] {
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
  if (!showToggleIcon || defaultExpandAll) {
    walkAdd(treeData);
  } else if (autoExpandRoot) {
    treeData.forEach((n, idx) => {
      const k = getNodeKey(n, [idx]);
      if (n.children && n.children.length > 0) initial.add(k);
    });
  }
  return Array.from(initial);
}

export const DirectoryTree: React.FC<DirectoryTreeProps> = ({
  treeData,
  renderNodeContent,
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
  expandAction = 'click',
  fileIcon,
  folderIcon,
  folderOpenIcon,
}) => {
  const [expandedKeysState, setExpandedKeysState] = React.useState<React.Key[]>(
    expandedKeys ??
      initializeExpandedKeys(treeData, {
        defaultExpandedKeys,
        defaultExpandAll,
        autoExpandRoot,
        showToggleIcon,
      })
  );

  React.useEffect(() => {
    if (expandedKeys) setExpandedKeysState(expandedKeys);
  }, [expandedKeys]);

  const handleExpandedChange = React.useCallback(
    (keys: React.Key[]) => {
      if (!expandedKeys) setExpandedKeysState(keys);
      onExpandedKeysChange?.(keys);
    },
    [expandedKeys, onExpandedKeysChange]
  );

  const toggleKey = React.useCallback(
    (key: React.Key) => {
      const set = new Set(expandedKeysState);
      if (set.has(key)) set.delete(key);
      else set.add(key);
      const next = Array.from(set);
      setExpandedKeysState(next);
      onExpandedKeysChange?.(next);
    },
    [expandedKeysState, onExpandedKeysChange]
  );

  const handleSelect = React.useCallback(
    (keys: React.Key[], info: TreeSelectInfo) => {
      if (
        expandAction === 'click' &&
        info.node.children &&
        info.node.children.length > 0 &&
        !info.node.disabled
      ) {
        toggleKey(info.key);
      }
      onSelect?.(keys, info);
    },
    [expandAction, toggleKey, onSelect]
  );

  const renderContent = React.useCallback(
    (
      node: TreeNode,
      state: {
        key: React.Key;
        level: number;
        expanded: boolean;
        isLeaf: boolean;
      }
    ) => {
      const iconNode =
        node.icon ??
        (state.isLeaf
          ? (fileIcon ?? (
              <File className="h-4 w-4 text-muted-foreground mr-2" />
            ))
          : state.expanded
            ? (folderOpenIcon ?? (
                <FolderOpen className="h-4 w-4 mr-2 text-[#FFB02C] fill-[#FFCA28]" />
              ))
            : (folderIcon ?? (
                <Folder className="h-4 w-4 mr-2 text-[#FFB02C] fill-[#FFCA28]" />
              )));

      return (
        <div
          className="flex items-center min-w-0 w-full"
          onDoubleClick={
            expandAction === 'doubleClick' && !state.isLeaf && !node.disabled
              ? (e) => {
                  e.stopPropagation();
                  toggleKey(state.key);
                }
              : undefined
          }
        >
          <div className="mr-0 flex">{iconNode}</div>
          {renderNodeContent ? (
            renderNodeContent(node, state)
          ) : (
            <span
              className={cn(
                'truncate text-sm',
                state.isLeaf ? 'font-normal' : 'font-medium'
              )}
            >
              {node.title}
            </span>
          )}
        </div>
      );
    },
    [
      expandAction,
      fileIcon,
      folderIcon,
      folderOpenIcon,
      renderNodeContent,
      toggleKey,
    ]
  );

  return (
    <Tree
      treeData={treeData}
      renderNodeContent={renderContent}
      defaultExpandedKeys={defaultExpandedKeys}
      defaultExpandAll={defaultExpandAll}
      expandedKeys={expandedKeys ?? expandedKeysState}
      onExpandedKeysChange={handleExpandedChange}
      selectedKeys={selectedKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      onSelect={handleSelect}
      selectionMode={selectionMode}
      selectable={selectable}
      containerHeight={containerHeight}
      estimatedItemSize={estimatedItemSize}
      indent={indent}
      className={className}
      autoExpandRoot={autoExpandRoot}
      showToggleIcon={showToggleIcon}
      toggleIcon={toggleIcon}
      toggleIconClassName={toggleIconClassName}
      toggleIconPosition={toggleIconPosition}
      getTreeItemClassName={getTreeItemClassName}
    />
  );
};

DirectoryTree.displayName = 'EnhancedDirectoryTree';

export default DirectoryTree;
