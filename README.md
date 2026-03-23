# @teamhelper/ui

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.26-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/react-%3E%3D16.9.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.9.3-3178c6.svg)
![Tree-Shaking评估](https://img.shields.io/badge/tree--shaking-✓-success.svg)

**现代化的 React UI 组件库，基于 Radix UI 和 Tailwind CSS 构建**

[安装](#-安装) • [使用](#-快速开始) • [组件](#-组件列表) • [文档](#-文档) • [Tree-Shaking](#-tree-shaking-支持)

</div>

---

## ✨ 特性

- 🎨 **现代化设计** - 基于 Radix UI，提供无障碍访问和优秀的用户体验
- 🌍 **多语言支持 (i18n)** - 内置完善的国际化方案，组件库文案一键切换
- 🎯 **TypeScript 支持** - 完整的类型定义，提供出色的开发体验
- 🌳 **Tree-Shaking 优化** - 优秀的 tree-shaking 支持，按需导入，减小打包体积
- 🎭 **主题定制** - 支持亮色/暗色主题，深度定制 CSS 变量
- 📦 **开箱即用** - 70+ 个精心设计的组件，涵盖从基础到业务场景
- 🚀 **高性能** - 基于 rslib 打包，独立文件输出，优化加载性能
- 💅 **Tailwind CSS** - 使用 Tailwind CSS v4，声明式高效样式系统
- 📱 **响应式** - 所有原子组件都支持响应式设计，完美适配移动端

---

## 📦 安装

```bash
# npm
npm install @teamhelper/ui

# pnpm
pnpm add @teamhelper/ui

# yarn
yarn add @teamhelper/ui
```

### Peer Dependencies

组件库依赖 React，请确保你的项目已安装：

```bash
npm install react react-dom
```

> **注意**：其他工具库（如 `clsx`, `tailwind-merge` 等）作为组件库的依赖会被自动安装。**但在 pnpm 环境下**，如果你需要直接从原包名（如 `import { clsx } from 'clsx'`）导入，仍需手动在项目中安装。推荐直接从 `@teamhelper/ui` 导出这些工具（参见下文 [使用内置工具库](#4-使用内置工具库)）。

---

## 🚀 快速开始

### 1. 导入组件

```tsx
import { Button, Card, Input } from '@teamhelper/ui';

function App() {
  return (
    <Card>
      <Input placeholder="输入内容" />
      <Button>提交</Button>
    </Card>
  );
}
```

### 2. 配置主题（可选）

```tsx
import { ThemeProvider } from '@teamhelper/ui';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <YourApp />
    </ThemeProvider>
  );
}
```

### 3. 导入样式

在你的全局 CSS 文件中导入 Tailwind CSS 配置。为了确保 Tailwind v4 能扫描到组件库中的类名，并正确生成样式，你需要使用 `@source` 指令指向组件库目录。

#### 方案 A：在子目录中导入（如 `src/index.css`）

这种方式通常需要通过相对路径指向 `node_modules`：

```css
@import 'tailwindcss';

/* 指向组件库目录，确保 Tailwind v4 能扫描并生成对应的样式 */
@source "../node_modules/@teamhelper/ui";

/* ... 其余基础变量配置 */
```

#### 方案 B：在根目录中导入（优雅推荐 ✨）

在 Tailwind v4 版本中，**CSS 文件本身就是配置文件**。就像以前 `tailwind.config.js` 必须放在项目根目录一样，现在将带有 `@source` 的全局 CSS 放在根目录，可以为 Oxide 扫描引擎提供一个最清晰、没有干扰的物理坐标系。

如果你将这个 CSS 文件移到根目录（如 `./global.css`），就可以直接使用更简洁的导入：

```css
@import 'tailwindcss';

/* 在根目录下，可以直接指向 node_modules，路径更优雅 */
@source "node_modules/@teamhelper/ui";

/* ... 其余基础变量配置 */
```

> **提示**：Tailwind v4 具有智能探测功能，通常指向 `node_modules/@teamhelper/ui` 即可自动识别其产物目录（无需精确到 `/dist`）。

---

## 🎨 主题配置

本组件库基于 CSS 变量进行样式驱动。为了获得最佳视觉效果（尤其是明暗模式切换），请在你的全局 CSS 中配置以下变量：

### 核心 CSS 变量

```css
:root {
  --background: rgba(248, 249, 250, 1);
  --foreground: rgba(45, 55, 72, 1);
  --card: rgba(255, 255, 255, 1);
  --card-foreground: rgba(45, 55, 72, 1);
  --primary: rgba(25, 75, 251, 1);
  --primary-foreground: rgba(250, 250, 250, 1);
  --tabs: rgba(160, 174, 192, 1);
  --tabs-foreground: rgba(255, 255, 255, 1);
  --muted: rgba(248, 249, 250, 1);
  --muted-foreground: rgba(113, 128, 150, 1);
  --accent: rgba(248, 249, 250, 1);
  --accent-foreground: rgba(45, 55, 72, 1);
  --destructive: rgba(246, 81, 96, 1);
  --destructive-foreground: rgba(250, 250, 250, 1);
  --main-yellow: rgba(255, 140, 0, 1);
  --main-yellow-foreground: rgba(255, 237, 237, 1);
  --main-green: rgba(238, 255, 237, 1);
  --main-green-foreground: rgba(37, 180, 59, 1);
  --border: rgba(244, 244, 244, 1);
  --under-line: rgba(226, 232, 240, 1);
  --input: rgba(226, 232, 240, 1);
  --ring: var(--primary);
  --radius: 0.625rem;
  --tooltip: oklch(0.205 0 0);
  --tooltip-foreground: rgba(250, 250, 250, 1);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
}

.dark {
  --background: rgba(26, 32, 44, 1);
  --foreground: rgba(250, 250, 250, 1);
  --card: rgba(35, 43, 56, 1);
  --card-foreground: rgba(250, 250, 250, 1);
  --primary: rgba(25, 75, 251, 1);
  --primary-foreground: rgba(250, 250, 250, 1);
  --tabs: rgba(113, 126, 143, 1);
  --tabs-foreground: rgba(250, 250, 250, 1);
  --muted: rgba(26, 32, 44, 1);
  --muted-foreground: rgba(113, 128, 150, 1);
  --accent: rgba(26, 32, 44, 1);
  --accent-foreground: rgba(113, 128, 150, 1);
  --destructive: rgba(246, 81, 96, 1);
  --destructive-foreground: rgba(250, 250, 250, 1);
  --main-yellow: rgba(255, 140, 0, 1);
  --main-yellow-foreground: rgba(72, 55, 38, 1);
  --main-green: rgba(37, 180, 59, 1);
  --main-green-foreground: rgba(11, 65, 31, 1);
  --border: rgba(42, 49, 60, 1);
  --under-line: rgba(61, 68, 77, 1);
  --input: var(--border);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
}
```

### Tailwind v4 主题映射

在 Tailwind v4 中，建议使用 `@theme inline` 将 CSS 变量映射为系统颜色：

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-tabs: var(--tabs);
  --color-tabs-foreground: var(--tabs-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-under-line: var(--under-line);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-main-green: var(--main-green);
  --color-main-green-foreground: var(--main-green-foreground);
  --color-main-yellow: var(--main-yellow);
  --color-main-yellow-foreground: var(--main-yellow-foreground);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-tooltip: var(--tooltip);
  --color-tooltip-foreground: var(--tooltip-foreground);
}
```

---

## 🎨 主题定制 (Logic)

### 使用主题提供者

```tsx
import { ThemeProvider, useTheme, ThemeToggle } from '@teamhelper/ui';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <YourApp />
      <ThemeToggle />
    </ThemeProvider>
  );
}

// 在组件中使用主题
function Component() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      切换主题
    </button>
  );
}
```

### 自定义样式

所有组件都支持通过 `className` 属性结合 Tailwind 类名进行即时定制：

```tsx
<Button className="bg-linear-to-r from-purple-500 to-pink-500 text-white">
  渐变按钮
</Button>
```

### 4. 使用内置工具库

组件库已经内置并导出了常用的工具库，你可以直接使用，无需额外安装：

```tsx
import { toast, useSonner, clsx, twMerge, cva, cx } from '@teamhelper/ui';

// 使用 Toast
toast.success('操作成功');

// 使用样式合并
const className = twMerge(clsx('base-class', condition && 'active'));

// 使用 CVA 定义变体
const button = cva('base', { variants: { size: { sm: 'p-1', lg: 'p-4' } } });
```

> **📦 关于依赖的说明**：由于本组件库是基于 `pnpm` 工作的，为了避免 `pnpm` 环境下找不到 `clsx` 或 `tailwind-merge` 等包的问题，我们已经在 `@teamhelper/ui` 中完整导出了这些工具。**强烈建议**直接从本库导入，而不是单独安装它们。

---

## 📚 组件列表

### 基础组件 (37个)

<details>
<summary>点击展开查看所有基础组件</summary>

#### 表单组件

- **Button** / **ButtonGroup** - 按钮及按钮组
- **Input** - 输入框
- **Checkbox** - 复选框
- **RadioGroup** - 单选框组
- **Select** - 下拉选择
- **Switch** - 开关
- **Slider** - 滑块
- **Textarea** - 文本域
- **Label** - 标签
- **Form** - 表单

#### 数据展示

- **Card** - 卡片
- **Table** - 表格
- **Badge** - 徽章
- **Avatar** - 头像
- **Calendar** - 日历
- **Progress** - 进度条
- **Skeleton** - 骨架屏
- **Separator** - 分割线

#### 反馈组件

- **Alert** - 警告提示
- **Dialog** - 对话框
- **AlertDialog** - 确认对话框
- **Drawer** - 抽屉
- **Sheet** - 侧边栏
- **Tooltip** - 工具提示
- **Popover** - 气泡卡片
- **Toaster** - 消息提示

#### 导航组件

- **Tabs** - 标签页
- **Breadcrumb** - 面包屑
- **Menubar** - 菜单栏
- **NavigationMenu** - 导航菜单
- **DropdownMenu** - 下拉菜单
- **Pagination** - 分页

#### 布局组件

- **AspectRatio** - 宽高比容器
- **ResizablePanel** / **ResizableHandle** - 可调整大小的面板
- **ContextMenu** - 右键菜单
- **Menubar** - 菜单栏
- **NavigationMenu** - 导航菜单

</details>

### 增强组件 (29个)

<details>
<summary>点击展开查看所有增强组件</summary>

- **EnhancedButton** - 增强按钮
- **EnhancedCard** - 增强卡片
- **EnhancedInput** / **SearchInput** / **InputNumber** - 增强输入框系列
- **EnhancedTable** - 增强表格（支持虚拟滚动、固定列、排序、选择）
- **EnhancedSelect** - 增强选择器（支持搜索、虚拟列表、多选）
- **TreeSelect** - 树形选择器（支持搜索、异步加载、目录模式）
- **EnhancedPagination** - 增强分页
- **EnhancedTabs** - 增强标签页
- **EnhancedCheckbox** / **EnhancedCheckboxGroup** - 增强复选框
- **EnhancedRadio** / **EnhancedRadioGroup** - 增强单选框
- **DatePicker** / **DatePicker.RangePicker** - 日期/日期范围选择器
- **Upload** / **Upload.Dragger** - 文件上传及拖拽上传
- **Tree** / **DirectoryTree** - 树形控件及目录树
- **Timeline** - 时间轴
- **Steps** - 步骤条
- **message** - 全局提示（单例调用）
- **EnhancedAlert** - 增强警告提示
- **Modal** - 模态框（增强版 Dialog）
- **Dropdown** - 增强下拉菜单
- **Empty** - 空状态（多场景支持）
- **List** - 虚拟滚动列表
- **DivSkeleton** - 通用骨架屏插槽
- **ErrorBoundary** - 错误边界组件
- **TipsModal** - 命令式模态框 (`openTipsModal`, `openModalError` 等)
- 更多业务场景组件持续增加中...

</details>

---

## 💡 使用示例

### 基础示例

```tsx
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@teamhelper/ui';

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>欢迎使用 @teamhelper/ui</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">默认按钮</Button>
        <Button variant="outline">轮廓按钮</Button>
        <Button variant="ghost">幽灵按钮</Button>
      </CardContent>
    </Card>
  );
}
```

### 表单示例

```tsx
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  Button,
} from '@teamhelper/ui';
import { useForm } from 'react-hook-form';

export function FormExample() {
  const form = useForm();

  return (
    <Form {...form}>
      <FormField
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>用户名</FormLabel>
            <FormControl>
              <Input placeholder="请输入用户名" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <Button type="submit">提交</Button>
    </Form>
  );
}
```

### 对话框示例

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from '@teamhelper/ui';

export function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>打开对话框</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>对话框标题</DialogTitle>
        </DialogHeader>
        <p>这是对话框的内容</p>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🌳 Tree-Shaking 支持

本组件库具有 **⭐⭐⭐⭐⭐ 优秀的 tree-shaking 支持**！

### 核心优势

- ✅ **独立文件输出** - 每个组件独立打包，未使用的组件不会被打包
- ✅ **ESM 格式优先** - 完美支持现代打包工具
- ✅ **正确的 sideEffects 配置** - 仅 CSS 有副作用
- ✅ **命名导出** - 所有组件使用命名导出，便于 tree-shaking

### 打包体积对比

| 导入方式        | 压缩后体积  | 评价            |
| --------------- | ----------- | --------------- |
| 单组件 (Button) | **~29 KB**  | ⭐⭐⭐⭐⭐ 优秀 |
| 3个基础组件     | **~30 KB**  | ⭐⭐⭐⭐⭐ 优秀 |
| 5个常用组件     | **~114 KB** | ⭐⭐⭐⭐ 良好   |
| 10个组件        | **~136 KB** | ⭐⭐⭐ 正常     |

### 推荐用法

```tsx
// ✅ 推荐：按需导入
import { Button, Card, Input } from '@teamhelper/ui';

// ❌ 不推荐：全量导入
import * as UI from '@teamhelper/ui';
```

### 详细文档

查看完整的 tree-shaking 分析和优化建议：

📄 **[Tree-Shaking 详细说明](README_TREE_SHAKING.md)**

---

</Button>
```

---

## 🌍 国际化 (i18n)

组件库内置了国际化支持，通过 `ConfigProvider` 统一配置。

### 使用方法

```tsx
import { ConfigProvider, enUS, zhCN } from '@teamhelper/ui';

function App() {
  return (
    // locale 默认为 zhCN
    <ConfigProvider locale={enUS}>
      <YourApp />
    </ConfigProvider>
  );
}
```

### 覆盖组件文案

你可以通过 `locale` 属性覆盖特定组件的文案，或者通过 `ConfigProvider` 局部调整。

### 支持的组件

所有 `Enhanced` 系列组件以及 `Upload`, `Tree`, `Table`, `DatePicker`, `Empty`, `Modal`, `Select`, `TreeSelect`, `Timeline` 等均已支持国际化。

---

## 📖 文档

### 组件文档

运行 Storybook 查看所有组件的交互式文档：

```bash
npm run storybook:dev
```

访问 `http://localhost:6077` 查看组件文档。

### 构建文档

```bash
npm run storybook:build
```

### API 文档

每个组件都提供了完整的 TypeScript 类型定义，在 IDE 中可以获得完整的类型提示和文档。

---

## 🛠️ 开发

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 类型检查

```bash
npm run type-check
```

### 代码格式化

```bash
npm run format
```

### Bundle 分析

```bash
npm run analyze
```

---

## 📦 技术栈

- **React** - UI 框架
- **TypeScript** - 类型安全
- **Radix UI** - 无障碍访问的组件基础
- **Tailwind CSS v4** - 样式系统
- **rslib** - 现代化的库打包工具
- **class-variance-authority** - 变体管理
- **react-hook-form** - 表单管理
- **Storybook** - 组件文档

---

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

---

## 📄 许可证

MIT © [Teamhelper](https://gitlab.teamhelper.cn/teamhelper-v4/front-end/teamhelper-v4-web)

---

## 🔗 相关链接

- [GitLab 仓库](https://gitlab.teamhelper.cn/teamhelper-v4/front-end/teamhelper-v4-web)
- [NPM 包](https://www.npmjs.com/package/@teamhelper/ui)
- [问题反馈](https://gitlab.teamhelper.cn/teamhelper-v4/front-end/teamhelper-v4-web/issues)

---

## 📊 项目统计

- **组件数量**: 70+
- **TypeScript 覆盖率**: 100%
- **Tree-Shaking 支持**: ⭐⭐⭐⭐⭐
- **打包体积**: 单组件 ~29 KB (压缩后)

---

<div align="center">

**使用 ❤️ 和 TypeScript 构建**

</div>
