'use client';

import * as React from 'react';
import {
  Tabs as BaseTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../ui/tabs';
import { cn } from '../../lib/utils';

export interface TabItem {
  key: string;
  label: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  closable?: boolean;
  className?: string;
}

export interface EnhancedTabsProps {
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (activeKey: string) => void;
  items: TabItem[];
  type?: 'line' | 'card';
  size?: 'small' | 'middle' | 'large';
  tabPosition?: 'top' | 'bottom' | 'left' | 'right';
  animated?: boolean;
  className?: string;
  triggerClassName?: string;
  listClassName?: string;
  contentClassName?: string;
  onEdit?: (targetKey: string, action: 'add' | 'remove') => void;
  /** 是否使用下划线风格（如截图所示，仅顶部位置生效） */
  underline?: boolean;
  tabBarExtraContent?: {
    left?: React.ReactNode;
    right?: React.ReactNode;
  };
}

const Tabs = React.forwardRef<
  React.ComponentRef<typeof BaseTabs>,
  EnhancedTabsProps
>(
  (
    {
      activeKey,
      defaultActiveKey,
      onChange,
      items,
      type = 'line',
      size = 'middle',
      tabPosition = 'top',
      animated = true,
      className,
      onEdit,
      underline = false,
      tabBarExtraContent,
      triggerClassName,
      listClassName,
      contentClassName,
      ...props
    },
    ref
  ) => {
    const [internalActiveKey, setInternalActiveKey] = React.useState(
      activeKey || defaultActiveKey || items[0]?.key || ''
    );

    const currentActiveKey = activeKey || internalActiveKey;

    const handleValueChange = (value: string) => {
      if (!activeKey) {
        setInternalActiveKey(value);
      }
      onChange?.(value);
    };

    const handleRemoveTab = (targetKey: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onEdit?.(targetKey, 'remove');
    };

    const tabsListClassName = cn(
      // card 风格
      type === 'card' && 'bg-background border rounded-lg p-1',
      // 下划线风格（覆盖基础 bg/padding）
      underline &&
        type !== 'card' &&
        tabPosition === 'top' &&
        'bg-transparent rounded-none p-0 border-b border-border',
      // 尺寸
      size === 'small' && 'h-8',
      size === 'large' && 'h-12',
      // 位置
      tabPosition === 'left' && 'flex-col h-auto w-auto',
      tabPosition === 'right' && 'flex-col h-auto w-auto',
      // Grid layout for extra content to ensure centering
      (tabBarExtraContent?.left || tabBarExtraContent?.right) &&
        (tabPosition === 'top' || tabPosition === 'bottom') &&
        'grid grid-cols-[1fr_auto_1fr] items-center gap-4',
      listClassName
    );

    const tabsTriggerClassName = cn(
      // 尺寸
      size === 'small' && 'px-2 py-1 text-xs h-6',
      size === 'large' && 'px-4 py-3 text-base h-10',
      // card 风格
      type === 'card' &&
        'border-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
      // 下划线风格：激活时文字蓝色，底部细线
      underline &&
        type !== 'card' &&
        tabPosition === 'top' &&
        'rounded-none bg-transparent shadow-none text-muted-foreground border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary',
      // 位置
      tabPosition === 'left' && 'justify-start w-full',
      tabPosition === 'right' && 'justify-start w-full',
      triggerClassName
    );

    const renderTabsTriggers = () =>
      items.map((item) => (
        <TabsTrigger
          key={item.key}
          value={item.key}
          disabled={item.disabled}
          className={cn(
            tabsTriggerClassName,
            'relative group px-5 cursor-pointer',
            'hover:text-primary'
          )}
        >
          <span className="flex items-center">
            {item.label}
            {item.closable && onEdit && (
              <button
                className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-primary-foreground rounded-sm w-4 h-4 flex items-center justify-center text-xs transition-opacity"
                onClick={(e) => handleRemoveTab(item.key, e)}
                type="button"
              >
                ×
              </button>
            )}
          </span>
        </TabsTrigger>
      ));

    return (
      <BaseTabs
        ref={ref}
        value={currentActiveKey}
        onValueChange={handleValueChange}
        orientation={
          tabPosition === 'left' || tabPosition === 'right'
            ? 'vertical'
            : 'horizontal'
        }
        className={cn(
          tabPosition === 'left' && 'flex-row',
          tabPosition === 'right' && 'flex-row-reverse',
          className
        )}
        {...props}
      >
        <TabsList className={tabsListClassName}>
          {(tabBarExtraContent?.left || tabBarExtraContent?.right) &&
          (tabPosition === 'top' || tabPosition === 'bottom') ? (
            <>
              <div className="flex items-center justify-start min-w-0 pl-4">
                {tabBarExtraContent?.left}
              </div>
              <div className="flex items-center justify-center h-full">
                {renderTabsTriggers()}
              </div>
              <div className="flex items-center justify-end min-w-0 pr-4">
                {tabBarExtraContent?.right}
              </div>
            </>
          ) : (
            <>
              {tabBarExtraContent?.left}
              {renderTabsTriggers()}
              {tabBarExtraContent?.right}
            </>
          )}
        </TabsList>

        {items.map((item) => (
          <TabsContent
            key={item.key}
            value={item.key}
            className={cn(
              item.children ? 'mt-4' : '',
              !animated && 'data-[state=inactive]:hidden',
              tabPosition === 'left' && 'ml-4 mt-0',
              tabPosition === 'right' && 'mr-4 mt-0',
              item?.className,
              contentClassName
            )}
          >
            {item.children}
          </TabsContent>
        ))}
      </BaseTabs>
    );
  }
);

Tabs.displayName = 'EnhancedTabs';

export { Tabs as EnhancedTabs };
