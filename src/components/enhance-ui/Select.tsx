import * as React from "react";
import { Input } from "../ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { cn } from "../../lib/utils";
import { XIcon, Check, ChevronDown } from "lucide-react";
import { List } from "./List";

export type EnhancedSelectOption = {
  /** 选项显示的文本 */
  label: string;
  /** 选项值（需唯一，用于受控 value） */
  value: string;
  /** 是否禁用该选项 */
  disabled?: boolean;
};

type SingleProps = {
  /** 选项数据源 */
  options: EnhancedSelectOption[];
  /** 当前选中值（受控） */
  value?: string;
  /** 值变化回调；单选：返回选中 option；清除：返回 null */
  onChange: (value?: string, option?: EnhancedSelectOption | null) => void;
  /** 模式（单选），默认 "single" */
  mode?: "single";
  /** 占位文案 */
  placeholder?: string;
  /** 外层容器类名 */
  className?: string;
  /** 弹层内容容器类名 */
  contentClassName?: string;
  /** 弹层宽度是否匹配触发器宽度，默认 true */
  matchTriggerWidth?: boolean;
  /** 弹层自定义宽度（优先生效），如 360 或 "28rem" */
  contentWidth?: number | string;
  /** 多选标签最多显示数量（单选无需） */
  maxTagCount?: number;
  /** 是否可搜索，默认 true */
  searchable?: boolean;
  /** 是否允许清除，默认 true */
  allowClear?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义选项渲染 */
  renderLabel?: (option: EnhancedSelectOption) => React.ReactNode;
  /** 列表容器高度（虚拟滚动） */
  listHeight?: number;
  /** 预估项高度（虚拟滚动） */
  estimatedItemSize?: number;
};

type MultipleProps = {
  /** 选项数据源 */
  options: EnhancedSelectOption[];
  /** 当前选中值数组（受控） */
  value?: string[];
  /** 值变化回调；多选：返回所有选中 options；清除：返回 [] */
  onChange: (value?: string[], option?: EnhancedSelectOption[]) => void;
  /** 模式（多选） */
  mode: "multiple";
  /** 占位文案 */
  placeholder?: string;
  /** 外层容器类名 */
  className?: string;
  /** 弹层内容容器类名 */
  contentClassName?: string;
  /** 弹层宽度是否匹配触发器宽度，默认 true */
  matchTriggerWidth?: boolean;
  /** 弹层自定义宽度（优先生效），如 360 或 "28rem" */
  contentWidth?: number | string;
  /** 标签最多显示数量；超出以 +N 展示 */
  maxTagCount?: number;
  /** 是否可搜索，默认 true */
  searchable?: boolean;
  /** 是否允许清除，默认 true */
  allowClear?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义选项渲染 */
  renderLabel?: (option: EnhancedSelectOption) => React.ReactNode;
  /** 列表容器高度（虚拟滚动） */
  listHeight?: number;
  /** 预估项高度（虚拟滚动） */
  estimatedItemSize?: number;
};

/** 增强型 Select 组件的 props（单选与多选模式联合） */
export type EnhancedSelectProps = SingleProps | MultipleProps;

/**
 * 增强型选择组件：支持搜索（不区分大小写）、清除选择、虚拟列表优化
 * 继承基础 Select 能力（Radix Select 封装），并整合 Input 控制能力
 */
export const EnhancedSelect: React.FC<EnhancedSelectProps> = (props) => {
  const {
    options,
    placeholder = "请选择",
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
  } = props;
  const isMultiple = props.mode === "multiple";
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [measuredWidth, setMeasuredWidth] = React.useState<number>();

  React.useLayoutEffect(() => {
    const update = () => {
      if (inputRef.current) setMeasuredWidth(inputRef.current.offsetWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const normalized = (s: string) => s.toLowerCase();
  const filteredOptions = React.useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = normalized(query.trim());
    return options.filter(
      (opt) =>
        normalized(opt.label).includes(q) || normalized(opt.value).includes(q),
    );
  }, [options, query, searchable]);

  const selectedValues = React.useMemo(() => {
    if (isMultiple) return (props.value as string[] | undefined) ?? [];
    const v = props.value as string | undefined;
    return v ? [v] : [];
  }, [props.value, isMultiple]);

  const labelMap = React.useMemo(() => {
    const m = new Map<string, string>();
    options.forEach((o) => m.set(o.value, String(o.label)));
    return m;
  }, [options]);

  const displayText = React.useMemo(() => {
    if (isMultiple) return selectedValues.length ? "" : "";
    if (!selectedValues.length) return "";
    const labels = selectedValues.map((v) => labelMap.get(v) ?? v);
    return labels.join(", ");
  }, [selectedValues, labelMap, isMultiple]);

  const clearable = allowClear && selectedValues.length > 0 && !disabled;

  const handleSelect = (opt: EnhancedSelectOption) => {
    if (opt.disabled) return;
    if (isMultiple) {
      const curr = (props.value as string[] | undefined) ?? [];
      const set = new Set(curr);
      if (set.has(opt.value)) set.delete(opt.value);
      else set.add(opt.value);
      const arr = Array.from(set);
      const arrOptions = options.filter((o) => arr.includes(o.value));
      (props as MultipleProps).onChange(arr.length ? arr : [], arrOptions);
    } else {
      (props as SingleProps).onChange(opt.value, opt);
      setOpen(false);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMultiple) (props as MultipleProps).onChange([], []);
    else (props as SingleProps).onChange(undefined, null);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  return (
    <div className={cn("relative inline-block w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Input
            ref={inputRef}
            readOnly
            disabled={disabled}
            value={displayText}
            placeholder={placeholder}
            onClick={() => {
              if (!disabled) setOpen(true);
            }}
            className={cn(
              "pr-8 focus:ring-1 focus:ring-ring",
              disabled && "cursor-not-allowed",
            )}
          />
        </PopoverTrigger>
        <PopoverContent
          className={cn("p-2", contentClassName)}
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
                placeholder="搜索"
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
                      "flex items-center justify-between px-2 py-1 rounded cursor-pointer",
                      selected ? "bg-accent" : "hover:bg-accent",
                      option.disabled && "opacity-50 cursor-not-allowed",
                    )}
                    onClick={() => handleSelect(option)}
                  >
                    <div className="truncate">
                      {renderLabel ? renderLabel(option) : option.label}
                    </div>
                    {selected && <Check className="h-4 w-4" />}
                  </div>
                );
              }}
            />
          ) : (
            <div className="px-2 py-3 text-sm text-muted-foreground">
              无匹配选项
            </div>
          )}
        </PopoverContent>
      </Popover>
      {isMultiple && selectedValues.length > 0 && (
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
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      )}
    </div>
  );
};

export default EnhancedSelect;
