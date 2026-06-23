---
title: ui 最佳实践
package: "@teamhelper/ui"
doc_type: best-practices
keywords: [最佳实践, do, dont, 选层, Enhanced, tailwind, cn, Provider, 类型]
stability: stable
read_order: "70"
related: [components.md, errors.md]
---

# 最佳实践（Do / Don't）

## 选层

- ✅ 默认从基础层裸名组件（`Button`/`Input`/`Dialog*`）起步；需要 antd 式开箱即用再用 `Enhanced*` 或高级组件。
- ✅ 表格/选择/分页等优先 `EnhancedTable`/`EnhancedSelect`/`EnhancedPagination`，避免手拼结构件。
- ❌ 不要在同一处混用 `Button` 与 `EnhancedButton` 造成风格不一致。

## 样式

- ✅ Tailwind v4：`@source` 扫描本包 dist，`@theme` 注册语义色；与 `@teamhelper/ui-adapter` 复用同一套 token。
- ✅ 类名合并统一用 `twMerge(clsx(...))`。
- ❌ 不要找 `cn`（不存在）；不要尝试引入 `styles.css`（无产物）。

## Provider / 全局

- ✅ 应用根部放一次 `ConfigProvider`（locale）+ `Toaster`（通知容器）+ 需要时 `ThemeProvider`。
- ✅ 命令式 `message`/`toast`/`openModal*` 仅在客户端调用。

## 类型

- ✅ 组件 Props 以 `dist/index.d.ts` 为准；`Enhanced*` 与高级组件的 props 形状不要凭基础层猜。
- ✅ 全部从主入口 `'@teamhelper/ui'` 导入值与类型。

## 版本

- ✅ 这是已发布的 npm 包（语义化版本），升级前看变更；对外用法以导出契约为准。
