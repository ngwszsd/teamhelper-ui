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

console.log(`🔍 Analyzing bundle size for ${name} v${version}...`);

try {
  // 检查是否已构建，避免重复构建
  const buildInfoPath = join(rootDir, 'dist', 'build-info.json');
  let shouldBuild = false;

  try {
    const buildInfo = JSON.parse(readFileSync(buildInfoPath, 'utf8'));
    // 简单检查关键文件是否存在
    for (const file of ['dist/index.js', 'dist/index.esm.js']) {
      try {
        readFileSync(join(rootDir, file));
      } catch {
        shouldBuild = true;
        break;
      }
    }

    if (!shouldBuild) {
      console.log('✅ Build already complete, skipping build step...');
    }
  } catch {
    shouldBuild = true;
  }

  if (shouldBuild) {
    console.log('📦 Ensuring build is complete...');
    execSync('npm run build', {
      cwd: rootDir,
      stdio: 'inherit',
    });
  }

  // 分析 dist 文件夹大小
  console.log('📊 Analyzing bundle size...');

  const distFiles = ['dist/index.js', 'dist/index.esm.js', 'dist/index.d.ts'];

  let totalSize = 0;
  const fileSizes = {};

  for (const file of distFiles) {
    try {
      const stats = statSync(join(rootDir, file));
      const size = stats.size;
      const sizeKB = (size / 1024).toFixed(2);

      fileSizes[file] = {
        bytes: size,
        kb: sizeKB,
        gzipped: null, // 可以添加gzip压缩后的size
      };

      totalSize += size;
      console.log(`  ${file}: ${sizeKB} KB`);
    } catch (error) {
      console.warn(`  ⚠️  ${file} not found`);
    }
  }

  const totalKB = (totalSize / 1024).toFixed(2);

  // 生成分析报告
  const analysis = {
    name,
    version,
    analysisTime: new Date().toISOString(),
    totalSize: {
      bytes: totalSize,
      kb: totalKB,
    },
    files: fileSizes,
    recommendations: [],
  };

  // 添加建议
  if (totalSize > 50 * 1024) {
    // 大于50KB
    analysis.recommendations.push('Consider code splitting or tree shaking');
  }

  if (totalSize > 100 * 1024) {
    // 大于100KB
    analysis.recommendations.push(
      'Bundle size is quite large - review dependencies'
    );
  }

  // 保存分析结果
  writeFileSync(
    join(rootDir, 'dist', 'bundle-analysis.json'),
    JSON.stringify(analysis, null, 2)
  );

  console.log(`\n📈 Bundle Analysis Summary:`);
  console.log(`   Total Size: ${totalKB} KB`);
  console.log(`   Files Analyzed: ${Object.keys(fileSizes).length}`);

  if (analysis.recommendations.length > 0) {
    console.log(`\n💡 Recommendations:`);
    analysis.recommendations.forEach((rec) => {
      console.log(`   • ${rec}`);
    });
  }

  console.log(`\n📋 Full analysis saved to: dist/bundle-analysis.json`);
} catch (error) {
  console.error('\n❌ Bundle analysis failed:', error.message);
  process.exit(1);
}
