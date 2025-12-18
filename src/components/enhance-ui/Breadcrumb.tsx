import {
  BreadcrumbContainer,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { Dropdown as EnhancedDropdown } from './Dropdown';
import React from 'react';
import { cn } from '@/lib/utils';

export type Crumb = {
  key?: string | number;
  label: React.ReactNode;
  to?: string; // 推荐：SPA 跳转
  href?: string; // 备选：原生超链接
  onClick?: (crumb: Crumb) => void;
};

const Breadcrumb: React.FC<{
  items: Crumb[];
  separator?: React.ReactNode;
  className?: string;
  onClick?: (crumb: Crumb) => void;
  maxItems?: number;
  itemsBefore?: number;
  itemsAfter?: number;
  contentClassName?: string;
  lastItemClickable?: boolean;
}> = ({
  items,
  separator = '/',
  className,
  onClick,
  maxItems = Infinity,
  itemsBefore = 1,
  itemsAfter = 2,
  contentClassName,
  lastItemClickable = false,
}) => {
  const [startItems, collapsedItems, endItems] = React.useMemo(() => {
    if (items.length <= maxItems) {
      return [items, [], []];
    }
    return [
      items.slice(0, itemsBefore),
      items.slice(itemsBefore, items.length - itemsAfter),
      items.slice(items.length - itemsAfter),
    ];
  }, [items, maxItems, itemsBefore, itemsAfter]);

  const renderItemContent = (item: Crumb, isLast: boolean) => {
    const content = (
      <span
        className={cn(
          'truncate max-w-auto inline-block align-bottom',
          contentClassName
        )}
      >
        {item.label}
      </span>
    );

    const handleClick = (e: React.MouseEvent) => {
      if (!item.href && !item.to) {
        e.preventDefault();
        e.stopPropagation();
      }
      item.onClick?.(item);
      onClick?.(item);
    };

    if (isLast) {
      return (
        <BreadcrumbPage
          className={cn(lastItemClickable && 'cursor-pointer')}
          onClick={(e) => {
            if (!lastItemClickable) return;

            handleClick(e);
          }}
        >
          {content}
        </BreadcrumbPage>
      );
    }

    if (item.to) {
      return <BreadcrumbLink onClick={handleClick}>{content}</BreadcrumbLink>;
    }
    if (item.href) {
      return (
        <BreadcrumbLink href={item.href} onClick={handleClick}>
          {content}
        </BreadcrumbLink>
      );
    }
    return (
      <BreadcrumbLink className="cursor-pointer" onClick={handleClick}>
        {content}
      </BreadcrumbLink>
    );
  };

  return (
    <BreadcrumbContainer className={className}>
      <BreadcrumbList>
        {startItems.map((item, index) => {
          const isVeryLast =
            collapsedItems.length === 0 &&
            endItems.length === 0 &&
            index === startItems.length - 1;
          return (
            <BreadcrumbItem key={item.key || `start-${index}`}>
              {renderItemContent(item, isVeryLast)}
              {!isVeryLast && (
                <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
              )}
            </BreadcrumbItem>
          );
        })}

        {collapsedItems.length > 0 && (
          <BreadcrumbItem>
            <EnhancedDropdown
              menu={{
                items: collapsedItems.map((item, index) => ({
                  key: item.key || `collapsed-${index}`,
                  label: item.label,
                  onClick: () => {
                    item.onClick?.(item);
                    onClick?.(item);
                    if (item.href) window.location.href = item.href;
                  },
                })),
              }}
            >
              <div className="flex items-center gap-1 outline-none cursor-pointer">
                <BreadcrumbEllipsis className="h-4 w-4" />
              </div>
            </EnhancedDropdown>
            {endItems.length > 0 && (
              <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
            )}
          </BreadcrumbItem>
        )}

        {endItems.map((item, index) => {
          const isLast = index === endItems.length - 1;
          return (
            <BreadcrumbItem key={item.key || `end-${index}`}>
              {renderItemContent(item, isLast)}
              {!isLast && (
                <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbContainer>
  );
};

export default Breadcrumb;
export { Breadcrumb as EnhancedBreadcrumb };
