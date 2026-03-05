# GitHub Actions 自动部署到 GitHub Pages 实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 创建 GitHub Actions 工作流，在推送到 main 分支后自动构建并部署到 GitHub Pages

**架构:** 使用 GitHub Actions 工作流，在 Ubuntu 运行器上执行 pnpm 安装、构建，然后通过 peaceiris/actions-gh-pages Action 将 dist 目录部署到 page 分支

**Tech Stack:** GitHub Actions, pnpm, Node.js 20, Vite, peaceiris/actions-gh-pages

---

## Task 1: 创建工作流目录结构

**Files:**
- Create: `.github/workflows/` 目录

**Step 1: 创建工作流目录**

Run:
```bash
mkdir -p .github/workflows
```

Expected: 目录创建成功

**Step 2: 验证目录创建**

Run:
```bash
dir .github\workflows
```

Expected: 显示目录存在（可能为空）

**Step 3: Commit**

```bash
git add .github/workflows/
git commit -m "chore: add github workflows directory"
```

---

## Task 2: 编写 GitHub Actions 工作流文件

**Files:**
- Create: `.github/workflows/deploy-to-pages.yml`

**Step 1: 创建工作流文件**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: latest

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          publish_branch: page
          force_orphan: true
```

**Step 2: 验证文件内容**

Run:
```bash
type .github\workflows\deploy-to-pages.yml
```

Expected: 显示完整的 YAML 内容

**Step 3: 验证 YAML 语法**

检查要点：
- 缩进使用 2 个空格
- `on:` 正确配置为 push 到 main 分支
- `permissions.contents: write` 声明正确
- `jobs.build-and-deploy.runs-on: ubuntu-latest`
- `actions/checkout@v4` 用于检出代码
- `pnpm/action-setup@v4` 用于设置 pnpm
- `actions/setup-node@v4` 用于设置 Node.js 20
- `peaceiris/actions-gh-pages@v4` 配置正确：
  - `publish_dir: ./dist`
  - `publish_branch: page`
  - `force_orphan: true`

**Step 4: Commit**

```bash
git add .github/workflows/deploy-to-pages.yml
git commit -m "feat: add github actions workflow for deploying to pages

- Trigger on push to main branch
- Build with pnpm and Node.js 20
- Deploy dist folder to page branch using peaceiris/actions-gh-pages"
```

---

## Task 3: 推送工作流到远程仓库

**Files:**
- Modify: 远程仓库 refs

**Step 1: 推送 main 分支**

Run:
```bash
git push origin main
```

Expected: 推送成功，包含工作流文件

**Step 2: 验证远程仓库**

访问 GitHub 仓库页面，确认：
- `.github/workflows/deploy-to-pages.yml` 文件存在
- 文件内容正确

---

## Task 4: 配置 GitHub Pages（手动步骤）

**Files:**
- 无需修改文件，在 GitHub Web 界面配置

**Step 1: 访问仓库设置**

1. 打开浏览器访问仓库页面
2. 点击 Settings 标签
3. 左侧导航点击 Pages

**Step 2: 配置 Pages 源**

1. Source 选择 **Deploy from a branch**
2. Branch 选择 **page** → **/(root)**
3. 点击 Save

**Step 3: 验证配置**

配置成功后，页面显示：
```
Your site is ready to be published at https://<username>.github.io/<repo>/
```

---

## Task 5: 测试工作流

**Files:**
- 无需修改文件，验证工作流执行

**Step 1: 触发工作流**

在本地创建一个测试提交并推送：

```bash
echo "# Test deployment" >> README.md
git add README.md
git commit -m "test: trigger github actions workflow"
git push origin main
```

**Step 2: 监控工作流执行**

1. 访问 GitHub 仓库页面
2. 点击 Actions 标签
3. 找到 "Deploy to GitHub Pages" 工作流
4. 确认工作流正在运行或已完成

**Step 3: 验证工作流结果**

工作流成功后：
- 所有步骤显示绿色 ✅
- Build 步骤成功生成 dist 目录
- Deploy 步骤成功推送到 page 分支

**Step 4: 验证 Pages 部署**

1. 等待 1-2 分钟
2. 访问 Settings → Pages
3. 确认显示部署成功的消息
4. 点击访问链接验证页面正常加载

**Step 5: 清理测试提交（可选）**

如果测试成功，可以回滚测试提交：

```bash
git reset --hard HEAD~1
git push origin main --force
```

注意：这会移除测试提交，重新触发工作流。

---

## 验证清单

实施完成后，确认以下项目：

- [ ] `.github/workflows/deploy-to-pages.yml` 文件存在
- [ ] 工作流文件 YAML 语法正确
- [ ] 推送到 main 分支后 Actions 自动触发
- [ ] pnpm 安装成功（有缓存提示）
- [ ] `pnpm run build` 执行成功
- [ ] `page` 分支被创建/更新
- [ ] GitHub Pages 配置为从 `page` 分支部署
- [ ] 网站可通过 `https://<username>.github.io/<repo>/` 访问

---

## 故障排除

### 问题 1：工作流未触发

**原因：** 可能是 YAML 语法错误或触发条件不匹配

**解决：**
1. 检查 Actions 标签页是否有错误提示
2. 验证 YAML 缩进和语法
3. 确认推送的是 main 分支

### 问题 2：构建失败

**原因：** 依赖问题或构建错误

**解决：**
1. 查看 Actions 日志中的错误信息
2. 本地运行 `pnpm run build` 验证
3. 检查 `package.json` 中的 build 脚本

### 问题 3：部署成功但页面 404

**原因：** GitHub Pages 配置未正确设置

**解决：**
1. 确认 Settings → Pages 中 Source 设置为 `page` 分支
2. 确认 `page` 分支存在且包含构建产物
3. 等待 1-2 分钟后刷新页面

### 问题 4：缓存未生效

**原因：** pnpm 缓存配置问题

**解决：**
1. 检查 Actions 日志中的 "Cache" 部分
2. 确认 `cache: 'pnpm'` 配置正确
3. 首次运行后会建立缓存，后续运行会使用缓存

---

*实施计划创建日期: 2026-03-05*
