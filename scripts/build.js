#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const packageJsonPath = join(rootDir, 'package.json');

// 读取 package.json
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const { name, version } = packageJson;

console.log(`🔨 Building ${name} v${version}...`);

const startTime = Date.now();

try {
  // 1. 清理旧的构建产物
  console.log('🧹 Cleaning old build files...');
  const distDir = join(rootDir, 'dist');
  try {
    rmSync(distDir, { recursive: true, force: true });
  } catch (error) {
    // 如果目录不存在，忽略错误
  }

  // 2. 运行 Rollup 构建
  console.log('📦 Running Rollup build...');
  execSync('npm run build:rollup', {
    cwd: rootDir,
    stdio: 'inherit',
  });

  // 3. 验证构建结果
  console.log('✅ Verifying build output...');
  const expectedFiles = [
    'dist/index.js',
    'dist/index.esm.js',
    'dist/index.d.ts',
  ];

  for (const file of expectedFiles) {
    const filePath = join(rootDir, file);
    try {
      statSync(filePath);
      console.log(`  ✓ ${file} generated`);
    } catch (error) {
      console.error(`  ✗ ${file} missing`);
      throw new Error(`Build verification failed: ${file} not found`);
    }
  }

  // 4. 生成构建信息
  const buildInfo = {
    name,
    version,
    buildTime: new Date().toISOString(),
    files: expectedFiles,
    fileSizes: {},
  };

  // 计算文件大小
  for (const file of expectedFiles) {
    const filePath = join(rootDir, file);
    try {
      const stats = statSync(filePath);
      buildInfo.fileSizes[file] = {
        bytes: stats.size,
        kb: (stats.size / 1024).toFixed(2),
      };
    } catch (error) {
      // 文件不存在时跳过
    }
  }

  writeFileSync(
    join(rootDir, 'dist', 'build-info.json'),
    JSON.stringify(buildInfo, null, 2)
  );

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n🎉 Build completed successfully!`);
  console.log(`📊 Build info:`);
  console.log(`   Package: ${name}`);
  console.log(`   Version: ${version}`);
  console.log(`   Time: ${buildInfo.buildTime}`);
  console.log(`   Duration: ${duration}s`);
  console.log(`\n📄 Generated files:`);
  for (const [file, info] of Object.entries(buildInfo.fileSizes)) {
    console.log(`   ${file}: ${info.kb} KB`);
  }
  console.log(`\n📦 Ready for npm publish!`);
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  if (error.stack) {
    console.error('\nStack trace:', error.stack);
  }
  process.exit(1);
}
