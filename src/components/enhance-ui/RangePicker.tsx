import * as React from 'react';
import { ChevronDownIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '../../lib/utils';
import { useLocale } from '../ConfigProvider';
import type { DateRange } from 'react-day-picker';

export interface RangePickerProps {
  // 受控值，格式 YYYY-MM-DD
  value?: [string, string];
  // 非受控初始值
  defaultValue?: [string, string];
  // 完整选择后回调（受控/非受控都会触发）
  onChange?: (value: [string, string] | undefined) => void;
  // 占位符
  placeholder?: [string, string];
  // 禁用
  disabled?: boolean;
  // 清除按钮
  allowClear?: boolean;
  // 样式
  className?: string;
  // 展示/解析格式（当前仅支持 YYYY-MM-DD）
  format?: string;
  // 展示分隔符
  separator?: string;
  // 受控弹窗
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // 预设快捷范围
  presets?: Array<{ label: string; value: [string, string] }>;
}

/**
 * 简单解析 YYYY-MM-DD
 */
const parseDate = (
  dateString?: string,
  format = 'YYYY-MM-DD'
): Date | undefined => {
  if (!dateString) return undefined;
  // 仅支持 YYYY-MM-DD
  if (format !== 'YYYY-MM-DD') return undefined;
  const date = new Date(dateString + 'T00:00:00');
  return isNaN(date.getTime()) ? undefined : date;
};

/**
 * 简单格式化为 YYYY-MM-DD
 */
const formatDate = (date?: Date, format = 'YYYY-MM-DD'): string | undefined => {
  if (!date) return undefined;
  if (format !== 'YYYY-MM-DD') return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toDateRange = (
  value?: [string, string],
  format = 'YYYY-MM-DD'
): DateRange | undefined => {
  if (!value) return undefined;
  const [start, end] = value;
  const from = parseDate(start, format);
  const to = parseDate(end, format);
  return { from, to };
};

export const RangePicker: React.FC<RangePickerProps> = ({
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled = false,
  allowClear = true,
  className,
  format = 'YYYY-MM-DD',
  separator = ' ~ ',
  open: controlledOpen,
  onOpenChange,
  presets,
}) => {
  const locale = useLocale();
  const rangeDateRef = React.useRef<Array<string> | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(() => {
    const startValue = defaultValue?.[0];
    const d = parseDate(startValue, format) ?? new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  React.useEffect(() => {
    const startValue = defaultValue?.[0];
    const d = parseDate(startValue, format);
    if (d) {
      setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }, [defaultValue, format]);

  // 受控/非受控值
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<
    [string, string] | undefined
  >(defaultValue);
  const mergedValue = isControlled ? value : internalValue;

  // 受控/非受控 open
  const isOpenControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(false);
  const mergedOpen = isOpenControlled ? !!controlledOpen : internalOpen;
  const setOpenSafe = (next: boolean) => {
    if (!isOpenControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const selectedRange = React.useMemo(
    () => toDateRange(mergedValue, format),
    [mergedValue, format]
  );
  const hasFullValue = Boolean(selectedRange?.from || selectedRange?.to);

  const displayText = React.useMemo(() => {
    const start = formatDate(selectedRange?.from, format);
    const end = formatDate(selectedRange?.to, format);
    const startPlaceholder =
      placeholder?.[0] || locale.start_date || 'Start date';
    const endPlaceholder = placeholder?.[1] || locale.end_date || 'End date';
    return `${start || startPlaceholder}${separator}${end || endPlaceholder}`;
  }, [selectedRange, placeholder, format, separator, locale]);

  const emitChange = (next?: [string, string]) => {
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  const handleRangeSelect = React.useCallback(
    (_: DateRange | undefined, triggerDate: Date) => {
      let rangeDate = rangeDateRef?.current || [];
      if (!Array.isArray(rangeDate)) return;

      if (triggerDate) {
        const date = formatDate(triggerDate, format);
        if (date) {
          if (rangeDate.length >= 2) {
            rangeDate = [date];
          } else {
            rangeDate.push?.(date);
          }
          rangeDateRef.current = rangeDate;
        }
      }

      const startDate = rangeDate?.[0];
      const endDate = rangeDate?.[1];

      if (startDate && endDate) {
        const startText = startDate > endDate ? endDate : startDate;
        const endText = endDate < startDate ? startDate : endDate;
        emitChange([startText, endText]);
        // 延迟关闭，避免卡顿
        setTimeout(() => setOpenSafe(false), 0);
      } else if (startDate) {
        emitChange([startDate, '']);
      }
    },
    [format]
  );

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (!isControlled) {
      setInternalValue(undefined);
    }
    onChange?.(undefined);
    rangeDateRef.current = undefined;
  };

  const handlePresetClick = (pair: [string, string]) => {
    const nextRange = toDateRange(pair, format);
    if (nextRange?.from && nextRange?.to) {
      emitChange(pair);
      setTimeout(() => setOpenSafe(false), 0);
    }
  };

  return (
    <div className="relative inline-block w-fit">
      <Popover open={mergedOpen} onOpenChange={setOpenSafe}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-80 justify-start font-normal',
              !hasFullValue && 'text-muted-foreground',
              className
            )}
          >
            <span className="truncate">{displayText}</span>
            <ChevronDownIcon
              className={cn(
                'ml-auto h-4 w-4 opacity-50',
                hasFullValue && 'opacity-0'
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="overflow-hidden p-0"
          align="start"
          sideOffset={4}
        >
          {/* 预设快捷选择（可选） */}
          {Array.isArray(presets) && presets.length > 0 && (
            <div className="border-b p-2 flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="text-xs rounded border px-2 py-1 hover:bg-accent"
                  onClick={() => handlePresetClick(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
          <Calendar
            mode="range"
            selected={selectedRange}
            captionLayout="dropdown"
            onSelect={handleRangeSelect}
            className="rounded-md border-0 w-full"
            month={currentMonth}
            onMonthChange={(m) => setCurrentMonth(m)}
          />
        </PopoverContent>
      </Popover>
      {allowClear && hasFullValue && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
        >
          <XIcon className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

RangePicker.displayName = 'EnhancedRangePicker';

export { RangePicker as default };
