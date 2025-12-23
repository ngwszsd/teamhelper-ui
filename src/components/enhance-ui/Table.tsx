import * as React from 'react';
import { cn } from '../../lib/utils';
import {
  Table as BaseTable,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { EnhancedSpinner } from './Spinner';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Empty } from './Empty';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { EnhancedTooltip } from './Tooltip';

export interface ColumnType<T = any> {
  title?: React.ReactNode;
  dataIndex?: string;
  key?: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  sorter?: boolean | ((a: T, b: T) => number);
  sortOrder?: 'ascend' | 'descend' | null;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  onHeaderCell?: (
    column: ColumnType<T>
  ) => React.HTMLAttributes<HTMLTableCellElement>;
  onCell?: (
    record: T,
    rowIndex: number
  ) => React.HTMLAttributes<HTMLTableCellElement>;
  ellipsis?: boolean;
  className?: string;
}

export interface EnhancedTableProps<T = any> {
  columns: ColumnType<T>[];
  dataSource?: T[];
  rowKey?: string | ((record: T) => string);
  loading?: boolean;
  rowSelection?: {
    type?: 'checkbox' | 'radio';
    selectedRowKeys?: React.Key[];
    onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
    onSelect?: (
      record: T,
      selected: boolean,
      selectedRows: T[],
      nativeEvent: Event
    ) => void;
    onSelectAll?: (
      selected: boolean,
      selectedRows: T[],
      changeRows: T[]
    ) => void;
    getCheckboxProps?: (record: T) => {
      disabled?: boolean;
      onClick?: (e: React.MouseEvent) => void;
    };
  };
  scroll?: { x?: number | string; y?: number | string };
  size?: 'small' | 'middle' | 'large';
  bordered?: boolean;
  showHeader?: boolean;
  title?: (currentPageData: T[]) => React.ReactNode;
  footer?: (currentPageData: T[]) => React.ReactNode;
  expandable?: {
    expandedRowKeys?: React.Key[];
    defaultExpandedRowKeys?: React.Key[];
    expandedRowRender?: (
      record: T,
      index: number,
      indent: number,
      expanded: boolean
    ) => React.ReactNode;
    expandRowByClick?: boolean;
    onExpand?: (expanded: boolean, record: T) => void;
    onExpandedRowsChange?: (expandedKeys: React.Key[]) => void;
  };
  onRow?: (
    record: T,
    index: number
  ) => React.HTMLAttributes<HTMLTableRowElement>;
  onHeaderRow?: (
    columns: ColumnType<T>[],
    index: number
  ) => React.HTMLAttributes<HTMLTableRowElement>;
  className?: string;
  style?: React.CSSProperties;
  locale?: {
    emptyText?: React.ReactNode;
  };
  sortDirections?: ('ascend' | 'descend')[];
  onChange?: (
    filters: any,
    sorter: any,
    extra: { currentDataSource: T[]; action: string }
  ) => void;
  /** 表头固定配置：true/false 或配置对象（默认启用） */
  stickyHeader?: boolean | { top?: number; zIndex?: number };
}

const Table = <T extends Record<string, any> = any>({
  columns,
  dataSource = [],
  rowKey = 'key',
  loading = false,
  rowSelection,
  scroll,
  size = 'middle',
  bordered = false,
  showHeader = true,
  title,
  footer,
  onRow,
  onHeaderRow,
  className,
  style,
  locale = { emptyText: <Empty description="暂无数据" /> },
  onChange,
  stickyHeader = true,
}: EnhancedTableProps<T>) => {
  // Fixed header + virtualization state
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const enableVirtual = React.useMemo(() => {
    // 启用虚拟滚动的条件：存在纵向滚动容器，且数据量超过 200
    return !!scroll?.y && dataSource.length > 200;
  }, [scroll?.y, dataSource.length]);

  const [sortedInfo, setSortedInfo] = React.useState<{
    columnKey?: string;
    order?: 'ascend' | 'descend';
  }>({});

  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>(
    rowSelection?.selectedRowKeys || []
  );

  // 性能优化：使用 useDeferredValue 延迟状态更新，减少重渲染
  const deferredSelectedRowKeys = React.useDeferredValue(selectedRowKeys);

  // 性能优化：使用 Set 来快速查找选中状态
  const selectedKeysSet = React.useMemo(() => {
    return new Set(deferredSelectedRowKeys);
  }, [deferredSelectedRowKeys]);

  // 性能优化：同步外部状态变化，避免不必要的重渲染
  React.useEffect(() => {
    const externalKeys = rowSelection?.selectedRowKeys;
    if (
      externalKeys &&
      JSON.stringify(externalKeys) !== JSON.stringify(selectedRowKeys)
    ) {
      setSelectedRowKeys(externalKeys);
    }
  }, [rowSelection?.selectedRowKeys, selectedRowKeys]);

  // 高性能批量更新队列 - 使用微任务替代setTimeout
  const updateQueueRef = React.useRef<{
    pendingKeys: React.Key[];
    pendingRows: T[];
    isProcessing: boolean;
    batchCount: number;
  }>({
    pendingKeys: [],
    pendingRows: [],
    isProcessing: false,
    batchCount: 0,
  });

  const getRowKey = React.useCallback(
    (record: T, index: number): string => {
      if (typeof rowKey === 'function') {
        return rowKey(record);
      }
      return record[rowKey] || index.toString();
    },
    [rowKey]
  );

  // 性能优化：创建 key 到 record 的映射，避免频繁的 findIndex 操作
  const keyToRecordMap = React.useMemo(() => {
    const map = new Map<React.Key, T>();
    dataSource.forEach((record, index) => {
      const key = getRowKey(record, index);
      map.set(key, record);
    });
    return map;
  }, [dataSource, getRowKey]);

  const handleSort = (column: ColumnType<T>) => {
    if (!column.sorter) return;

    const columnKey = column.key || column.dataIndex;
    let order: 'ascend' | 'descend' | null = null;

    if (sortedInfo.columnKey === columnKey) {
      if (sortedInfo.order === 'ascend') {
        order = 'descend';
      } else if (sortedInfo.order === 'descend') {
        order = null;
      } else {
        order = 'ascend';
      }
    } else {
      order = 'ascend';
    }

    const newSortedInfo = {
      columnKey: order ? columnKey : undefined,
      order: order || undefined,
    };

    setSortedInfo(newSortedInfo);

    if (onChange) {
      onChange({}, newSortedInfo, {
        currentDataSource: dataSource,
        action: 'sort',
      });
    }
  };

  // 使用微任务进行高效批量更新
  const flushSelectionUpdate = React.useCallback(() => {
    if (updateQueueRef.current.isProcessing) return;

    updateQueueRef.current.isProcessing = true;

    // 使用微任务，比setTimeout性能更好
    queueMicrotask(() => {
      const { pendingKeys, pendingRows } = updateQueueRef.current;

      if (pendingKeys.length > 0) {
        setSelectedRowKeys(pendingKeys);
        rowSelection?.onChange?.(pendingKeys, pendingRows);

        // 清空队列
        updateQueueRef.current.pendingKeys = [];
        updateQueueRef.current.pendingRows = [];
      }

      updateQueueRef.current.isProcessing = false;
    });
  }, [rowSelection]);

  const handleSelectChange = React.useCallback(
    (
      keys: React.Key[],
      rows: T[],
      immediate = false,
      triggerCallback = true
    ) => {
      if (immediate || keys.length === 0) {
        // 立即更新（如全选/全不选）
        setSelectedRowKeys(keys);
        if (triggerCallback) {
          rowSelection?.onChange?.(keys, rows);
        }
      } else {
        // 批量更新（单个选择操作）
        updateQueueRef.current.pendingKeys = keys;
        updateQueueRef.current.pendingRows = rows;
        updateQueueRef.current.batchCount++;

        // 使用微任务进行批量更新
        flushSelectionUpdate();
      }
    },
    [rowSelection, flushSelectionUpdate]
  );

  const handleSelectAll = React.useCallback(
    (checked: boolean) => {
      // 对于超大数据量，使用Web Worker或分片处理
      if (checked && dataSource.length > 100000) {
        // 超大数据量：使用Web Worker进行后台处理
        const processLargeDataset = () => {
          const keys: React.Key[] = [];
          const rows: T[] = [];

          // 分片处理，每片处理20000条数据
          const chunkSize = 20000;
          let currentIndex = 0;

          const processChunk = () => {
            const endIndex = Math.min(
              currentIndex + chunkSize,
              dataSource.length
            );

            // 使用for循环而不是map，性能更好
            for (let i = currentIndex; i < endIndex; i++) {
              const record = dataSource[i];
              keys.push(getRowKey(record, i));
              rows.push(record);
            }

            currentIndex = endIndex;

            // 立即更新UI状态，让用户看到进度
            setSelectedRowKeys([...keys]);

            if (currentIndex < dataSource.length) {
              // 使用MessageChannel进行异步处理，比setTimeout更高效
              const channel = new MessageChannel();
              channel.port2.onmessage = () => {
                processChunk();
              };
              channel.port1.postMessage(null);
            } else {
              // 完成处理，触发回调
              rowSelection?.onChange?.(keys, rows);
              rowSelection?.onSelectAll?.(checked, rows, dataSource);
            }
          };

          processChunk();
        };

        processLargeDataset();
      } else if (checked && dataSource.length > 10000) {
        // 大数据量：使用requestAnimationFrame优化
        const keys: React.Key[] = [];
        const batchSize = 5000;
        let currentIndex = 0;

        const processBatch = () => {
          const endIndex = Math.min(
            currentIndex + batchSize,
            dataSource.length
          );

          for (let i = currentIndex; i < endIndex; i++) {
            keys.push(getRowKey(dataSource[i], i));
          }

          currentIndex = endIndex;

          if (currentIndex < dataSource.length) {
            // 使用requestAnimationFrame，在下一帧处理
            requestAnimationFrame(processBatch);
          } else {
            handleSelectChange(keys, dataSource, true, true);
            rowSelection?.onSelectAll?.(checked, dataSource, dataSource);
          }
        };

        processBatch();
      } else {
        // 小数据量：直接处理
        const keys = checked
          ? dataSource.map((record, index) => getRowKey(record, index))
          : [];
        const rows = checked ? dataSource : [];
        handleSelectChange(keys, rows, true, true);
        rowSelection?.onSelectAll?.(checked, rows, dataSource);
      }
    },
    [dataSource, getRowKey, handleSelectChange, rowSelection]
  );

  const handleSelect = React.useCallback(
    (record: T, checked: boolean, index: number, nativeEvent: Event) => {
      const key = getRowKey(record, index);

      let newKeys: React.Key[];
      if (rowSelection?.type === 'radio') {
        // 单选模式：只能选择一个
        newKeys = checked ? [key] : [];
      } else {
        // 多选模式：使用 Set 进行高效的增删操作
        const keysSet = new Set(selectedRowKeys);
        if (checked) {
          keysSet.add(key);
        } else {
          keysSet.delete(key);
        }
        newKeys = Array.from(keysSet);
      }

      const newRows = newKeys
        .map((k) => keyToRecordMap.get(k))
        .filter(Boolean) as T[];

      // 性能优化：对于大数据量，使用批量更新；对于小数据量，立即更新
      const shouldBatch = newKeys.length > 1000;
      handleSelectChange(newKeys, newRows, !shouldBatch);

      // 使用微任务延迟回调，比setTimeout性能更好
      if (shouldBatch) {
        queueMicrotask(() => {
          rowSelection?.onSelect?.(record, checked, newRows, nativeEvent);
        });
      } else {
        rowSelection?.onSelect?.(record, checked, newRows, nativeEvent);
      }
    },
    [
      dataSource,
      getRowKey,
      handleSelectChange,
      rowSelection,
      selectedRowKeys,
      keyToRecordMap,
    ]
  );

  const renderSortIcon = (column: ColumnType<T>) => {
    if (!column.sorter) return null;

    const columnKey = column.key || column.dataIndex;
    const isActive = sortedInfo.columnKey === columnKey;

    if (isActive) {
      return sortedInfo.order === 'ascend' ? (
        <ChevronUp className="w-4 h-4 ml-1" />
      ) : (
        <ChevronDown className="w-4 h-4 ml-1" />
      );
    }

    return <ChevronsUpDown className="w-4 h-4 ml-1 opacity-50" />;
  };

  const sizeClasses = {
    small: 'text-xs',
    middle: 'text-sm',
    large: 'text-base',
  };

  const paddingClasses = {
    small: '[&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1',
    middle: '[&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2',
    large: '[&_th]:px-4 [&_th]:py-3 [&_td]:px-4 [&_td]:py-3',
  };

  // 统一的行高估算，确保虚拟滚动时行高一致且平滑
  const rowHeightBySize: Record<
    NonNullable<EnhancedTableProps<T>['size']>,
    number
  > = {
    small: 28,
    middle: 40,
    large: 48,
  };
  const rowHeight = rowHeightBySize[size];

  // 初始化虚拟滚动器
  const rowVirtualizer = useVirtualizer({
    count: dataSource.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => rowHeight,
    overscan: 8,
    paddingStart: 0,
    paddingEnd: 0,
  });

  // 统一对齐类名解析：默认 left，支持运行时更新
  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    const a = align ?? 'left';
    return a === 'center'
      ? 'text-center'
      : a === 'right'
        ? 'text-right'
        : 'text-left';
  };

  // 处理固定列逻辑
  const { leftFixedColumns, normalColumns, rightFixedColumns } =
    React.useMemo(() => {
      const left: ColumnType<T>[] = [];
      const normal: ColumnType<T>[] = [];
      const right: ColumnType<T>[] = [];

      columns.forEach((col) => {
        if (col.fixed === 'left') {
          left.push(col);
        } else if (col.fixed === 'right') {
          right.push(col);
        } else {
          normal.push(col);
        }
      });

      return {
        leftFixedColumns: left,
        normalColumns: normal,
        rightFixedColumns: right,
      };
    }, [columns]);

  // 渲染列的通用函数
  const renderColumns = (cols: ColumnType<T>[], isFixed?: 'left' | 'right') => {
    return cols.map((column, index) => {
      const columnKey = column.key || column.dataIndex || index;
      return (
        <TableHead
          key={columnKey}
          className={cn(
            getAlignClass(column.align),
            column.className,
            column.sorter && 'cursor-pointer select-none hover:bg-muted/50',
            isFixed && 'sticky bg-background z-10',
            isFixed === 'left' && 'left-0',
            isFixed === 'right' && 'right-0'
          )}
          style={{
            width: column.width,
            ...(isFixed === 'left' && { left: rowSelection ? 48 : 0 }),
            ...(isFixed === 'right' && { right: 0 }),
          }}
          onClick={() => handleSort(column)}
          {...(column.onHeaderCell?.(column) || {})}
        >
          <div className="flex items-center">
            {column.title}
            {renderSortIcon(column)}
          </div>
        </TableHead>
      );
    });
  };

  // 渲染单元格的通用函数
  const renderCells = (
    cols: ColumnType<T>[],
    record: T,
    index: number,
    isFixed?: 'left' | 'right'
  ) => {
    return cols.map((column, colIndex) => {
      const columnKey = column.key || column.dataIndex || colIndex;
      const value = column.dataIndex ? record[column.dataIndex] : record;
      const cellContent = column.render
        ? column.render(value, record, index)
        : value;

      return (
        <TableCell
          key={columnKey}
          className={cn(
            getAlignClass(column.align),
            column.ellipsis && 'truncate max-w-0',
            isFixed && 'sticky bg-background z-10',
            isFixed === 'left' && 'left-0',
            isFixed === 'right' && 'right-0'
          )}
          style={{
            ...(isFixed === 'left' && { left: rowSelection ? 48 : 0 }),
            ...(isFixed === 'right' && { right: 0 }),
          }}
          {...(column.onCell?.(record, index) || {})}
        >
          {column.ellipsis ? (
            <EnhancedTooltip
              title={cellContent}
              overlayClassName="max-w-[280px]"
            >
              <div className="truncate">{cellContent}</div>
            </EnhancedTooltip>
          ) : (
            <>{cellContent}</>
          )}
        </TableCell>
      );
    });
  };

  // 表头固定配置解析
  const stickyEnabled = stickyHeader !== false;
  const stickyTop =
    typeof stickyHeader === 'object' && stickyHeader?.top != null
      ? stickyHeader.top
      : 0;
  const stickyZIndex =
    typeof stickyHeader === 'object' && stickyHeader?.zIndex != null
      ? stickyHeader.zIndex
      : 20;

  return (
    <div
      className={cn('w-full h-full min-h-0 flex flex-col', className)}
      style={style}
    >
      {title && <div className="mb-4">{title(dataSource)}</div>}

      <div
        className={cn(
          'relative overflow-auto border rounded-md flex-1 min-h-0',
          bordered && 'border-border',
          !bordered && 'border-transparent'
        )}
        ref={scrollContainerRef}
        style={
          scroll
            ? { maxHeight: scroll.y, maxWidth: scroll.x }
            : { height: '100%', maxWidth: '100%' }
        }
      >
        <>
          <div
            className={cn('relative h-full', className, {
              hidden: !loading,
            })}
            style={style}
          >
            <EnhancedSpinner spinning wrapperClassName="h-full">
              <div className="min-h-[200px]" />
            </EnhancedSpinner>
          </div>
          <BaseTable
            className={cn(
              sizeClasses[size],
              paddingClasses[size],
              'w-full table-fixed',
              {
                hidden: loading,
              }
            )}
          >
            {showHeader && (
              <TableHeader
                className={cn('bg-background', stickyEnabled && 'sticky')}
                style={
                  stickyEnabled
                    ? { top: stickyTop, zIndex: stickyZIndex }
                    : undefined
                }
              >
                <TableRow {...(onHeaderRow?.(columns, 0) || {})}>
                  {rowSelection && (
                    <TableHead
                      className={cn('w-12 sticky left-0 bg-background z-20')}
                    >
                      {rowSelection.type !== 'radio' && (
                        <Checkbox
                          checked={
                            selectedRowKeys.length === dataSource.length &&
                            dataSource.length > 0
                          }
                          onCheckedChange={(checked) =>
                            handleSelectAll(!!checked)
                          }
                        />
                      )}
                    </TableHead>
                  )}
                  {renderColumns(leftFixedColumns, 'left')}
                  {renderColumns(normalColumns)}
                  {renderColumns(rightFixedColumns, 'right')}
                </TableRow>
              </TableHeader>
            )}

            <TableBody>
              {dataSource.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (rowSelection ? 1 : 0)}
                    className="text-center py-8"
                  >
                    {locale.emptyText}
                  </TableCell>
                </TableRow>
              ) : enableVirtual ? (
                // 虚拟滚动：顶部/底部占位 + 可视区域行
                (() => {
                  const virtualItems = rowVirtualizer.getVirtualItems();
                  const totalHeight = rowVirtualizer.getTotalSize();
                  const paddingTop =
                    virtualItems.length > 0 ? virtualItems[0].start : 0;
                  const paddingBottom =
                    virtualItems.length > 0
                      ? totalHeight - virtualItems[virtualItems.length - 1].end
                      : 0;

                  return (
                    <>
                      {paddingTop > 0 && (
                        <TableRow aria-hidden style={{ height: paddingTop }}>
                          <TableCell
                            colSpan={columns.length + (rowSelection ? 1 : 0)}
                          />
                        </TableRow>
                      )}

                      {virtualItems.map((vItem) => {
                        const index = vItem.index;
                        const record = dataSource[index];
                        const key = getRowKey(record, index);
                        // 使用 Set 进行快速查找，避免 includes 的 O(n) 复杂度
                        const isSelected = selectedKeysSet.has(key);

                        return (
                          <TableRow
                            key={key}
                            style={{ height: rowHeight }}
                            className={cn(
                              isSelected && 'bg-muted/50',
                              'hover:bg-muted/30'
                            )}
                            {...(onRow?.(record, index) || {})}
                          >
                            {rowSelection && (
                              <TableCell className="sticky left-0 bg-card z-10">
                                {rowSelection.type === 'radio' ? (
                                  <RadioGroup
                                    value={isSelected ? key : ''}
                                    onValueChange={(value) =>
                                      handleSelect(
                                        record,
                                        value === key,
                                        index,
                                        new Event('change')
                                      )
                                    }
                                    {...(rowSelection.getCheckboxProps?.(
                                      record
                                    ) || {})}
                                  >
                                    <RadioGroupItem value={key} />
                                  </RadioGroup>
                                ) : (
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={(checked) =>
                                      handleSelect(
                                        record,
                                        !!checked,
                                        index,
                                        new Event('change')
                                      )
                                    }
                                    {...(rowSelection.getCheckboxProps?.(
                                      record
                                    ) || {})}
                                  />
                                )}
                              </TableCell>
                            )}
                            {renderCells(
                              leftFixedColumns,
                              record,
                              index,
                              'left'
                            )}
                            {renderCells(normalColumns, record, index)}
                            {renderCells(
                              rightFixedColumns,
                              record,
                              index,
                              'right'
                            )}
                          </TableRow>
                        );
                      })}

                      {paddingBottom > 0 && (
                        <TableRow aria-hidden style={{ height: paddingBottom }}>
                          <TableCell
                            colSpan={columns.length + (rowSelection ? 1 : 0)}
                          />
                        </TableRow>
                      )}
                    </>
                  );
                })()
              ) : (
                dataSource.map((record, index) => {
                  const key = getRowKey(record, index);
                  // 使用 Set 进行快速查找，避免 includes 的 O(n) 复杂度
                  const isSelected = selectedKeysSet.has(key);

                  return (
                    <TableRow
                      key={key}
                      style={{ height: rowHeight }}
                      className={cn(
                        isSelected && 'bg-muted/50',
                        'hover:bg-muted/30'
                      )}
                      {...(onRow?.(record, index) || {})}
                    >
                      {rowSelection && (
                        <TableCell className="sticky left-0 bg-card z-10">
                          {rowSelection.type === 'radio' ? (
                            <RadioGroup
                              value={isSelected ? key : ''}
                              onValueChange={(value) =>
                                handleSelect(
                                  record,
                                  value === key,
                                  index,
                                  new Event('change')
                                )
                              }
                              {...(rowSelection.getCheckboxProps?.(record) ||
                                {})}
                            >
                              <RadioGroupItem value={key} />
                            </RadioGroup>
                          ) : (
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleSelect(
                                  record,
                                  !!checked,
                                  index,
                                  new Event('change')
                                )
                              }
                              {...(rowSelection.getCheckboxProps?.(record) ||
                                {})}
                            />
                          )}
                        </TableCell>
                      )}
                      {renderCells(leftFixedColumns, record, index, 'left')}
                      {renderCells(normalColumns, record, index)}
                      {renderCells(rightFixedColumns, record, index, 'right')}
                    </TableRow>
                  );
                })
              )}
            </TableBody>

            {footer && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={columns.length + (rowSelection ? 1 : 0)}>
                    {footer(dataSource)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </BaseTable>
        </>
      </div>
    </div>
  );
};

// 性能优化：同步外部状态变化，避免不必要的重渲染
Table.displayName = 'EnhancedTable';

export { Table as EnhancedTable };
