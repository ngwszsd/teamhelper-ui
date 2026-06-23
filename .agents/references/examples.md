---
title: ui React 示例
package: "@teamhelper/ui"
doc_type: examples
keywords: [react, 示例, example, Button, Dialog, EnhancedTable, message, Form, Select]
stability: stable
read_order: "50"
related: [components.md, integration.md]
---

# React 端到端示例

前提：已按 [integration 配方 1](./integration.md) 配好 Tailwind v4 `@source`。

## 示例 1：按钮 + 输入 + 全局消息

```tsx
import { Button, Input, message, Toaster } from '@teamhelper/ui';
import { useState } from 'react';

export function SaveForm() {
  const [name, setName] = useState('');
  return (
    <>
      <Toaster />                                {/* 根部渲染一次 */}
      <div className="flex items-center gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="名称" />
        <Button onClick={() => message.success(`已保存：${name}`)}>保存</Button>
      </div>
    </>
  );
}
```

## 示例 2：组合式弹窗 Dialog

```tsx
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, Button,
} from '@teamhelper/ui';

export function ConfirmDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">打开</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认操作</DialogTitle>
          <DialogDescription>该操作不可撤销。</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>确定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## 示例 3：命令式弹窗

```tsx
import { Button, openModalWarning } from '@teamhelper/ui';

export function DangerButton() {
  return (
    <Button
      variant="destructive"
      onClick={() => openModalWarning({ /* title / content / onOk ... 形状以 d.ts 为准 */ })}
    >
      删除
    </Button>
  );
}
```

## 示例 4：增强表格

```tsx
import { EnhancedTable } from '@teamhelper/ui';

export function UserTable({ rows }: { rows: User[] }) {
  // columns / dataSource / pagination 等 props 以 EnhancedTableProps（dist/index.d.ts）为准
  return <EnhancedTable /* columns={...} dataSource={rows} */ />;
}
```

## 示例 5：下拉选择（增强 vs 基础）

```tsx
// 开箱即用
import { EnhancedSelect } from '@teamhelper/ui';
<EnhancedSelect /* options={[{label,value}]} value onChange */ />

// 细粒度组合（基础结构件）
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@teamhelper/ui';
<Select>
  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="a">A</SelectItem>
    <SelectItem value="b">B</SelectItem>
  </SelectContent>
</Select>
```

## 示例 6：Provider + 国际化 + 主题

```tsx
import { ConfigProvider, ThemeProvider, zhCN } from '@teamhelper/ui';

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider locale={zhCN}>
      <ThemeProvider>{children}</ThemeProvider>
    </ConfigProvider>
  );
}
```

## 注意

- `message` / `toast` 需要根部有 `Toaster`（或经 `ConfigProvider`）才显示。
- 具体 Props 形状（尤其 `Enhanced*` 与高级组件）以 `dist/index.d.ts` 为准，示例中注释处按实际类型补全。
