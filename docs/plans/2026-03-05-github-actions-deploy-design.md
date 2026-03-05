# GitHub Actions 自动部署到 GitHub Pages 设计文档

## 项目概述

为苍翼混沌效应构建器项目创建 GitHub Actions 工作流，实现推送到 `main` 分支后自动构建并部署到 GitHub Pages。

---

## 1. 架构

```
.github/
└── workflows/
    └── deploy-to-pages.yml    # 工作流定义文件

工作流结构：
┌─────────────────────────────────────┐
│  Trigger: push to main              │
├─────────────────────────────────────┤
│  Job: build-and-deploy              │
│  ├─ Checkout code                   │
│  ├─ Setup pnpm + Node.js            │
│  ├─ Install dependencies (cached)   │
│  ├─ Build (pnpm run build)          │
│  └─ Deploy to page branch           │
└─────────────────────────────────────┘
```

**关键配置：**
- Runner: `ubuntu-latest`
- Node 版本: 20（LTS）
- 部署 Action: `peaceiris/actions-gh-pages@v4`

---

## 2. 组件（工作流步骤）

| 步骤 | Action/命令 | 说明 |
|------|-------------|------|
| 1. Checkout | `actions/checkout@v4` | 检出 `main` 分支代码 |
| 2. Setup pnpm | `pnpm/action-setup@v4` | 安装 pnpm |
| 3. Setup Node | `actions/setup-node@v4` | 安装 Node.js，使用 pnpm 缓存 |
| 4. Install deps | `pnpm install` | 安装项目依赖 |
| 5. Build | `pnpm run build` | 运行 Vite 构建 |
| 6. Deploy | `peaceiris/actions-gh-pages@v4` | 部署到 `page` 分支 |

**关键配置细节：**
- `permissions.contents: write`：允许写入分支
- `deploy.force_orphan: true`：覆盖模式
- 构建产物目录：`dist`

---

## 3. 数据流

```
推送代码到 main 分支
        ↓
触发 GitHub Actions 工作流
        ↓
检出代码 (actions/checkout@v4)
        ↓
设置 pnpm 环境 (pnpm/action-setup@v4)
        ↓
设置 Node.js (actions/setup-node@v4)
        ↓
缓存命中？ → 是 → 跳过依赖安装
    ↓ 否
pnpm install（下载依赖）
        ↓
pnpm run build（构建项目）
   - vue-tsc（类型检查）
   - vite build（生成静态文件）
        ↓
构建产物 → dist/ 目录
        ↓
peaceiris/actions-gh-pages@v4
   - 检出/创建 page 分支
   - 复制 dist/ 内容
   - 强制推送（覆盖历史）
        ↓
GitHub Pages 自动部署更新
```

---

## 4. 错误处理

| 可能的错误场景 | 处理策略 |
|----------------|----------|
| 构建失败 | `pnpm run build` 失败 → 工作流终止 |
| 依赖安装失败 | 工作流失败，通知用户 |
| 部署权限不足 | `permissions: contents: write` 前置声明 |
| 分支不存在 | `actions-gh-pages` 自动创建 `page` 分支 |
| 网络问题 | GitHub Actions 内置重试机制 |
| GitHub Pages 未启用 | 需用户手动设置 Pages Source |

---

## 5. 测试

| 测试类型 | 验证内容 |
|----------|----------|
| 构建验证 | 确保 `pnpm run build` 成功 |
| 产物验证 | 确保 `dist/` 目录生成且非空 |
| 端到端测试 | 部署后访问页面验证 |
| 缓存测试 | 验证 pnpm 缓存生效 |

**测试步骤：**
1. 推送代码到 `main` 分支
2. 进入仓库 Actions 标签页，观察工作流执行
3. 确认所有步骤 ✅
4. 访问仓库 Settings > Pages，设置 Source 为 `page` 分支
5. 等待几分钟后访问部署的 URL

---

## 6. 使用说明

### 部署后配置

1. 前往 GitHub 仓库页面
2. 点击 Settings → Pages
3. Source 选择 **Deploy from a branch**
4. Branch 选择 **page** → **/(root)**
5. 点击 Save

### 访问地址

部署成功后，页面可通过以下地址访问：

```
https://<username>.github.io/<repository-name>/
```

---

## 设计决策记录

| 决策 | 选择 | 理由 |
|------|------|------|
| 触发条件 | push to main | 只在主分支推送时触发，避免频繁构建 |
| 部署模式 | 覆盖模式 (force_orphan) | 只保留最新版本，减少仓库体积 |
| 依赖缓存 | pnpm/action-setup 内置缓存 | 配置简单，速度快 |
| 部署工具 | peaceiris/actions-gh-pages | 社区成熟方案，维护成本低 |

---

*设计日期: 2026-03-05*
