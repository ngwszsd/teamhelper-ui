import * as React from "react";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { cn } from "../../lib/utils";
import { RangePicker } from "./RangePicker";
import { Button } from "./Button";

export interface DatePickerProps {
  /**
   * 当前选中的日期值，格式为 YYYY-MM-DD
   */
  value?: string;
  /**
   * 日期变化时的回调函数
   * @param value 选中的日期，格式为 YYYY-MM-DD，清除时为 undefined
   */
  onChange?: (value: string | undefined) => void;
  /**
   * 占位符文本
   */
  placeholder?: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否显示清除按钮
   */
  allowClear?: boolean;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 非受控模式的初始值，格式为 YYYY-MM-DD
   */
  defaultValue?: string;
}

/**
 * 将 YYYY-MM-DD 格式的字符串转换为 Date 对象
 */
const parseDate = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;
  const date = new Date(dateString + "T00:00:00");
  return isNaN(date.getTime()) ? undefined : date;
};

/**
 * 将 Date 对象转换为 YYYY-MM-DD 格式的字符串
 */
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * 增强型日期选择器组件
 *
 * 基于 shadcn/ui 的 Calendar 组件，提供类似 Ant Design DatePicker 的 API
 *
 * @example
 * ```tsx
 * const [date, setDate] = useState<string>()
 *
 * <DatePicker
 *   value={date}
 *   onChange={setDate}
 *   placeholder="请选择日期"
 *   allowClear
 * />
 * ```
 */
type DatePickerComponent = React.FC<DatePickerProps> & {
  RangePicker: typeof RangePicker;
};

export const DatePicker: DatePickerComponent = ({
  value,
  onChange,
  placeholder = "请选择日期",
  disabled = false,
  allowClear = true,
  className,
  defaultValue,
}) => {
  const [open, setOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(() => {
    const start = defaultValue || "";
    const d = parseDate(start) ?? new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // 受控 / 非受控模式判定
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    defaultValue,
  );
  const currentValue = isControlled ? value : internalValue;

  // 将字符串值转换为 Date 对象
  const selectedDate = React.useMemo(() => {
    return currentValue ? parseDate(currentValue) : undefined;
  }, [currentValue]);

  // 处理日期选择 - 延迟关闭弹窗以减少卡顿
  const handleDateSelect = React.useCallback(
    (date: Date | undefined) => {
      if (date) {
        const formattedDate = formatDate(date);
        if (!isControlled) {
          setInternalValue(formattedDate);
        }
        onChange?.(formattedDate);
      } else {
        if (!isControlled) {
          setInternalValue(undefined);
        }
        onChange?.(undefined);
      }
      // 延迟关闭弹窗，让视觉反馈更流畅
      setTimeout(() => setOpen(false), 0);
    },
    [isControlled, onChange],
  );

  // 处理清除
  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isControlled) {
        setInternalValue(undefined);
      }
      onChange?.(undefined);
    },
    [isControlled, onChange],
  );

  // 显示的文本
  const displayText = React.useMemo(() => {
    return selectedDate
      ? selectedDate
          .toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\//g, "-")
      : placeholder;
  }, [selectedDate, placeholder]);

  return (
    <div className="relative inline-block w-fit">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            className={cn(
              "w-48 justify-start font-normal",
              !selectedDate && "text-muted-foreground",
              className,
            )}
          >
            <span className="truncate">{displayText}</span>
            <ChevronDownIcon
              className={cn(
                "ml-auto h-4 w-4 opacity-50",
                selectedDate && "opacity-0",
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[250px] overflow-hidden p-0"
          align="start"
          sideOffset={4}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={handleDateSelect}
            disabled={disabled}
            className="rounded-md border-0 w-full"
            month={currentMonth}
            onMonthChange={(m) => setCurrentMonth(m)}
          />
        </PopoverContent>
      </Popover>
      {allowClear && selectedDate && !disabled && (
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

DatePicker.displayName = "EnhancedDatePicker";

DatePicker.RangePicker = RangePicker;

export { DatePicker as default };
