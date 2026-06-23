---
title: ui 组件清单
package: "@teamhelper/ui"
doc_type: components
keywords: [组件, components, 基础, 增强, Enhanced, Table, Tree, Upload, Select, DatePicker, Modal, message, 选型]
stability: stable
read_order: "30"
related: [api-reference.md, examples.md]
---

# 组件清单与选型

按「我要做什么 → 用哪个」组织。同名歧义时给出明确建议。导出名以 [api-reference.md](./api-reference.md) 为准。

## 选型速查（高频）

| 我要… | 首选 | 备选 / 说明 |
|---|---|---|
| 按钮 | `Button`（基础，`variant`/`size`） | `EnhancedButton`（antd 风，带 loading 等） |
| 文本输入 | `Input`（基础） | `EnhancedInput`（带清除/前后缀等） |
| 数字输入 | `InputNumber` | — |
| 多行输入 | `Textarea` / `EnhancedTextarea` | — |
| 下拉选择 | `EnhancedSelect`（开箱即用） | `Select*` 系列（基础结构件，手动组合） |
| 复选/单选 | `Checkbox` / `RadioGroup`+`RadioGroupItem` | `EnhancedCheckbox(Group)` / `EnhancedRadio(Group)` |
| 开关 | `Switch` | — |
| 表格 | `EnhancedTable`（列配置、分页等） | `Table*` 系列（手拼结构） |
| 树 | `Tree` / `TreeSelect` / `DirectoryTree` | — |
| 分页 | `EnhancedPagination` | `Pagination*` 系列（结构件） |
| 标签页 | `EnhancedTabs` | `Tabs`+`TabsList/Trigger/Content` |
| 日期 | `DatePicker` / `RangePicker` / `Calendar` | `DatePickerBase` |
| 上传 | `Upload` / `UploadDragger` | — |
| 弹窗（命令式） | `Modal` / `openModalError` / `openModalWarning` / `openTipsModal` | — |
| 弹窗（组合式） | `Dialog*` | `AlertDialog*`（确认类） |
| 抽屉 | `Drawer*` / `Sheet*` | — |
| 气泡卡片 | `Popover*` / `EnhancedPopover` | — |
| 提示气泡 | `Tooltip*` / `EnhancedTooltip` | — |
| 全局消息 | `message.success/error/warning/info(...)` | `toast` + `Toaster`（sonner 风） |
| 下拉菜单 | `DropdownMenu*` / `Dropdown` / `DropdownButton` | `ContextMenu*`（右键）、`Menubar*` |
| 步骤条 | `Steps`（`StepItem`） | — |
| 时间线 | `Timeline` | — |
| 列表 | `List`（`ListItem`） | — |
| 分段控件 | `SegmentedControl` | — |
| 滑块 | `Slider` / `EnhancedSlider` | — |
| 加载 | `Spinner` / `EnhancedSpinner` / `Skeleton` / `DivSkeleton` | `Progress` |
| 空状态 | `Empty` | — |
| 头像/徽标 | `Avatar` / `Badge` | `EnhancedAvatar` / `EnhancedBadge` |
| 面包屑 | `BreadcrumbContainer`+子件 | `EnhancedBreadcrumb` |
| 卡片 | `Card`+子件 | `EnhancedCard` |
| 搜索框 | `SearchInput` | — |
| 可调分栏 | `ResizablePanelGroup`+`ResizablePanel`+`ResizableHandle` | — |
| 导航菜单 | `NavigationMenu*` | — |
| 比例容器 | `AspectRatio` | — |
| 分隔线 | `Separator` | — |
| 表单 | `Form`+`FormField/FormItem/FormLabel/FormControl/FormMessage` + `useFormField` | — |

## 三层并存的同名组件（重点）

某些能力在多层都有版本，**不要混用**：

| 能力 | 基础层（结构件） | 增强层 | 高级层（裸名） |
|---|---|---|---|
| 表格 | `Table` + `TableHeader/Body/Row/Cell/...` | `EnhancedTable` ✅ | — |
| 选择 | `Select` + `SelectTrigger/Content/Item/...` | `EnhancedSelect` ✅ | — |
| 标签页 | `Tabs`+`TabsList/...` | `EnhancedTabs` ✅ | — |
| 气泡卡 | `Popover`+`PopoverTrigger/Content` | `EnhancedPopover` | — |
| 提示 | `Tooltip`+`TooltipTrigger/Content` | `EnhancedTooltip` | — |
| 分页 | `Pagination`+子件 | `EnhancedPagination` ✅ | — |
| 滑块 | `Slider` | `EnhancedSlider` | — |
| 头像/徽标/卡片/面包屑 | `Avatar`/`Badge`/`Card`/`Breadcrumb*` | `Enhanced*` 同名 | — |
| 弹窗 | `Dialog*` / `AlertDialog*` | — | `Modal` + `openModal*`（命令式）✅ |

判断原则：**要"少写、开箱即用"→ 增强层（`Enhanced*`）或高级层；要"细粒度自定义"→ 基础层结构件**。

## Provider / 主题 / 国际化

- `ConfigProvider`（`useLocale`）：注入语言等全局配置，传 `zhCN` / `enUS`。
- `ThemeProvider`（`useTheme`）、`ThemeToggle`：主题。
- `Toaster`：通知容器，配合 `toast` / `message` 使用。
- `ErrorBoundary`：错误边界。

## 工具

`clsx` / `cx` / `twMerge` / `cva` / `VariantProps` / `ClassValue` —— **没有 `cn`**。
