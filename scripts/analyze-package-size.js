#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdirSync, statSync, readFileSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('📦 NPM Package Size Analysis\n');
console.log('═══════════════════════════════════════════════════════════\n');

// 递归获取所有文件
function getAllFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push({
        path: filePath,
        relativePath: filePath.replace(rootDir + '/', ''),
        size: stat.size,
        ext: extname(file),
      });
    }
  });

  return fileList;
}

// 分析 dist 目录
const distDir = join(rootDir, 'dist');
const allFiles = getAllFiles(distDir);

// 按文件类型分组
const filesByType = {};
let totalSize = 0;

allFiles.forEach((file) => {
  const ext = file.ext || 'no-ext';
  if (!filesByType[ext]) {
    filesByType[ext] = {
      count: 0,
      size: 0,
      files: [],
    };
  }
  filesByType[ext].count++;
  filesByType[ext].size += file.size;
  filesByType[ext].files.push(file);
  totalSize += file.size;
});

// 显示总体信息
console.log('📊 总体统计:\n');
console.log(`   总文件数: ${allFiles.length}`);
console.log(
  `   总大小:   ${(totalSize / 1024).toFixed(2)} KB (${(totalSize / 1024 / 1024).toFixed(2)} MB)`
);
console.log('');

// 按文件类型显示
console.log('📁 按文件类型分组:\n');

const sortedTypes = Object.entries(filesByType).sort(
  (a, b) => b[1].size - a[1].size
);

sortedTypes.forEach(([ext, data]) => {
  const sizeKB = (data.size / 1024).toFixed(2);
  const percentage = ((data.size / totalSize) * 100).toFixed(1);
  const bar = '█'.repeat(Math.ceil(parseFloat(percentage) / 2));

  console.log(
    `   ${ext.padEnd(10)} ${data.count.toString().padStart(4)} 个文件  ${sizeKB.padStart(8)} KB  ${percentage.padStart(5)}%  ${bar}`
  );
});

console.log('');

// 显示最大的文件
console.log('📈 Top 20 最大文件:\n');

const sortedFiles = allFiles.sort((a, b) => b.size - a.size).slice(0, 20);

sortedFiles.forEach((file, index) => {
  const sizeKB = (file.size / 1024).toFixed(2);
  console.log(
    `   ${(index + 1).toString().padStart(2)}. ${file.relativePath.padEnd(60)} ${sizeKB.padStart(8)} KB`
  );
});

console.log('');

// 检查可优化项
console.log('💡 优化建议:\n');

const suggestions = [];

// 检查 .d.ts.map 文件
const mapFiles = filesByType['.map'];
if (mapFiles && mapFiles.size > 0) {
  const mapSizeKB = (mapFiles.size / 1024).toFixed(2);
  const mapPercentage = ((mapFiles.size / totalSize) * 100).toFixed(1);
  suggestions.push({
    priority: 1,
    title: '移除 TypeScript 声明文件的 source map',
    detail: `${mapFiles.count} 个 .d.ts.map 文件占用 ${mapSizeKB} KB (${mapPercentage}%)`,
    action: '在 tsconfig.json 中设置 "declarationMap": false',
    savings: mapSizeKB + ' KB',
  });
}

// 检查是否有 .js.map 文件
const jsMapFiles = allFiles.filter((f) => f.relativePath.endsWith('.js.map'));
if (jsMapFiles.length > 0) {
  const jsMapSize = jsMapFiles.reduce((sum, f) => sum + f.size, 0);
  const jsMapSizeKB = (jsMapSize / 1024).toFixed(2);
  suggestions.push({
    priority: 1,
    title: '移除 JavaScript source map',
    detail: `${jsMapFiles.length} 个 .js.map 文件占用 ${jsMapSizeKB} KB`,
    action: '在 rslib.config.ts 中禁用 source map',
    savings: jsMapSizeKB + ' KB',
  });
}

// 检查重复的 ESM 和 CJS 文件
const jsFiles = filesByType['.js'];
const cjsFiles = filesByType['.cjs'];
if (jsFiles && cjsFiles) {
  const jsSizeKB = (jsFiles.size / 1024).toFixed(2);
  const cjsSizeKB = (cjsFiles.size / 1024).toFixed(2);
  suggestions.push({
    priority: 3,
    title: 'ESM 和 CJS 双格式输出',
    detail: `ESM: ${jsSizeKB} KB, CJS: ${cjsSizeKB} KB`,
    action: '这是正常的，支持不同的模块系统',
    savings: '0 KB (必要的)',
  });
}

// 检查 build-info.json
const buildInfo = allFiles.find((f) =>
  f.relativePath.includes('build-info.json')
);
if (buildInfo) {
  suggestions.push({
    priority: 2,
    title: '移除 build-info.json',
    detail: `${(buildInfo.size / 1024).toFixed(2)} KB`,
    action: '在 package.json files 字段中排除',
    savings: (buildInfo.size / 1024).toFixed(2) + ' KB',
  });
}

// 按优先级排序并显示
suggestions.sort((a, b) => a.priority - b.priority);

suggestions.forEach((s, index) => {
  console.log(`   ${index + 1}. ${s.title}`);
  console.log(`      详情: ${s.detail}`);
  console.log(`      操作: ${s.action}`);
  console.log(`      节省: ${s.savings}`);
  console.log('');
});

// 计算优化后的大小
const totalSavings = suggestions
  .filter((s) => s.savings !== '0 KB (必要的)')
  .reduce((sum, s) => {
    const kb = parseFloat(s.savings);
    return sum + (isNaN(kb) ? 0 : kb);
  }, 0);

console.log('═══════════════════════════════════════════════════════════\n');
console.log('📦 优化潜力:\n');
console.log(`   当前大小: ${(totalSize / 1024).toFixed(2)} KB`);
console.log(`   可节省:   ${totalSavings.toFixed(2)} KB`);
console.log(`   优化后:   ${(totalSize / 1024 - totalSavings).toFixed(2)} KB`);
console.log(
  `   减少:     ${((totalSavings / (totalSize / 1024)) * 100).toFixed(1)}%`
);
console.log('');

// 生成 .npmignore 建议
console.log('📝 建议的 .npmignore 内容:\n');
console.log('   # 开发文件');
console.log('   src/');
console.log('   scripts/');
console.log('   .storybook/');
console.log('   stories/');
console.log('   storybook-static/');
console.log('   ');
console.log('   # 配置文件');
console.log('   *.config.js');
console.log('   *.config.ts');
console.log('   tsconfig.json');
console.log('   components.json');
console.log('   ');
console.log('   # 构建产物中的非必要文件');
console.log('   dist/**/*.d.ts.map');
console.log('   dist/**/*.js.map');
console.log('   dist/build-info.json');
console.log('   dist/bundle-analysis.json');
console.log('   ');
console.log('   # 文档和测试');
console.log('   *.md');
console.log('   !README.md');
console.log('   .tree-shaking-test/');
console.log('');

console.log('═══════════════════════════════════════════════════════════\n');
