---
title: ui 常见错误
package: "@teamhelper/ui"
doc_type: errors
keywords: [错误, error, 排查, 无样式, cn, 同名组件, Button, EnhancedButton, message 不显示, locale]
stability: stable
read_order: "60"
related: [SKILL.md, integration.md, components.md]
---

# 常见错误与排查

格式：症状 → 根因 → 修复。

## E1. 组件「没有样式 / 布局错乱」

- 根因：宿主 Tailwind v4 没用 `@source` 扫描本包 dist，或没在 `@theme` 注册语义色。
- 修复：宿主全局 CSS 加 `@source "../node_modules/@teamhelper/ui/dist";`，并按 [integration 配方 1](./integration.md) 提供/映射语义色 token。本包面向 **Tailwind v4**，不要用 v3 的 `tailwind.config.js`。

## E2. `cn is not exported from '@teamhelper/ui'`

- 根因：本库**不导出 `cn`**。
- 修复：用 `clsx` / `twMerge`（`twMerge(clsx(...))`）或 `cx` / `cva`。

## E3. 用了 `Button` 但行为/样式不是预期的 antd 风格

- 根因：`Button`（基础 shadcn）与 `EnhancedButton`（antd 风封装）是两个组件，拿错了。
- 修复：要 antd 式（loading/block 等）用 `EnhancedButton`；要轻量原语用 `Button`。同理 `Select`/`Table`/`Tabs` 等见 [components.md](./components.md) 的同名表。

## E4. `message.success()` / `toast()` 调了不显示

- 根因：根部没有渲染通知容器 `Toaster`（或没经 `ConfigProvider`）。
- 修复：在应用根渲染一次 `<Toaster />`。

## E5. 语言不生效 / 组件文案是英文

- 根因：没用 `ConfigProvider` 注入 `locale`。
- 修复：`<ConfigProvider locale={zhCN}>` 包裹应用；动态读取用 `useLocale()`。

## E6. 找不到某组件 / 导入报 undefined

- 根因：① 名字拼错或层级搞混（基础 vs `Enhanced*`）；② 用了不存在的名字。
- 修复：对照 [api-reference.md](./api-reference.md) 第 8 节「完整导出索引」确认名字；区分三层命名。

## E7. 子路径导入失败

- 根因：子路径 `@teamhelper/ui/<x>` 的 `<x>` 与 dist 实际文件名不符。
- 修复：优先用主入口 `'@teamhelper/ui'`；确需子路径时按 dist 产物名。

## E8. SSR / 非浏览器环境报错

- 根因：命令式 API（`message`/`Modal`）或部分组件依赖 DOM。
- 修复：仅在客户端调用命令式 API；组件渲染遵循宿主的 CSR/SSR 约定。
