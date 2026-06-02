# Teamhelper UI MCP Server

这个目录是 `@teamhelper/ui` 的本地 MCP Server 学习版。它通过 `stdio` 协议启动，适合接入 Codex、Cursor、Claude Desktop 这类本地 AI 客户端。

## MCP 在这里做什么

MCP Server 不是 LLM，也不会训练模型。它负责把组件库的真实上下文暴露给 AI：

- `Tools`：AI 可以主动调用的函数。
- `Resources`：AI 可以读取的结构化上下文。
- `Prompts`：可复用的提示词模板。

当前服务是只读的，默认只读取 `src/components`、`stories` 和 `src/styles/globals.css`。

## TypeScript 版本本地运行

```bash
pnpm mcp:dev
```

这个命令会启动 `stdio` 服务。直接在终端运行时看不到交互 UI，因为 MCP 客户端会通过 stdin/stdout 跟它通信。

## Python 版本本地运行

```bash
pnpm mcp:dev:py
```

Python 版本使用官方 `mcp` Python SDK 的 `FastMCP` API，并通过 `uv run --with mcp` 临时安装运行依赖，不需要手动创建虚拟环境。

## 本地冒烟测试

```bash
pnpm mcp:smoke
```

Python 版本：

```bash
pnpm mcp:smoke:py
```

这个测试会启动一个 MCP Client，连接本地服务，并验证：

- `list_components`
- `get_component`
- `teamhelper-ui://design-tokens`

## 可用 Tools

- `list_components`：扫描 `src/components/ui`、`src/components/enhance-ui` 和 `stories`，返回组件索引。
- `get_component`：按组件 id、组件名、导出名或类型名查组件，可返回源码和 Storybook 示例。
- `get_design_tokens`：读取 `src/styles/globals.css` 中的 CSS variables。
- `explain_mcp_server`：解释当前 MCP Server 的结构。

Python 版本提供相同 tools，但 resource URI 使用 `teamhelper-ui-python://` 前缀，便于和 TypeScript 版本同时接入。

## 可用 Resources

- `teamhelper-ui://components`
- `teamhelper-ui://design-tokens`
- `teamhelper-ui://component/{name}`

例如：

```txt
teamhelper-ui://component/ui/button
teamhelper-ui://component/enhance-ui/Button
```

## 接入 MCP 客户端

大多数 MCP 客户端都需要类似下面的配置：

```json
{
  "mcpServers": {
    "teamhelper-ui": {
      "command": "pnpm",
      "args": ["exec", "tsx", "mcp/server.ts"],
      "cwd": "/Users/echo/WebstormProjects/teamhelper-v4-web/packages/ui"
    }
  }
}
```

Python 版本配置：

```json
{
  "mcpServers": {
    "teamhelper-ui-python": {
      "command": "uv",
      "args": ["run", "--with", "mcp", "python", "mcp/server.py"],
      "cwd": "/Users/echo/WebstormProjects/teamhelper-v4-web/packages/ui"
    }
  }
}
```

具体配置文件位置取决于客户端。学习时建议先跑通 `pnpm mcp:smoke`，再接入外部客户端。

## 下一步可以怎么扩展

- 从 Storybook `argTypes` 中提取更细的 props 文档。
- 读取构建后的 `dist/*.d.ts`，让 AI 获取更准确的类型签名。
- 增加 `check_component_usage` 工具，用于检查业务代码是否正确使用组件。
- 增加 `generate_usage_example` 工具，根据场景生成组件示例代码。
