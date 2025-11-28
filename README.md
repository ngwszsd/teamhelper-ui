# @teamhelper/ui

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)
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
- 🎯 **TypeScript 支持** - 完整的类型定义，提供出色的开发体验
- 🌳 **Tree-Shaking 优化** - 优秀的 tree-shaking 支持，按需导入，减小打包体积
- 🎭 **主题定制** - 支持亮色/暗色主题，易于定制
- 📦 **开箱即用** - 66+ 个精心设计的组件
- 🚀 **高性能** - 基于 rslib 打包，独立文件输出，优化加载性能
- 💅 **Tailwind CSS** - 使用 Tailwind CSS v4，灵活的样式系统
- 📱 **响应式** - 所有组件都支持响应式设计

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

> **注意**：其他工具库（如 `clsx`, `tailwind-merge` 等）会在安装组件库时自动安装，无需手动添加。

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

在你的全局 CSS 文件（如 `globals.css`）中导入 Tailwind CSS 配置，并添加 `@source` 指令以确保 Tailwind 能正确扫描组件库的样式：

```css
@import 'tailwindcss';
@source "../node_modules/@teamhelper/ui/dist";
```

### 4. 使用内置工具库

组件库已经内置并导出了常用的工具库，你可以直接使用，无需额外安装：

```tsx
import { toast, clsx, twMerge, Icons } from '@teamhelper/ui';

// 使用 Toast
toast.success('操作成功');

// 使用图标
<Icons.User className="w-4 h-4" />;

// 使用样式合并
const className = twMerge(clsx('base-class', condition && 'active'));
```

---

## 📚 组件列表

### 基础组件 (37个)

<details>
<summary>点击展开查看所有基础组件</summary>

#### 表单组件

- **Button** - 按钮组件
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
- **ResizablePanel** - 可调整大小的面板

</details>

### 增强组件 (29个)

<details>
<summary>点击展开查看所有增强组件</summary>

- **EnhancedButton** - 增强按钮
- **EnhancedCard** - 增强卡片
- **EnhancedInput** / **SearchInput** - 增强输入框
- **EnhancedTable** - 增强表格
- **EnhancedSelect** - 增强选择器
- **EnhancedPagination** - 增强分页
- **EnhancedTabs** - 增强标签页
- **EnhancedCheckbox** / **EnhancedCheckboxGroup** - 增强复选框
- **EnhancedRadio** / **EnhancedRadioGroup** - 增强单选框
- **DatePicker** / **RangePicker** - 日期选择器
- **Upload** / **UploadDragger** - 文件上传
- **Tree** - 树形控件
- **Timeline** - 时间轴
- **Modal** - 模态框
- **Dropdown** - 下拉菜单
- **Empty** - 空状态
- **List** - 列表
- **DivSkeleton** - 骨架屏
- 更多...

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

📄 **[Tree-Shaking 详细说明](./README_TREE_SHAKING.md)**

---

## 🎨 主题定制

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

所有组件都支持通过 `className` 属性自定义样式：

```tsx
<Button className="bg-gradient-to-r from-purple-500 to-pink-500">
  渐变按钮
</Button>
```

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

- **组件数量**: 66+
- **TypeScript 覆盖率**: 100%
- **Tree-Shaking 支持**: ⭐⭐⭐⭐⭐
- **打包体积**: 单组件 ~29 KB (压缩后)

---

<div align="center">

**使用 ❤️ 和 TypeScript 构建**

</div>
