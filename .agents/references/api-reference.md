---
title: ui API 参考
package: "@teamhelper/ui"
doc_type: api
keywords: [api, 导出, exports, Button, EnhancedButton, Input, Select, Table, Modal, message, toast, ConfigProvider, ThemeProvider, 三层组件, 导出索引]
stability: stable
read_order: "20"
related: [components.md, integration.md]
---

# API 参考（唯一真相源）

`@teamhelper/ui` 全部对外导出从主入口 `'@teamhelper/ui'` 取（barrel）。本文按「三层」分组。判断某符号是否存在、名字是否拼对，以本文为准。

```ts
import { Button, EnhancedTable, message, ConfigProvider } from '@teamhelper/ui';
```

> 命名分层见 [SKILL 核心概念](../SKILL.md)：基础层（裸名 shadcn）/ 增强层（`Enhanced*`）/ 高级·命令式层。三者并存，名字相近但不同。

## 1. 基础层（shadcn / Radix 原语）

组合式、低样式，多为「容器 + 子件」结构。

| 组件族 | 导出 |
|---|---|
| Button | `Button`、`buttonVariants`、`ButtonGroup`、`ButtonGroupText` |
| Input/Label | `Input`、`Label` |
| Checkbox/Radio/Switch | `Checkbox`、`RadioGroup`、`RadioGroupItem`、`Switch` |
| Select（结构件） | `Select`、`SelectContent`、`SelectGroup`、`SelectItem`、`SelectLabel`、`SelectSeparator`、`SelectTrigger`、`SelectValue`、`SelectScrollUpButton`、`SelectScrollDownButton` |
| Dialog | `Dialog`、`DialogTrigger`、`DialogContent`、`DialogHeader`、`DialogFooter`、`DialogTitle`、`DialogDescription`、`DialogClose`、`DialogOverlay`、`DialogPortal` |
| AlertDialog | `AlertDialog` + `AlertDialogAction/Cancel/Content/Description/Footer/Header/Overlay/Portal/Title/Trigger` |
| Drawer | `Drawer` + `DrawerClose/Content/Description/Footer/Header/Overlay/Portal/Title/Trigger` |
| Sheet | `Sheet` + `SheetClose/Content/Description/Footer/Header/Overlay/Portal/Title/Trigger` |
| Popover | `Popover`、`PopoverTrigger`、`PopoverContent`、`PopoverAnchor` |
| Tooltip | `Tooltip`、`TooltipTrigger`、`TooltipContent`、`TooltipProvider`、`TooltipArrow` |
| DropdownMenu | `DropdownMenu` + `DropdownMenuContent/Item/Group/Label/Separator/Shortcut/Portal/Trigger/CheckboxItem/RadioGroup/RadioItem/Sub/SubContent/SubTrigger`、`DropdownButton` |
| ContextMenu | `ContextMenu` + `ContextMenuContent/Item/Group/Label/Separator/Shortcut/CheckboxItem/RadioGroup/RadioItem/Sub/SubContent/SubTrigger/Trigger` |
| Menubar | `Menubar` + `MenubarMenu/Content/Item/Group/Label/Separator/Shortcut/Portal/CheckboxItem/RadioGroup/RadioItem/Sub/SubContent/SubTrigger/Trigger` |
| NavigationMenu | `NavigationMenu` + `NavigationMenuList/Item/Content/Trigger/Link/Indicator/Viewport`、`navigationMenuTriggerStyle` |
| Breadcrumb | `BreadcrumbContainer`、`BreadcrumbList`、`BreadcrumbItem`、`BreadcrumbLink`、`BreadcrumbPage`、`BreadcrumbSeparator` |
| Pagination | `Pagination`、`PaginationContent`、`PaginationItem`、`PaginationLink`、`PaginationNext`、`PaginationPrevious`、`PaginationEllipsis` |
| Tabs | `Tabs`、`TabsList`、`TabsTrigger`、`TabsContent` |
| Table（结构件） | `Table`、`TableHeader`、`TableBody`、`TableFooter`、`TableHead`、`TableRow`、`TableCell`、`TableCaption` |
| Card | `Card`、`CardHeader`、`CardFooter`、`CardTitle`、`CardDescription`、`CardContent` |
| Alert | `Alert`、`AlertTitle`、`AlertDescription` |
| Form | `Form`、`FormItem`、`FormLabel`、`FormControl`、`FormDescription`、`FormMessage`、`FormField`、`useFormField` |
| Resizable | `ResizablePanel`、`ResizablePanelGroup`、`ResizableHandle` |
| 其它原语 | `Avatar`、`Badge`、`badgeVariants`、`AspectRatio`、`Calendar`、`CalendarDayButton`、`DatePickerBase`、`Progress`、`Separator`、`Skeleton` |

## 2. 增强层（`Enhanced*`，antd 风格封装）

开箱即用、带默认交互与样式。

`EnhancedAlert`、`EnhancedAvatar`、`EnhancedBadge`、`EnhancedBreadcrumb`、`EnhancedButton`、`EnhancedCard`、`EnhancedCheckbox`、`EnhancedCheckboxGroup`、`EnhancedInput`、`EnhancedPagination`、`EnhancedPopover`、`EnhancedRadio`、`EnhancedRadioGroup`、`EnhancedSelect`、`EnhancedSelectOption`、`EnhancedSlider`、`EnhancedSpinner`、`EnhancedTable`、`EnhancedTabs`、`EnhancedTextarea`、`EnhancedTooltip`

对应 Props 类型（部分）：`EnhancedButtonProps`、`EnhancedInputProps?`（以 d.ts 为准）、`EnhancedTableProps?`、`EnhancedSelectProps`、`EnhancedTabsProps`、`EnhancedPopoverProps`、`EnhancedTooltipProps`、`EnhancedSliderProps`、`EnhancedSpinnerProps`、`EnhancedPaginationProps`、`EnhancedAvatarProps`、`EnhancedBadgeProps`、`EnhancedCardProps`、`EnhancedEmptyProps`、`EnhancedDropdownProps`、`EnhancedTimelineProps`、`EnhancedTextareaProps`、`EnhancedUploadProps`

## 3. 高级 / 命令式层（完整业务组件 & 命令式 API）

业务控件（裸名）：
`Modal`、`InputNumber`、`DatePicker`、`RangePicker`（类型 `RangePickerProps`）、`Dropdown`、`DropdownButton`、`Empty`、`List`（`ListItem`/`ListProps`）、`SegmentedControl`、`Slider`、`Spinner`、`Steps`（`StepItem`/`StepsProps`）、`Table`(增强版同名需区分，见下注)、`Tabs`、`Textarea`、`Timeline`、`Tree`、`TreeSelect`、`DirectoryTree`（`DirectoryTreeProps`）、`Upload`、`UploadDragger`、`SearchInput`、`DivSkeleton`、`Pagination`

命令式 API（函数 / 单例）：
- `message`：`message.success/error/warning/info/loading(...)` 风格的全局提示。
- `toast`、`Toaster`、`useSonner`：sonner 风格通知（`Toaster` 是容器组件）。
- `Modal` 命令式开法：`openModalError(...)`、`openModalWarning(...)`、`openModalWarning02(...)`、`openTipsModal(...)`。

Props 类型：`ModalProps`、`InputNumberProps`、`DatePickerProps`、`StepsProps`、`ListProps`、`DirectoryTreeProps`、`RangePickerProps` 等。

> ⚠️ 同名歧义：`Select`、`Table`、`Tabs`、`Slider`、`Pagination`、`Popover`、`Tooltip`、`Avatar`、`Badge`、`Card`、`Checkbox`、`Radio` 等名字在不同层可能各有版本。**优先用带 `Enhanced` 前缀的**获得开箱即用体验；裸名的基础结构件（如 `Table*`、`Select*` 系列）需要手动组合。拿不准时查 [components.md](./components.md)。

## 4. Provider / Hooks / 主题 / 国际化

| 导出 | 说明 |
|---|---|
| `ConfigProvider`、`useLocale`、`ConfigProviderProps` | 全局配置（语言等）Provider 与读取 hook |
| `ThemeProvider`、`useTheme`、`ThemeToggle`、`ThemeProviderProps` | 主题 Provider / 切换 |
| `ErrorBoundary` | 错误边界组件 |
| `Toaster`、`toast`、`useSonner` | 通知容器与 API |
| `zhCN`、`enUS`、`Locale` | 内置语言包与类型 |

## 5. 工具（class / 变体）

> 本库**不导出 `cn`**。类名工具直接转出自 clsx / tailwind-merge / class-variance-authority：

`clsx`、`cx`、`twMerge`、`cva`、`VariantProps`、`ClassValue`

```ts
import { clsx, twMerge, cva } from '@teamhelper/ui';
const cls = twMerge(clsx('px-2', condition && 'bg-card'));
```

## 6. 子路径导入

`package.json#exports` 提供 `"./*"`，故也可 `import { X } from '@teamhelper/ui/<模块>'`（按 dist 文件名）。**优先用主入口** `'@teamhelper/ui'`，子路径仅在需要更细 tree-shaking 时用，且路径以 dist 实际产物为准。

## 7. 样式与 peer

- **不打包 CSS**：组件用 Tailwind utility，宿主须 v4 `@source` 扫描本包 dist（见 [SKILL 步骤 2](../SKILL.md)）。token 见包内 `src/styles/globals.css`。
- **peerDependencies**：`react >=16.9`（实际项目 React 19）。

## 8. 完整导出索引（附录 · 防臆测）

> 以下为构建产物 `dist/index.d.ts` 的全部 237 个导出（去重、字母序），作为「名字是否存在」的兜底清单。未列出的视为不存在。

`Alert` `AlertDescription` `AlertDialog` `AlertDialogAction` `AlertDialogCancel` `AlertDialogContent` `AlertDialogDescription` `AlertDialogFooter` `AlertDialogHeader` `AlertDialogOverlay` `AlertDialogPortal` `AlertDialogTitle` `AlertDialogTrigger` `AlertTitle` `AspectRatio` `Avatar` `Badge` `badgeVariants` `BreadcrumbContainer` `BreadcrumbItem` `BreadcrumbLink` `BreadcrumbList` `BreadcrumbPage` `BreadcrumbSeparator` `Button` `ButtonGroup` `ButtonGroupText` `buttonVariants` `Calendar` `CalendarDayButton` `Card` `CardContent` `CardDescription` `CardFooter` `CardHeader` `CardTitle` `Checkbox` `ClassValue` `clsx` `ConfigProvider` `ContextMenu` `ContextMenuCheckboxItem` `ContextMenuContent` `ContextMenuGroup` `ContextMenuItem` `ContextMenuLabel` `ContextMenuRadioGroup` `ContextMenuRadioItem` `ContextMenuSeparator` `ContextMenuShortcut` `ContextMenuSub` `ContextMenuSubContent` `ContextMenuSubTrigger` `ContextMenuTrigger` `cva` `cx` `DatePicker` `DatePickerBase` `default` `Dialog` `DialogClose` `DialogContent` `DialogDescription` `DialogFooter` `DialogHeader` `DialogOverlay` `DialogPortal` `DialogTitle` `DialogTrigger` `DirectoryTree` `DivSkeleton` `Drawer` `DrawerClose` `DrawerContent` `DrawerDescription` `DrawerFooter` `DrawerHeader` `DrawerOverlay` `DrawerPortal` `DrawerTitle` `DrawerTrigger` `Dropdown` `DropdownButton` `DropdownMenu` `DropdownMenuCheckboxItem` `DropdownMenuContent` `DropdownMenuGroup` `DropdownMenuItem` `DropdownMenuLabel` `DropdownMenuPortal` `DropdownMenuRadioGroup` `DropdownMenuRadioItem` `DropdownMenuSeparator` `DropdownMenuShortcut` `DropdownMenuSub` `DropdownMenuSubContent` `DropdownMenuSubTrigger` `DropdownMenuTrigger` `Empty` `EnhancedAlert` `EnhancedBreadcrumb` `EnhancedButton` `EnhancedCheckbox` `EnhancedCheckboxGroup` `EnhancedInput` `EnhancedPagination` `EnhancedPopover` `EnhancedRadio` `EnhancedRadioGroup` `EnhancedSelect` `EnhancedSelectOption` `EnhancedSlider` `EnhancedSpinner` `EnhancedTable` `EnhancedTabs` `EnhancedTextarea` `EnhancedTooltip` `ErrorBoundary` `Form` `FormControl` `FormDescription` `FormField` `FormItem` `FormLabel` `FormMessage` `Input` `InputNumber` `Label` `List` `Menubar` `MenubarCheckboxItem` `MenubarContent` `MenubarGroup` `MenubarItem` `MenubarLabel` `MenubarMenu` `MenubarPortal` `MenubarRadioGroup` `MenubarRadioItem` `MenubarSeparator` `MenubarShortcut` `MenubarSub` `MenubarSubContent` `MenubarSubTrigger` `MenubarTrigger` `message` `Modal` `NavigationMenu` `NavigationMenuContent` `NavigationMenuIndicator` `NavigationMenuItem` `NavigationMenuLink` `NavigationMenuList` `NavigationMenuTrigger` `navigationMenuTriggerStyle` `NavigationMenuViewport` `openModalError` `openModalWarning` `openModalWarning02` `openTipsModal` `Pagination` `PaginationContent` `PaginationEllipsis` `PaginationItem` `PaginationLink` `PaginationNext` `PaginationPrevious` `Popover` `PopoverAnchor` `PopoverContent` `PopoverTrigger` `Progress` `RadioGroup` `RadioGroupItem` `ResizableHandle` `ResizablePanel` `ResizablePanelGroup` `SearchInput` `SegmentedControl` `Select` `SelectContent` `SelectGroup` `SelectItem` `SelectLabel` `SelectScrollDownButton` `SelectScrollUpButton` `SelectSeparator` `SelectTrigger` `SelectValue` `Separator` `Sheet` `SheetClose` `SheetContent` `SheetDescription` `SheetFooter` `SheetHeader` `SheetOverlay` `SheetPortal` `SheetTitle` `SheetTrigger` `Skeleton` `Slider` `Spinner` `Steps` `Switch` `Table` `TableBody` `TableCaption` `TableCell` `TableFooter` `TableHead` `TableHeader` `TableRow` `Tabs` `TabsContent` `TabsList` `TabsTrigger` `Textarea` `ThemeProvider` `ThemeToggle` `Timeline` `toast` `Toaster` `Tooltip` `TooltipArrow` `TooltipContent` `TooltipProvider` `TooltipTrigger` `Tree` `TreeSelect` `twMerge` `Upload` `useFormField` `useLocale` `useSonner` `useTheme` `VariantProps` `zhCN` `enUS`

> 注：清单含值与类型混合（如 `ClassValue`/`VariantProps`/`*Props` 为类型）。`default` 为兜底默认导出。具体某项是值还是类型、其 Props 形状，以 `dist/index.d.ts` 为准。
