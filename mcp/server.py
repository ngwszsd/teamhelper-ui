from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any, Literal, TypedDict

from mcp.server.fastmcp import FastMCP

ComponentLayer = Literal["ui", "enhance-ui"]

PROJECT_ROOT = Path(__file__).resolve().parents[1]
MAX_FILE_CHARS = 60_000


class FileContent(TypedDict):
    path: str
    text: str
    truncated: bool


class ComponentSummary(TypedDict, total=False):
    id: str
    name: str
    layer: ComponentLayer
    sourcePath: str
    storyPath: str
    storyTitle: str
    exports: list[str]
    propTypes: list[str]


class ComponentGroup(TypedDict):
    layer: ComponentLayer
    source_dir: Path


COMPONENT_GROUPS: list[ComponentGroup] = [
    {
        "layer": "ui",
        "source_dir": PROJECT_ROOT / "src/components/ui",
    },
    {
        "layer": "enhance-ui",
        "source_dir": PROJECT_ROOT / "src/components/enhance-ui",
    },
]

mcp = FastMCP(
    name="teamhelper-ui-mcp-python",
    instructions="Read-only MCP server for @teamhelper/ui components, Storybook stories, and design tokens.",
)


def from_project_root(path: Path) -> str:
    return path.resolve().relative_to(PROJECT_ROOT).as_posix()


def to_pascal_case(value: str) -> str:
    return "".join(part[:1].upper() + part[1:] for part in re.split(r"[-_\s]+", value) if part)


def normalize_lookup(value: str) -> str:
    return re.sub(r"[^a-z0-9]", "", value.lower())


def read_text_file(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def limit_file(path: Path, text: str) -> FileContent:
    if len(text) <= MAX_FILE_CHARS:
        return {
            "path": from_project_root(path),
            "text": text,
            "truncated": False,
        }

    return {
        "path": from_project_root(path),
        "text": f"{text[:MAX_FILE_CHARS]}\n\n/* Truncated after {MAX_FILE_CHARS} characters. */",
        "truncated": True,
    }


def story_candidates(layer: ComponentLayer, file_base: str) -> list[str]:
    pascal = to_pascal_case(file_base)
    if layer == "enhance-ui":
        return [f"Enhanced{pascal}.stories.tsx", f"{pascal}.stories.tsx"]
    return [f"{pascal}.stories.tsx"]


def find_story_path(layer: ComponentLayer, file_base: str) -> Path | None:
    for candidate in story_candidates(layer, file_base):
        path = PROJECT_ROOT / "stories" / candidate
        if path.exists():
            return path
    return None


def extract_named_exports(source: str) -> list[str]:
    exports: set[str] = set()

    for match in re.finditer(
        r"export\s+(?:const|let|var|function|class|interface|type)\s+([A-Za-z_$][\w$]*)",
        source,
    ):
        exports.add(match.group(1))

    for match in re.finditer(r"export\s*{\s*([^}]+)\s*}", source):
        for raw_name in match.group(1).split(","):
            cleaned = re.sub(r"^type\s+", "", raw_name.strip()).split(" as ")[-1].strip()
            if re.match(r"^[A-Za-z_$][\w$]*$", cleaned):
                exports.add(cleaned)

    return sorted(exports)


def extract_prop_types(source: str) -> list[str]:
    props: set[str] = set()

    for match in re.finditer(
        r"export\s+(?:interface|type)\s+([A-Za-z_$][\w$]*(?:Props|Options|Item|Node)?)",
        source,
    ):
        props.add(match.group(1))

    return sorted(props)


def extract_story_title(source: str) -> str | None:
    match = re.search(r"title:\s*['\"]([^'\"]+)['\"]", source)
    return match.group(1) if match else None


def build_component_index() -> list[ComponentSummary]:
    components: list[ComponentSummary] = []

    for group in COMPONENT_GROUPS:
        layer = group["layer"]
        source_dir = group["source_dir"]

        for path in sorted(source_dir.glob("*.tsx")):
            file_base = path.stem
            source = read_text_file(path)
            story_path = find_story_path(layer, file_base)
            story_source = read_text_file(story_path) if story_path else None

            component: ComponentSummary = {
                "id": f"{layer}/{file_base}",
                "name": f"Enhanced{to_pascal_case(file_base)}"
                if layer == "enhance-ui"
                else to_pascal_case(file_base),
                "layer": layer,
                "sourcePath": from_project_root(path),
                "exports": extract_named_exports(source),
                "propTypes": extract_prop_types(source),
            }

            if story_path:
                component["storyPath"] = from_project_root(story_path)
            if story_source:
                title = extract_story_title(story_source)
                if title:
                    component["storyTitle"] = title

            components.append(component)

    return sorted(components, key=lambda component: component["id"])


def filter_components(
    components: list[ComponentSummary],
    query: str | None = None,
    layer: ComponentLayer | None = None,
) -> list[ComponentSummary]:
    filtered = [
        component
        for component in components
        if layer is None or component["layer"] == layer
    ]

    if not query:
        return filtered

    normalized_query = query.lower()

    def searchable_text(component: ComponentSummary) -> str:
        parts: list[str] = [
            component.get("id", ""),
            component.get("name", ""),
            component.get("layer", ""),
            component.get("sourcePath", ""),
            component.get("storyPath", ""),
            component.get("storyTitle", ""),
            *component.get("exports", []),
            *component.get("propTypes", []),
        ]
        return " ".join(part for part in parts if part).lower()

    return [
        component
        for component in filtered
        if normalized_query in searchable_text(component)
    ]


def resolve_component(name: str) -> ComponentSummary:
    components = build_component_index()
    normalized = normalize_lookup(name)
    exact_name = name.lower()

    for component in components:
        candidates = [
            component.get("id", ""),
            component.get("name", ""),
            component.get("sourcePath", ""),
            component.get("storyPath", ""),
            *component.get("exports", []),
            *component.get("propTypes", []),
        ]

        for candidate in candidates:
            if not candidate:
                continue
            text = candidate.lower()
            if text == exact_name or normalize_lookup(candidate) == normalized:
                return component

    raise ValueError(f'Component "{name}" was not found. Run list_components first.')


def read_component_detail(
    name: str,
    include_source: bool = False,
    include_story: bool = True,
) -> dict[str, Any]:
    component = dict(resolve_component(name))

    if include_source:
        source_path = PROJECT_ROOT / component["sourcePath"]
        component["source"] = limit_file(source_path, read_text_file(source_path))

    story_path_text = component.get("storyPath")
    if include_story and story_path_text:
        story_path = PROJECT_ROOT / story_path_text
        component["story"] = limit_file(story_path, read_text_file(story_path))

    return component


def get_design_tokens_data() -> dict[str, Any]:
    css_path = PROJECT_ROOT / "src/styles/globals.css"
    css = read_text_file(css_path)
    variables = [
        {"name": f"--{match.group(1)}", "value": match.group(2).strip()}
        for match in re.finditer(r"--([A-Za-z0-9-_]+)\s*:\s*([^;]+);", css)
    ]

    return {
        "sourcePath": from_project_root(css_path),
        "count": len(variables),
        "variables": variables,
    }


@mcp.tool(
    title="List Teamhelper UI components",
    description="List components discovered from source files and matching Storybook stories.",
)
def list_components(query: str | None = None, layer: ComponentLayer | None = None) -> dict[str, Any]:
    components = filter_components(build_component_index(), query=query, layer=layer)
    return {
        "count": len(components),
        "components": components,
    }


@mcp.tool(
    title="Get a Teamhelper UI component",
    description="Return one component metadata and optionally include source and Storybook story text.",
)
def get_component(
    name: str,
    include_source: bool = False,
    include_story: bool = True,
) -> dict[str, Any]:
    return read_component_detail(
        name,
        include_source=include_source,
        include_story=include_story,
    )


@mcp.tool(
    title="Get design tokens",
    description="Read CSS custom properties from src/styles/globals.css.",
)
def get_design_tokens() -> dict[str, Any]:
    return get_design_tokens_data()


@mcp.tool(
    title="Explain this Python MCP server",
    description="Explain how this local Python MCP server is structured.",
)
def explain_mcp_server() -> str:
    return """This is the Python version of the @teamhelper/ui MCP server.

It uses the official Python SDK's FastMCP API:
- @mcp.tool() registers callable tools.
- @mcp.resource() registers readable context.
- @mcp.prompt() registers reusable prompt templates.

The server is read-only and uses stdio transport by default. It scans local source files,
Storybook stories, and CSS variables so an AI client can use real component-library context."""


@mcp.resource(
    "teamhelper-ui-python://components",
    title="Teamhelper UI Component Index",
    description="Component metadata discovered from source files and Storybook stories.",
    mime_type="application/json",
)
def component_index_resource() -> str:
    return json.dumps({"components": build_component_index()}, ensure_ascii=False, indent=2)


@mcp.resource(
    "teamhelper-ui-python://design-tokens",
    title="Teamhelper UI Design Tokens",
    description="CSS custom properties from src/styles/globals.css.",
    mime_type="application/json",
)
def design_tokens_resource() -> str:
    return json.dumps(get_design_tokens_data(), ensure_ascii=False, indent=2)


@mcp.resource(
    "teamhelper-ui-python://component/{name}",
    title="Teamhelper UI Component Detail",
    description="One component detail with source and matching Storybook story.",
    mime_type="application/json",
)
def component_resource(name: str) -> str:
    return json.dumps(
        read_component_detail(name, include_source=True, include_story=True),
        ensure_ascii=False,
        indent=2,
    )


@mcp.prompt(
    title="Generate Teamhelper UI usage",
    description="Prompt template for generating code that uses one Teamhelper UI component.",
)
def teamhelper_ui_usage(component_name: str, scenario: str | None = None) -> str:
    component = read_component_detail(
        component_name,
        include_source=True,
        include_story=True,
    )
    target = scenario or "show a practical component usage example"

    return f"""Use @teamhelper/ui to build this scenario: {target}.

Component context:
{json.dumps(component, ensure_ascii=False, indent=2)}

Follow the component API and Storybook patterns exactly. Prefer existing exports from @teamhelper/ui."""


if __name__ == "__main__":
    print("Teamhelper UI Python MCP server is running over stdio.", file=sys.stderr)
    mcp.run(transport="stdio")
