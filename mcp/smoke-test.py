from __future__ import annotations

import asyncio
import json
from pathlib import Path

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from mcp.types import TextContent

PROJECT_ROOT = Path(__file__).resolve().parents[1]


def content_text(result: object) -> str:
    content = getattr(result, "content", [])
    for item in content:
        if isinstance(item, TextContent):
            return item.text
    return ""


def resource_text(result: object) -> str:
    contents = getattr(result, "contents", [])
    for item in contents:
        text = getattr(item, "text", None)
        if isinstance(text, str):
            return text
    return ""


async def main() -> None:
    server = StdioServerParameters(
        command="uv",
        args=["run", "--with", "mcp", "python", "mcp/server.py"],
        cwd=PROJECT_ROOT,
    )

    async with stdio_client(server) as (read_stream, write_stream):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()

            tools = await session.list_tools()
            print(f"tools: {', '.join(tool.name for tool in tools.tools)}")

            components = await session.call_tool(
                "list_components",
                {"query": "button"},
            )
            print(f"list_components sample:\n{content_text(components)[:1200]}")

            button = await session.call_tool(
                "get_component",
                {
                    "name": "ui/button",
                    "include_source": True,
                    "include_story": True,
                },
            )
            print(f"get_component sample:\n{content_text(button)[:1200]}")

            resource = await session.read_resource("teamhelper-ui-python://design-tokens")
            sample = resource_text(resource)
            parsed = json.loads(sample)
            print(
                "design-tokens resource sample:\n"
                f"{json.dumps(parsed, ensure_ascii=False, indent=2)[:1200]}"
            )


if __name__ == "__main__":
    asyncio.run(main())
