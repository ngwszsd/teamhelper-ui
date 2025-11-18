import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig([
  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs({
        ignoreDynamicRequires: true,
      }),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.tsx', '**/*.test.ts', '**/*.stories.tsx'],
      }),
      postcss({
        extensions: ['.css', '.scss', '.sass'],
        minimize: true,
        extract: 'index.css', // 提取CSS到单独文件
      }),
    ],
    external: ['react', 'react-dom'],
    onwarn(warning, warn) {
      // 忽略 "use client" 指令警告
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
        return;
      }
      warn(warning);
    },
  },
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs({
        ignoreDynamicRequires: true,
      }),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.tsx', '**/*.test.ts', '**/*.stories.tsx'],
      }),
      postcss({
        extensions: ['.css', '.scss', '.sass'],
        minimize: true,
        extract: 'index.css', // 提取CSS到单独文件
      }),
    ],
    external: ['react', 'react-dom'],
    onwarn(warning, warn) {
      // 忽略 "use client" 指令警告
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
        return;
      }
      warn(warning);
    },
  },

  // Type definitions
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/],
  },
]);
