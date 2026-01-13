import * as React from 'react';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '../../lib/utils';
import { XIcon, Check, ChevronDown } from 'lucide-react';
import { List } from './List';
import { useLocale } from '../ConfigProvider';
import type { ClassValue } from 'clsx';

export type EnhancedSelectOption<
  T = string | number,
  Extra = Record<string, any>,
> = {
  /** 选项显示的文本 */
  label: string;
  /** 选项值（需唯一，用于受控 value） */
  value: T;
  /** 是否禁用该选项 */
  disabled?: boolean;
} & Extra;

export type EnhancedSelectProps<T = string | number> = {
  /** 选项数据源 */
  options: EnhancedSelectOption<T>[];
  /** 模式：单选或多选，默认 "single" */
  mode?: 'single' | 'multiple';
  /** 占位文案 */
  placeholder?: string;
  /** 外层容器类名 */
  className?: ClassValue;
  /** 弹层内容容器类名 */
  contentClassName?: string;
  /** 弹层宽度是否匹配触发器宽度，默认 true */
  matchTriggerWidth?: boolean;
  /** 弹层自定义宽度（优先生效），如 360 或 "28rem" */
  contentWidth?: number | string;
  /** 多选标签最多显示数量，默认 3 */
  maxTagCount?: number;
  /** 是否可搜索，默认 true */
  searchable?: boolean;
  /** 是否允许清除，默认 true */
  allowClear?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义选项渲染 */
  renderLabel?: (option: EnhancedSelectOption<T>) => React.ReactNode;
  /** 列表容器高度（虚拟滚动） */
  listHeight?: number | string;
  /** 预估项高度（虚拟滚动） */
  estimatedItemSize?: number;
  inputClassName?: ClassValue;
  listItemClassName?: ClassValue;
  showCheck?: boolean;
} & (
    | {
      /** 模式（单选） */
      mode?: 'single';
      /** 当前选中值（受控） */
      value?: T;
      /** 值变化回调；单选：返回选中 option；清除：返回 undefined */
      onChange: (value?: T, option?: EnhancedSelectOption<T> | null) => void;
    }
    | {
      /** 模式（多选） */
      mode: 'multiple';
      /** 当前选中值数组（受控） */
      value?: T[];
      /** 值变化回调；多选：返回所有选中 options；清除：返回 [] */
      onChange: (value?: T[], option?: EnhancedSelectOption<T>[]) => void;
    }
  );

/**
 * 增强型选择组件：支持搜索（不区分大小写）、清除选择、虚拟列表优化
 * 继承基础 Select 能力（Radix Select 封装），并整合 Input 控制能力
 */
export const EnhancedSelect = <T extends string | number = string | number>(
  props: EnhancedSelectProps<T>
) => {
  const {
    options,
    placeholder,
    className,
    contentClassName,
    matchTriggerWidth = true,
    contentWidth,
    maxTagCount = 3,
    searchable = true,
    allowClear = true,
    disabled,
    renderLabel,
    listHeight = 240,
    estimatedItemSize = 36,
    inputClassName,
    listItemClassName,
    showCheck = true,
    mode = 'single',
  } = props;
  const locale = useLocale();
  const mergedPlaceholder = placeholder ?? locale.select_placeholder;
  const isMultiple = mode === 'multiple';
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [measuredWidth, setMeasuredWidth] = React.useState<number>();

  React.useLayoutEffect(() => {
    const update = () => {
      if (inputRef.current && inputRef.current.offsetWidth > 0) {
        setMeasuredWidth(inputRef.current.offsetWidth);
      }
    };
    update();

    let observer: ResizeObserver;
    if (inputRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(update);
      observer.observe(inputRef.current);
    }

    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      observer?.disconnect();
    };
  }, []);
  const normalized = (s: string) => s.toLowerCase();
  const filteredOptions = React.useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = normalized(query.trim());
    return options.filter(
      (opt) =>
        normalized(opt.label).includes(q) ||
        normalized(String(opt.value)).includes(q)
    );
  }, [options, query, searchable]);

  const selectedValues = React.useMemo(() => {
    if (isMultiple) return (props.value as T[] | undefined) ?? [];
    const v = props.value as T | undefined;
    return v !== undefined ? [v] : [];
  }, [props.value, isMultiple]);

  const labelMap = React.useMemo(() => {
    const m = new Map<T, string>();
    options.forEach((o) => m.set(o.value, String(o.label)));
    return m;
  }, [options]);

  const displayText = React.useMemo(() => {
    if (isMultiple) return selectedValues.length ? '' : '';
    if (!selectedValues.length) return '';
    const labels = selectedValues.map((v) => labelMap.get(v) ?? v);
    return labels.join(', ');
  }, [selectedValues, labelMap, isMultiple]);

  const clearable = allowClear && selectedValues.length > 0 && !disabled;

  const handleSelect = (opt: EnhancedSelectOption<T>) => {
    if (opt.disabled) return;
    if (isMultiple) {
      const curr = (props.value as T[] | undefined) ?? [];
      const set = new Set(curr);
      if (set.has(opt.value)) set.delete(opt.value);
      else set.add(opt.value);
      const arr = Array.from(set);
      const arrOptions = options.filter((o) => arr.includes(o.value));
      (
        props.onChange as (
          value?: T[],
          option?: EnhancedSelectOption<T>[]
        ) => void
      )(arr.length ? arr : [], arrOptions);
    } else {
      (
        props.onChange as (
          value?: T,
          option?: EnhancedSelectOption<T> | null
        ) => void
      )(opt.value, opt);
      setOpen(false);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMultiple) {
      (
        props.onChange as (
          value?: T[],
          option?: EnhancedSelectOption<T>[]
        ) => void
      )([], []);
    } else {
      (
        props.onChange as (
          value?: T,
          option?: EnhancedSelectOption<T> | null
        ) => void
      )(undefined, null);
    }
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      setQuery('');
    });
  };

  const hasValue = isMultiple
    ? selectedValues.length > 0
    : displayText.length > 0;

  return (
    <div className={cn('relative inline-block w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Input
              ref={inputRef}
              readOnly
              disabled={disabled}
              value={hasValue ? displayText : ''}
              placeholder={hasValue ? '' : mergedPlaceholder}
              onClick={() => {
                if (!disabled) setOpen(true);
              }}
              className={cn(
                'pr-8 shadow-none text-left font-normal cursor-pointer',
                inputClassName,
                disabled && 'cursor-not-allowed'
              )}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className={cn('p-2', contentClassName)}
          align="start"
          sideOffset={4}
          style={{
            width:
              contentWidth ?? (matchTriggerWidth ? measuredWidth : undefined),
          }}
        >
          {searchable && (
            <div className="mb-2">
              <Input
                placeholder={locale.search_placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-8"
              />
            </div>
          )}
          {filteredOptions.length > 0 ? (
            <List
              dataSource={filteredOptions}
              estimatedItemSize={estimatedItemSize}
              containerHeight={listHeight}
              itemGap={4}
              renderItem={(option) => {
                const selected = selectedValues.includes(option.value);
                return (
                  <div
                    className={cn(
                      'flex items-center justify-between px-2 py-1 rounded cursor-pointer text-sm',
                      listItemClassName,
                      selected ? 'bg-accent font-bold' : 'hover:bg-accent',
                      option.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={() => handleSelect(option)}
                  >
                    <div className="truncate">
                      {renderLabel ? renderLabel(option) : option.label}
                    </div>
                    {selected && showCheck && <Check className="h-4 w-4" />}
                  </div>
                );
              }}
            />
          ) : (
            <div className="px-2 py-3 text-sm text-muted-foreground">
              {locale.noMatch}
            </div>
          )}
        </PopoverContent>
      </Popover>
      {isMultiple && selectedValues.length > 0 && (
        <>
          {/* 隐藏 placeholder */}
          <div className="pointer-events-none absolute inset-y-0 left-3 right-8 flex items-center">
            <span className="text-transparent select-none">{placeholder}</span>
          </div>
          {/* 显示选中的标签 */}
          <div className="pointer-events-none absolute inset-y-0 left-3 right-8 flex items-center gap-1 overflow-hidden">
            {selectedValues.slice(0, maxTagCount).map((v) => (
              <span
                key={v}
                className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
              >
                {labelMap.get(v) ?? v}
              </span>
            ))}
            {selectedValues.length > maxTagCount && (
              <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                +{selectedValues.length - maxTagCount}
              </span>
            )}
          </div>
        </>
      )}
      {clearable ? (
        <button
          type="button"
          aria-label="clear"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClear(e);
            setOpen(false);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center z-10 cursor-pointer"
        >
          <XIcon className="h-3 w-3" />
        </button>
      ) : (
        <ChevronDown
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
            disabled && 'cursor-not-allowed text-muted-foreground/50'
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (disabled) return;
            requestAnimationFrame(() => {
              inputRef.current?.focus();
            });
            setOpen(true);
          }}
        />
      )}
    </div>
  );
};

export default EnhancedSelect;
