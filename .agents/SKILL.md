---
name: ui-integration
description: 在外部 React 项目中接入 @teamhelper/ui（TeamHelper 组件库，基于 React + Radix + Tailwind v4，含 shadcn 基础组件与 antd 风格增强组件）。当需要安装、配置 Tailwind v4 样式、使用按钮/输入/弹窗/表格/树/上传等组件、调用命令式 message/Modal、或排查"接入后无样式 / 同名组件分不清"等问题时使用本技能。
---

# 接入 @teamhelper/ui

> `@teamhelper/ui` 是 TeamHelper 的 React 组件库（已发布 npm，当前 v1.0.31）。由两类组件构成：**基础层**（shadcn/Radix 原语，如 `Button` `Dialog`）与 **增强层**（antd 风格封装 + 命令式 API，如 `EnhancedTable` `message` `Modal`）。基于 Tailwind v4，**不打包 CSS**，宿主需用 `@source` 扫描产物。

## 何时使用此技能

- 在 React 项目里 `npm install @teamhelper/ui` 后使用其组件。
- 需要表格 / 树 / 上传 / 日期选择 / 分页等较完整的业务组件，或命令式 `message.success()` / `Modal` / `toast`。
- 排查「组件没样式」「同名 Button/Input 该用哪个」「locale/主题不生效」。

## 🔴 必须遵守的规则

1. **唯一入口**：所有组件从 `'@teamhelper/ui'` 导入（barrel）。也支持子路径 `'@teamhelper/ui/<模块>'`，但**优先用主入口**。
2. **Tailwind v4 是硬前提**：本包**不打包 CSS**（注释明确「CSS 由前端项目统一导入」）。宿主须用 Tailwind v4 的 `@source` 扫描本包 dist，否则组件「没有样式」。见步骤 2。
3. **认清三层同名组件**（见下「核心概念」）：`Button`（基础）≠ `EnhancedButton`（增强）。选错不报错但行为/样式不同——这是本库**头号易错点**。
4. **没有 `cn`**：本库**不导出** `cn`。类名合并用导出的 `clsx` / `twMerge` / `cx` / `cva`。
5. **命令式 API 需挂载容器**：`message` / `toast` 依赖 `Toaster` 等容器已渲染（通常由 `ConfigProvider` 或宿主根部提供）。
6. **API 真相源**：组件名/Props 以 [references/api-reference.md](./references/api-reference.md) 与 [references/components.md](./references/components.md) 为准。

## 接入流程

### 步骤 1：安装

```bash
pnpm add @teamhelper/ui
# peerDependencies: react >=16.9（实际项目用 React 19）
```

### 步骤 2：配置 Tailwind v4（最易漏，漏了就无样式）

本包面向 **Tailwind v4**（CSS-first，无 `tailwind.config.js`）。在宿主全局 CSS 入口（如 `src/global.css`）：

```css
@import 'tailwindcss';

/* 扫描本包产物，让其中用到的 utility class 被生成。v4 默认不扫 node_modules，必须显式声明 */
@source "../node_modules/@teamhelper/ui/dist";
```

本包的设计 token（颜色/圆角等 CSS 变量）见包内 `src/styles/globals.css`，宿主可参照它在自己的 `:root` / `@theme` 里提供同名变量（与 ui-adapter 共用同一套语义色：`--background` `--card` `--primary` `--border` 等）。

### 步骤 3：用组件

```tsx
import { Button, Input, message, Modal } from '@teamhelper/ui';

function Demo() {
  return (
    <div className="flex gap-2">
      <Input placeholder="输入" />
      <Button onClick={() => message.success('已保存')}>保存</Button>
      <Button
        variant="outline"
        onClick={() => Modal /* 命令式弹窗，见 components.md */ }
      >
        更多
      </Button>
    </div>
  );
}
```

### 步骤 4（可选）：Provider 与国际化

```tsx
import { ConfigProvider, zhCN } from '@teamhelper/ui';

<ConfigProvider locale={zhCN}>
  <App />
</ConfigProvider>;
// 主题：ThemeProvider / useTheme / ThemeToggle；通知容器：Toaster
```

## 核心概念：三层组件命名（务必分清）

| 层 | 命名规律 | 形态 | 例 | 何时用 |
|---|---|---|---|---|
| **基础层** | 裸名 | shadcn/Radix 原语，组合式、低样式 | `Button` `Input` `Checkbox` `Dialog*` `Popover*` `Select*` `Tooltip*` | 要细粒度组合、自定义样式 |
| **增强层** | `Enhanced*` 前缀 | antd 风格封装，开箱即用 | `EnhancedButton` `EnhancedInput` `EnhancedTable` `EnhancedSelect` `EnhancedTabs` | 要少配置、带默认交互 |
| **高级/命令式层** | 裸名（业务组件）或函数 | 完整业务组件 / 命令式 API | `Modal` `InputNumber` `DatePicker` `Tree` `Upload` `List` `Steps` `Timeline`；`message` `toast` `openModalError` | 复杂业务控件、命令式提示 |

要点：
- `Button` 与 `EnhancedButton` **是两个不同组件**，Props 不同。默认从 `Button` 开始，需要 antd 式封装再用 `EnhancedButton`。
- 表格优先 `EnhancedTable`（基础层 `Table*` 是结构件，需手拼）。
- 弹窗：命令式用 `Modal` / `openModalError` / `openModalWarning`；组合式用 `Dialog*`。

## 🚫 禁止编造（高频幻觉点）

- ❌ 不要用 `cn(...)`——本库不导出 `cn`，用 `clsx` / `twMerge`。
- ❌ 不要假设 `import '@teamhelper/ui/styles.css'`——本包不产出 CSS 文件，样式靠宿主 Tailwind v4 `@source` 扫描。
- ❌ 不要混淆 `Button` / `EnhancedButton`、`Select`(enhance) / `EnhancedSelect` / `Select*`(基础结构件)——它们并存且不同。
- ❌ 不要假设组件名不存在就编一个；可用组件清单固定见 [components.md](./references/components.md)，全量导出见 [api-reference.md](./references/api-reference.md) 附录。

## 参考资料（references/）

| 文件 | 内容 |
|---|---|
| [api-reference.md](./references/api-reference.md) | 全部 237 个导出按层/类分组 —— **唯一真相源** |
| [components.md](./references/components.md) | 组件清单（基础 / 增强 / 高级）与各自用途 |
| [integration.md](./references/integration.md) | Tailwind v4、Provider、国际化、命令式 API 接入配方 |
| [examples.md](./references/examples.md) | React 端到端示例 |
| [errors.md](./references/errors.md) | 无样式、同名组件、cn 不存在等排查 |
| [best-practices.md](./references/best-practices.md) | Do / Don't |

机器索引见 [llms.txt](./llms.txt)。
