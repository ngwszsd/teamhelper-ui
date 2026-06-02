import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type TextToolResult = {
  content?: Array<{
    type?: string;
    text?: string;
  }>;
};

type TextResourceResult = {
  contents?: Array<{
    text?: string;
  }>;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

function hasContent(value: unknown): value is TextToolResult {
  return typeof value === 'object' && value !== null && 'content' in value;
}

function hasContents(value: unknown): value is TextResourceResult {
  return typeof value === 'object' && value !== null && 'contents' in value;
}

function firstToolText(result: unknown) {
  if (!hasContent(result)) {
    return '';
  }

  return result.content?.find((item) => item.type === 'text')?.text ?? '';
}

function firstResourceText(result: unknown) {
  if (!hasContents(result)) {
    return '';
  }

  return (
    result.contents?.find((item) => typeof item.text === 'string')?.text ?? ''
  );
}

async function main() {
  const transport = new StdioClientTransport({
    command: 'pnpm',
    args: ['exec', 'tsx', 'mcp/server.ts'],
    cwd: projectRoot,
    stderr: 'pipe',
  });

  transport.stderr?.on('data', (chunk) => {
    process.stderr.write(`[server] ${chunk}`);
  });

  const client = new Client({
    name: 'teamhelper-ui-mcp-smoke-test',
    version: '0.1.0',
  });

  try {
    await client.connect(transport);

    const tools = await client.listTools();
    console.log(`tools: ${tools.tools.map((tool) => tool.name).join(', ')}`);

    const components = await client.callTool({
      name: 'list_components',
      arguments: { query: 'button' },
    });
    console.log(
      `list_components sample:\n${firstToolText(components).slice(0, 1200)}`
    );

    const button = await client.callTool({
      name: 'get_component',
      arguments: {
        name: 'ui/button',
        includeSource: true,
        includeStory: true,
      },
    });
    console.log(
      `get_component sample:\n${firstToolText(button).slice(0, 1200)}`
    );

    const resource = await client.readResource({
      uri: 'teamhelper-ui://design-tokens',
    });
    console.log(
      `design-tokens resource sample:\n${firstResourceText(resource).slice(0, 1200)}`
    );
  } finally {
    await client.close();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
