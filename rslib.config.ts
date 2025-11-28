import { defineConfig } from '@rslib/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: ['./src/**'],
    },
  },
  output: {
    target: 'web',
  },
  lib: [
    {
      bundle: false,
      dts: true,
      format: 'esm',
    },
    {
      bundle: false,
      format: 'cjs',
    },
  ],
});
