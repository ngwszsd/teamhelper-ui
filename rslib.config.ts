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
      // 确保这些依赖不会被打包到组件库
      autoExternal: {
        dependencies: true,
        peerDependencies: true,
      },
    },
    {
      bundle: false,
      format: 'cjs',
      autoExternal: {
        dependencies: true,
        peerDependencies: true,
      },
    },
  ],
});
