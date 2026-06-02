import {
  McpServer,
  ResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type {
  CallToolResult,
  GetPromptResult,
  ReadResourceResult,
} from '@modelcontextprotocol/sdk/types.js';
import { access, readdir, readFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as z from 'zod/v4';
import type { Variables } from '@modelcontextprotocol/sdk/shared/uriTemplate.js';

type ComponentLayer = 'ui' | 'enhance-ui';

type ComponentSummary = {
  id: string;
  name: string;
  layer: ComponentLayer;
  sourcePath: string;
  storyPath?: string;
  storyTitle?: string;
  exports: string[];
  propTypes: string[];
};

type ComponentDetail = ComponentSummary & {
  source?: FileContent;
  story?: FileContent;
};

type FileContent = {
  path: string;
  text: string;
  truncated: boolean;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, '..');
const MAX_FILE_CHARS = 60_000;

const COMPONENT_GROUPS: Array<{
  layer: ComponentLayer;
  sourceDir: string;
  storyCandidates: (fileBase: string) => string[];
}> = [
  {
    layer: 'ui',
    sourceDir: join(PROJECT_ROOT, 'src/components/ui'),
    storyCandidates: (fileBase) => [`${toPascalCase(fileBase)}.stories.tsx`],
  },
  {
    layer: 'enhance-ui',
    sourceDir: join(PROJECT_ROOT, 'src/components/enhance-ui'),
    storyCandidates: (fileBase) => [
      `Enhanced${toPascalCase(fileBase)}.stories.tsx`,
      `${toPascalCase(fileBase)}.stories.tsx`,
    ],
  },
];

function toPosixPath(value: string) {
  return value.split(sep).join('/');
}

function fromProjectRoot(filePath: string) {
  return toPosixPath(relative(PROJECT_ROOT, filePath));
}

function toPascalCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function normalizeLookup(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function exists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readTextFile(filePath: string) {
  return readFile(filePath, 'utf8');
}

function limitFile(filePath: string, text: string): FileContent {
  if (text.length <= MAX_FILE_CHARS) {
    return {
      path: fromProjectRoot(filePath),
      text,
      truncated: false,
    };
  }

  return {
    path: fromProjectRoot(filePath),
    text: `${text.slice(0, MAX_FILE_CHARS)}\n\n/* Truncated after ${MAX_FILE_CHARS} characters. */`,
    truncated: true,
  };
}

function extractNamedExports(source: string) {
  const exports = new Set<string>();

  for (const match of source.matchAll(
    /export\s+(?:const|let|var|function|class|interface|type)\s+([A-Za-z_$][\w$]*)/g
  )) {
    exports.add(match[1]);
  }

  for (const match of source.matchAll(/export\s*{\s*([^}]+)\s*}/g)) {
    for (const rawName of match[1].split(',')) {
      const cleaned = rawName
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)
        .pop();

      if (cleaned && /^[A-Za-z_$][\w$]*$/.test(cleaned)) {
        exports.add(cleaned);
      }
    }
  }

  return [...exports].sort((a, b) => a.localeCompare(b));
}

function extractPropTypes(source: string) {
  const props = new Set<string>();

  for (const match of source.matchAll(
    /export\s+(?:interface|type)\s+([A-Za-z_$][\w$]*(?:Props|Options|Item|Node)?)/g
  )) {
    props.add(match[1]);
  }

  return [...props].sort((a, b) => a.localeCompare(b));
}

function extractStoryTitle(source: string) {
  return source.match(/title:\s*['"`]([^'"`]+)['"`]/)?.[1];
}

async function findStoryPath(layer: ComponentLayer, fileBase: string) {
  const group = COMPONENT_GROUPS.find((item) => item.layer === layer);
  if (!group) {
    return undefined;
  }

  for (const candidate of group.storyCandidates(fileBase)) {
    const filePath = join(PROJECT_ROOT, 'stories', candidate);
    if (await exists(filePath)) {
      return filePath;
    }
  }

  return undefined;
}

async function buildComponentIndex(): Promise<ComponentSummary[]> {
  const components: ComponentSummary[] = [];

  for (const group of COMPONENT_GROUPS) {
    const entries = await readdir(group.sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.tsx')) {
        continue;
      }

      const fileBase = entry.name.replace(/\.tsx$/, '');
      const sourcePath = join(group.sourceDir, entry.name);
      const source = await readTextFile(sourcePath);
      const storyPath = await findStoryPath(group.layer, fileBase);
      const storySource = storyPath ? await readTextFile(storyPath) : undefined;

      components.push({
        id: `${group.layer}/${fileBase}`,
        name:
          group.layer === 'enhance-ui'
            ? `Enhanced${toPascalCase(fileBase)}`
            : toPascalCase(fileBase),
        layer: group.layer,
        sourcePath: fromProjectRoot(sourcePath),
        storyPath: storyPath ? fromProjectRoot(storyPath) : undefined,
        storyTitle: storySource ? extractStoryTitle(storySource) : undefined,
        exports: extractNamedExports(source),
        propTypes: extractPropTypes(source),
      });
    }
  }

  return components.sort((a, b) => a.id.localeCompare(b.id));
}

function filterComponents(components: ComponentSummary[], query?: string) {
  if (!query) {
    return components;
  }

  const normalizedQuery = query.toLowerCase();
  return components.filter((component) =>
    [
      component.id,
      component.name,
      component.layer,
      component.sourcePath,
      component.storyPath,
      component.storyTitle,
      ...component.exports,
      ...component.propTypes,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery)
  );
}

async function resolveComponent(name: string) {
  const components = await buildComponentIndex();
  const normalized = normalizeLookup(name);
  const exactName = name.toLowerCase();

  const component = components.find((item) => {
    const names = [
      item.id,
      item.name,
      item.sourcePath,
      item.storyPath,
      ...item.exports,
      ...item.propTypes,
    ].filter((candidate): candidate is string => typeof candidate === 'string');

    return names.some((candidate) => {
      const text = candidate.toLowerCase();
      return text === exactName || normalizeLookup(candidate) === normalized;
    });
  });

  if (!component) {
    throw new Error(
      `Component "${name}" was not found. Run list_components first.`
    );
  }

  return component;
}

async function readComponentDetail(
  name: string,
  options: { includeSource?: boolean; includeStory?: boolean }
): Promise<ComponentDetail> {
  const component = await resolveComponent(name);
  const detail: ComponentDetail = { ...component };

  if (options.includeSource) {
    const sourcePath = join(PROJECT_ROOT, component.sourcePath);
    detail.source = limitFile(sourcePath, await readTextFile(sourcePath));
  }

  if (options.includeStory && component.storyPath) {
    const storyPath = join(PROJECT_ROOT, component.storyPath);
    detail.story = limitFile(storyPath, await readTextFile(storyPath));
  }

  return detail;
}

function jsonToolResult(value: unknown): CallToolResult {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(value, null, 2),
      },
    ],
  };
}

function textToolResult(text: string): CallToolResult {
  return {
    content: [
      {
        type: 'text',
        text,
      },
    ],
  };
}

async function getDesignTokens() {
  const cssPath = join(PROJECT_ROOT, 'src/styles/globals.css');
  const css = await readTextFile(cssPath);
  const variables = [...css.matchAll(/--([A-Za-z0-9-_]+)\s*:\s*([^;]+);/g)].map(
    (match) => ({
      name: `--${match[1]}`,
      value: match[2].trim(),
    })
  );

  return {
    sourcePath: fromProjectRoot(cssPath),
    count: variables.length,
    variables,
  };
}

async function componentIndexResource(uri: URL): Promise<ReadResourceResult> {
  const components = await buildComponentIndex();

  return {
    contents: [
      {
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify({ components }, null, 2),
      },
    ],
  };
}

async function designTokensResource(uri: URL): Promise<ReadResourceResult> {
  return {
    contents: [
      {
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify(await getDesignTokens(), null, 2),
      },
    ],
  };
}

function firstTemplateVariable(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

async function componentResource(
  uri: URL,
  variables: Variables
): Promise<ReadResourceResult> {
  const name = firstTemplateVariable(variables.name);
  if (!name) {
    throw new Error('Missing component name in resource URI.');
  }

  const component = await readComponentDetail(name, {
    includeSource: true,
    includeStory: true,
  });

  return {
    contents: [
      {
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify(component, null, 2),
      },
    ],
  };
}

export function createTeamhelperUiMcpServer() {
  const server = new McpServer({
    name: 'teamhelper-ui-mcp',
    version: '0.1.0',
  });

  server.registerTool(
    'list_components',
    {
      title: 'List Teamhelper UI components',
      description:
        'List components discovered from src/components/ui, src/components/enhance-ui, and matching Storybook stories.',
      inputSchema: {
        query: z
          .string()
          .optional()
          .describe(
            'Optional case-insensitive filter for id, name, export, story title, or path.'
          ),
        layer: z
          .enum(['ui', 'enhance-ui'])
          .optional()
          .describe('Optional component layer filter.'),
      },
    },
    async ({ query, layer }) => {
      const components = filterComponents(
        await buildComponentIndex(),
        query
      ).filter((component) => !layer || component.layer === layer);

      return jsonToolResult({
        count: components.length,
        components,
      });
    }
  );

  server.registerTool(
    'get_component',
    {
      title: 'Get a Teamhelper UI component',
      description:
        'Return one component metadata and optionally include its source file and Storybook story source.',
      inputSchema: {
        name: z
          .string()
          .describe(
            'Component id, component name, source path, export name, or prop type name.'
          ),
        includeSource: z
          .boolean()
          .optional()
          .describe('Include the component source text. Defaults to false.'),
        includeStory: z
          .boolean()
          .optional()
          .describe(
            'Include the matching Storybook story text. Defaults to true.'
          ),
      },
    },
    async ({ name, includeSource = false, includeStory = true }) =>
      jsonToolResult(
        await readComponentDetail(name, { includeSource, includeStory })
      )
  );

  server.registerTool(
    'get_design_tokens',
    {
      title: 'Get design tokens',
      description: 'Read CSS custom properties from src/styles/globals.css.',
      inputSchema: {},
    },
    async () => jsonToolResult(await getDesignTokens())
  );

  server.registerTool(
    'explain_mcp_server',
    {
      title: 'Explain this MCP server',
      description:
        'Explain how this local MCP server is structured and what each tool/resource does.',
      inputSchema: {},
    },
    async () =>
      textToolResult(`This MCP server connects an AI client to @teamhelper/ui over stdio.

Tools:
- list_components: builds a live component index from src/components/ui, src/components/enhance-ui, and stories.
- get_component: returns one component plus optional source and Storybook example text.
- get_design_tokens: reads CSS variables from src/styles/globals.css.
- explain_mcp_server: explains the server itself.

Resources:
- teamhelper-ui://components returns the component index as JSON.
- teamhelper-ui://design-tokens returns design tokens as JSON.
- teamhelper-ui://component/{name} returns one component detail as JSON.

The server is intentionally read-only. It gives an LLM accurate local context without allowing code edits.`)
  );

  server.registerResource(
    'component-index',
    'teamhelper-ui://components',
    {
      title: 'Teamhelper UI Component Index',
      description:
        'Component metadata discovered from source files and Storybook stories.',
      mimeType: 'application/json',
    },
    componentIndexResource
  );

  server.registerResource(
    'design-tokens',
    'teamhelper-ui://design-tokens',
    {
      title: 'Teamhelper UI Design Tokens',
      description: 'CSS custom properties from src/styles/globals.css.',
      mimeType: 'application/json',
    },
    designTokensResource
  );

  server.registerResource(
    'component-detail',
    new ResourceTemplate('teamhelper-ui://component/{name}', {
      list: async () => {
        const components = await buildComponentIndex();
        return {
          resources: components.map((component) => ({
            uri: `teamhelper-ui://component/${component.id}`,
            name: component.id,
            title: component.name,
            description: component.storyTitle ?? component.sourcePath,
            mimeType: 'application/json',
          })),
        };
      },
      complete: {
        name: async (value) => {
          const normalized = value.toLowerCase();
          const components = await buildComponentIndex();
          return components
            .map((component) => component.id)
            .filter((id) => id.toLowerCase().includes(normalized))
            .slice(0, 20);
        },
      },
    }),
    {
      title: 'Teamhelper UI Component Detail',
      description:
        'One component detail with source and matching Storybook story.',
      mimeType: 'application/json',
    },
    componentResource
  );

  server.registerPrompt(
    'teamhelper-ui-usage',
    {
      title: 'Generate Teamhelper UI usage',
      description:
        'Prompt template for generating code that uses one Teamhelper UI component with local source context.',
      argsSchema: {
        componentName: z
          .string()
          .describe('Component id or export name, for example ui/button.'),
        scenario: z
          .string()
          .optional()
          .describe('What the user wants to build with the component.'),
      },
    },
    async ({ componentName, scenario }): Promise<GetPromptResult> => {
      const component = await readComponentDetail(componentName, {
        includeSource: true,
        includeStory: true,
      });

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Use @teamhelper/ui to build this scenario: ${
                scenario ?? 'show a practical component usage example'
              }.

Component context:
${JSON.stringify(component, null, 2)}

Follow the component API and Storybook patterns exactly. Prefer existing exports from @teamhelper/ui.`,
            },
          },
        ],
      };
    }
  );

  return server;
}

async function main() {
  const server = createTeamhelperUiMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Teamhelper UI MCP server is running over stdio.');
}

const isEntrypoint =
  typeof process.argv[1] === 'string' &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isEntrypoint) {
  main().catch((error: unknown) => {
    console.error('Teamhelper UI MCP server failed:', error);
    process.exit(1);
  });
}
