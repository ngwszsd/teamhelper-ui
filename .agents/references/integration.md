---
title: ui 常见接入方式
package: "@teamhelper/ui"
doc_type: integration
keywords: [接入, tailwind v4, source, theme, ConfigProvider, locale, ThemeProvider, Toaster, message, 子路径]
stability: stable
read_order: "40"
related: [SKILL.md, api-reference.md, examples.md]
---

# 常见接入方式（任务导向配方）

## 配方 1：让样式生效（Tailwind v4）

```css
/* 宿主全局 CSS（如 src/global.css） */
@import 'tailwindcss';
@source "../node_modules/@teamhelper/ui/dist";   /* v4 默认不扫 node_modules，必须显式 */
```

token（`--background`/`--card`/`--primary`/`--border` 等语义色）：参照包内 `src/styles/globals.css` 在宿主 `:root` / `.dark` 定义，并在 `@theme inline` 里映射（`--color-card: var(--card)` 等），使 `bg-card` 类生成。本库与 `@teamhelper/ui-adapter` 共用同一套语义色命名，可复用同一份定义。

> 漏 `@source` → 组件无样式；漏 `@theme` 注册语义色 → `bg-card` 这类类不存在。

## 配方 2：全局配置 + 国际化

```tsx
import { ConfigProvider, zhCN } from '@teamhelper/ui';

createRoot(el).render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>,
);
// 读取当前 locale：const { locale } = useLocale();
```

## 配方 3：通知 / 命令式提示

```tsx
import { Toaster, toast, message } from '@teamhelper/ui';

// 1) 在根部渲染一次容器
<Toaster />

// 2) 任意处调用
toast('已保存');
message.success('操作成功');
message.error('出错了');
```

## 配方 4：主题切换

```tsx
import { ThemeProvider, ThemeToggle, useTheme } from '@teamhelper/ui';

<ThemeProvider>
  <ThemeToggle />          {/* 现成切换按钮 */}
  <App />
</ThemeProvider>;
// 或自定义：const { theme, setTheme } = useTheme();
```

## 配方 5：表格（开箱即用）

优先用增强层，避免手拼 `Table*` 结构件：

```tsx
import { EnhancedTable } from '@teamhelper/ui';
// 列定义、分页等通过 props 传入；具体 props 形状以 dist/index.d.ts 的 EnhancedTableProps 为准
<EnhancedTable /* columns / dataSource / pagination ... */ />
```

## 配方 6：命令式弹窗

```tsx
import { Modal, openModalError, openModalWarning, openTipsModal } from '@teamhelper/ui';

openModalError({ /* title/content... */ });
openModalWarning({ /* ... */ });
// 受控/组合式弹窗用 Dialog*（见 examples.md）
```

## 配方 7：表单

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, Input } from '@teamhelper/ui';
// 配合 react-hook-form 模式；useFormField 取字段状态
```

## 配方 8：按需子路径导入（可选）

```ts
// 优先主入口
import { Button } from '@teamhelper/ui';
// 需要更细 tree-shaking 时（路径以 dist 实际产物为准）
import { Button } from '@teamhelper/ui/button';
```

## 工具：类名合并（注意没有 cn）

```ts
import { clsx, twMerge } from '@teamhelper/ui';
const cls = twMerge(clsx('px-2 py-1', active && 'bg-primary text-primary-foreground'));
```
