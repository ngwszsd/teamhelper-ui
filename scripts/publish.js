#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const packageJsonPath = join(rootDir, 'package.json');

// 读取 package.json
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const { name, version } = packageJson;

// 创建 readline 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log(`🚀 一键发布工具 - ${name} v${version}`);
  console.log('');

  try {
    // 步骤 1: 选择发布类型
    console.log('📋 请选择发布类型：');
    console.log('  1️⃣ patch  - 修复版本 (1.0.0 → 1.0.1)');
    console.log('  2️⃣ minor  - 小版本 (1.0.0 → 1.1.0)');
    console.log('  3️⃣ major  - 大版本 (1.0.0 → 2.0.0)');
    console.log('  4️⃣ 自定义版本号');
    console.log('  5️⃣ 仅构建，不发布');

    const choice = await question('请选择 (1-5): ');

    let versionType;
    let customVersion;

    switch (choice) {
      case '1':
        versionType = 'patch';
        break;
      case '2':
        versionType = 'minor';
        break;
      case '3':
        versionType = 'major';
        break;
      case '4':
        customVersion = await question('请输入版本号 (如 1.2.3): ');
        if (!/^\d+\.\d+\.\d+/.test(customVersion)) {
          throw new Error('版本号格式错误，应为 x.y.z 格式');
        }
        break;
      case '5':
        console.log('🔨 开始仅构建模式...');
        await buildOnly();
        return;
      default:
        throw new Error('无效的选择');
    }

    // 步骤 2: 确认发布
    const targetVersion = customVersion || getNextVersion(version, versionType);
    console.log('');
    console.log(`📝 发布信息确认：`);
    console.log(`   包名: ${name}`);
    console.log(`   当前版本: ${version}`);
    console.log(`   目标版本: ${targetVersion}`);
    console.log('');

    const confirm = await question('确认发布吗? (y/N): ');
    if (confirm.toLowerCase() !== 'y') {
      console.log('❌ 发布已取消');
      return;
    }

    // 步骤 3: 执行发布流程
    console.log('');
    console.log('🔄 开始发布流程...');

    // 3.1 清理和构建
    console.log('🧹 清理旧的构建产物...');
    execSync('npm run clean', { cwd: rootDir, stdio: 'inherit' });

    console.log('🔍 类型检查...');
    execSync('npm run type-check', { cwd: rootDir, stdio: 'inherit' });

    console.log('🔨 构建项目...');
    execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

    // 3.2 包分析（仅 UI 包）
    if (name.includes('ui')) {
      console.log('📊 包大小分析...');
      execSync('node scripts/analyze-bundle.js', {
        cwd: rootDir,
        stdio: 'inherit',
      });
    }

    // 3.3 版本更新
    if (customVersion) {
      console.log(`📝 更新版本到 ${customVersion}...`);
      execSync(`npm version ${customVersion} --no-git-tag-version`, {
        cwd: rootDir,
        stdio: 'inherit',
      });
    } else {
      console.log(`📝 更新版本 (${versionType})...`);
      execSync(`npm version ${versionType}`, {
        cwd: rootDir,
        stdio: 'inherit',
      });
    }

    // 3.4 最终确认
    console.log('');
    console.log('✅ 构建和版本更新完成！');
    console.log('🚀 准备发布到 npm...');

    const finalConfirm = await question('确认发布到 npm 吗? (y/N): ');
    if (finalConfirm.toLowerCase() !== 'y') {
      console.log('❌ 发布已取消，但版本已更新');
      return;
    }

    // 3.5 发布
    console.log('📦 发布到 npm...');
    execSync('npm publish --access public', { cwd: rootDir, stdio: 'inherit' });

    console.log('');
    console.log('🎉 发布成功！');
    console.log(`📦 ${name}@${targetVersion} 已发布到 npm`);
    console.log('');
    console.log('🔗 后续操作：');
    console.log(`   查看包: npm view ${name}`);
    console.log(`   安装测试: npm install ${name}`);
  } catch (error) {
    console.error('');
    console.error('❌ 发布失败:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

async function buildOnly() {
  try {
    console.log('🧹 清理旧的构建产物...');
    execSync('npm run clean', { cwd: rootDir, stdio: 'inherit' });

    console.log('🔍 类型检查...');
    execSync('npm run type-check', { cwd: rootDir, stdio: 'inherit' });

    console.log('🔨 构建项目...');
    execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

    if (name.includes('ui')) {
      console.log('📊 包大小分析...');
      execSync('node scripts/analyze-bundle.js', {
        cwd: rootDir,
        stdio: 'inherit',
      });
    }

    console.log('');
    console.log('✅ 构建完成！');
    console.log('📁 构建产物在 dist/ 目录中');
  } catch (error) {
    console.error('❌ 构建失败:', error.message);
    process.exit(1);
  }
}

function getNextVersion(currentVersion, type) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`未知的版本类型: ${type}`);
  }
}

main().catch((error) => {
  console.error('程序错误:', error);
  process.exit(1);
});
