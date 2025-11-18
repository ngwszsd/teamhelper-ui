import * as React from "react";
import {
  Pagination as BasePagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "../ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import type { ButtonProps } from "../ui/button";
import { useTranslation } from "react-i18next";
export interface EnhancedPaginationProps {
  /** 当前页码（从 1 开始） */
  current: number;
  /** 每页显示条数 */
  pageSize: number;
  /** 总数据条数 */
  total: number;
  /** 页码改变回调函数 `(page, pageSize)` */
  onChange?: (page: number, pageSize: number) => void;
  /** 每页条数改变回调函数 `(current, size)` */
  onShowSizeChange?: (current: number, size: number) => void;

  /** 是否展示每页条数选择器，默认 true */
  showSizeChanger?: boolean;
  /** 每页条数可选集合，默认 `[10, 20, 50, 100]` */
  pageSizeOptions?: number[];
  /** 是否展示快速跳转输入框（简洁模式下自动开启） */
  showQuickJumper?: boolean;
  /** 自定义总数显示文案 `(total, [from, to]) => ReactNode` */
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;

  /** 控制分页按钮尺寸，复用基础 Button 的 size */
  size?: ButtonProps["size"];
  /** 容器 className（传递到基础 Pagination 容器） */
  className?: string;
  /** 禁用交互 */
  disabled?: boolean;
  /** 额外渲染在右侧的区域 */
  extra?: React.ReactNode;
}

const Pagination: React.FC<EnhancedPaginationProps> = ({
  current,
  pageSize,
  total,
  onChange,
  onShowSizeChange,
  showSizeChanger = false,
  pageSizeOptions = [10, 20, 50, 100],
  showQuickJumper = false,
  showTotal,
  size = "default",
  className,
  disabled,
  extra,
}) => {
  const { t } = useTranslation("components");
  const totalPages = React.useMemo(
    () => Math.max(1, Math.ceil((total ?? 0) / Math.max(1, pageSize ?? 1))),
    [total, pageSize],
  );

  const safeCurrent = React.useMemo(
    () => clamp(current ?? 1, 1, totalPages),
    [current, totalPages],
  );

  const [quickValue, setQuickValue] = React.useState<string>(
    String(safeCurrent),
  );
  React.useEffect(() => {
    setQuickValue(String(safeCurrent));
  }, [safeCurrent]);

  const rangeStart = total === 0 ? 0 : (safeCurrent - 1) * pageSize + 1;
  const rangeEnd = total === 0 ? 0 : Math.min(total, safeCurrent * pageSize);

  const isDisabled = !!disabled || totalPages <= 0;

  const handlePageChange = (nextPage: number) => {
    if (isDisabled) return;
    const page = clamp(nextPage, 1, totalPages);
    if (page !== safeCurrent) {
      onChange?.(page, pageSize);
    }
  };

  const handleSizeChange = (val: string) => {
    if (isDisabled) return;
    const sizeNum = Number(val);
    if (!Number.isFinite(sizeNum) || sizeNum <= 0) return;
    onShowSizeChange?.(safeCurrent, sizeNum);
    // Common UX: reset to page 1 on size change
    onChange?.(1, sizeNum);
  };

  const handleQuickJump = (val?: string) => {
    const v = (val ?? quickValue).trim();
    const next = clamp(Number(v), 1, totalPages);
    if (Number.isFinite(next)) {
      setQuickValue(String(next));
      handlePageChange(next);
    }
  };

  const pages = React.useMemo(
    () => buildRange(safeCurrent, totalPages),
    [safeCurrent, totalPages],
  );

  const renderTotal = () => {
    if (showTotal) return showTotal(total, [rangeStart, rangeEnd]);
    const pageCount = total > 0 ? rangeEnd - rangeStart + 1 : 0;
    return (
      <div className="text-sm text-muted-foreground">
        显示第
        <span className="font-medium mx-1">{safeCurrent}</span>页
        <span className="font-medium mx-1">{pageCount}</span>
        条结果, 共<span className="font-medium mx-1">{total}</span>条
      </div>
    );
  };

  const renderSizeChanger = () => {
    if (!showSizeChanger) return null;
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {t("pagination.pageSizeLabel")}
        </span>
        <Select value={String(pageSize)} onValueChange={handleSizeChange}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder={t("select")} />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((opt) => (
              <SelectItem key={opt} value={String(opt)}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const renderQuickJumper = () => {
    const shouldShow = showQuickJumper;
    if (!shouldShow) return null;
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {t("pagination.jumpToLabel")}
        </span>
        <div className="w-[80px]">
          <Input
            value={quickValue}
            inputMode="numeric"
            onChange={(e) => setQuickValue(e.target.value)}
            onBlur={() => handleQuickJump()}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleQuickJump();
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-3",
        className,
      )}
    >
      <div className="flex items-center gap-3">{renderTotal()}</div>

      <BasePagination className="flex-1 justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              size={size}
              aria-disabled={isDisabled || safeCurrent <= 1}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(safeCurrent - 1);
              }}
              previousText=""
            />
          </PaginationItem>

          {pages.map((p, idx) => (
            <PaginationItem key={`${p}-${idx}`}>
              {p === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  size={size}
                  isActive={p === safeCurrent}
                  aria-current={p === safeCurrent ? "page" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(Number(p));
                  }}
                >
                  {String(p)}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              size={size}
              aria-disabled={isDisabled || safeCurrent >= totalPages}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(safeCurrent + 1);
              }}
              nextText=""
            />
          </PaginationItem>
        </PaginationContent>
      </BasePagination>

      <div className="flex items-center gap-3">
        {renderQuickJumper()}
        {renderSizeChanger()}
        {extra}
      </div>
    </div>
  );
};

export { Pagination as EnhancedPagination };

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function buildRange(
  current: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (current >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis",
    current - 1,
    current,
    current + 1,
    "ellipsis",
    totalPages,
  ];
}
