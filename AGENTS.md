# 苍翼混沌效应构建器 - 项目指南

## 项目概述

这是一个为游戏《苍翼：混沌效应》(BlazBlue: Entropy Effect) 开发的网页工具，帮助玩家筛选双重词条和构建流派配置。

**主要功能：**
- **双重词条筛选页**：根据属性/流派/触发位筛选符合条件的双重策略
- **流派构建页**：为5个技能位配置流派，自动计算可激活的双重策略

**在线访问：** 项目构建为静态网页，可部署到任何静态托管服务

---

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue | ^3.4.21 |
| 构建工具 | Vite | ^5.2.8 |
| 状态管理 | Pinia | ^2.1.7 |
| UI组件库 | Element Plus | ^2.6.3 |
| 路由 | Vue Router | ^4.3.0 |
| 样式 | SCSS | ^1.74.1 |
| 语言 | TypeScript | ^5.2.2 |

**浏览器兼容性**：支持 IE11+ (通过 `@vitejs/plugin-legacy`)

---

## 快速开始

### 开发环境

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 构建生产版本

```bash
# 类型检查 + 构建
pnpm build

# 预览生产构建
pnpm preview
```

---

## 项目结构

```
src/
├── components/           # 组件目录
│   ├── Public/          # 公共组件
│   │   └── PageHeader.vue       # 页面导航头部
│   ├── SearchDoublePage/        # 双重词条页组件
│   │   └── SearchDoubleEffectForm.vue
│   └── SectBuilderPage/         # 流派构建页组件
│       ├── ChangeSkillSectForm.vue   # 修改流派对话框

│       ├── SelectableSkillCard.vue   # 可选择技能卡片
│       └── SkillCard.vue             # 技能位卡片
├── config/
│   └── sectConfig.ts    # 属性到流派的映射配置
├── data/                # 数据文件目录
├── interfaces/          # TypeScript 类型定义
│   ├── Attribute.ts     # 属性类型：火/冰/电/毒/暗/光/刃
│   ├── Sect.ts          # 流派接口
│   ├── SkillInfoInterface.ts  # 双重技能信息接口
│   └── ...
├── router/
│   └── index.ts         # 路由配置（Hash模式）
├── store/               # Pinia 状态管理
│   ├── useSkillInfoStore.ts      # 技能数据存储（73条双重技能）
│   └── useSkillCardInfoStore.ts  # 技能位配置存储
├── views/               # 页面视图
│   ├── SearchDoublePage.vue      # 双重词条筛选页（路径：/）
│   └── SectBuilderPage.vue       # 流派构建页（路径：/builder）
├── App.vue              # 根组件
└── main.ts              # 应用入口
```

---

## 核心概念

### 技能位（5个固定位置）

| 技能位 | 说明 |
|--------|------|
| 普攻 | 普通攻击 |
| 技能 | 技能攻击 |
| 冲刺 | 冲刺技能 |
| 传承 | 传承技能 |
| 召唤 | 召唤技能 |

### 属性（7种元素）

`火`、`冰`、`电`、`毒`、`暗`、`光`、`刃`

### 流派（36种）

每个属性下有多个流派，例如火系有：`燃烧`、`火弹`、`火环`、`地雷`、`火精灵`

### 双重策略

当两个特定流派在正确的技能位组合时，会激活额外的双重策略效果。共73种双重策略。

---

## 状态管理

### useSkillInfoStore

存储所有双重技能的基础数据（73条），提供筛选和查询功能。

**核心数据：**
- `skillInfoList`: 双重技能列表
- `triggerInfoList`: 流派触发位映射

### useSkillCardInfoStore

管理用户在流派构建页的5个技能位配置。

**核心数据：**
- `skillCardInfoList`: 5个技能位的流派配置（含继承状态）

**主要方法：**
- `updateSkillCardInfo(trigger, sect)`: 更新技能位流派
- `updateSkillCardInfoInherit(trigger, inherit)`: 更新继承状态

---

## 路由说明

| 路径 | 页面 | 功能 |
|------|------|------|
| `/` | SearchDoublePage | 双重词条筛选 |
| `/builder` | SectBuilderPage | 流派构建器 |

使用 Hash 模式 (`createWebHashHistory`)，支持静态部署。

---

## 开发规范

### 组件开发

- 使用 `<script setup>` 语法
- 使用 Composition API 组织逻辑
- 组件命名使用 PascalCase
- 组件文件放在对应页面目录下

### 类型定义

- 所有类型定义放在 `src/interfaces/` 目录
- 使用严格的 TypeScript 类型约束
- 避免过多的类型断言

### 状态管理

- 使用 Pinia 管理全局状态
- Store 命名使用 `useXxxStore` 规范
- 读写分离：组件读取 Store，通过 Store 方法更新

---

## 配置文件

### vite.config.ts

- `base: './'` - 使用相对路径，支持任意目录部署
- 包含 legacy 插件配置，支持 IE11

### tsconfig.json

标准 Vue 3 + TypeScript 配置

---

## 数据来源

游戏中的双重策略数据来自 `docs/策略大全.md`，包含：

- 7大属性流派
- 36种具体流派
- 73种双重策略（含触发位、解锁条件、效果描述）

数据存储在 `src/data/SkillInfoList.json` 中，通过 `useSkillData` composable 动态加载。

---

## 待办事项

- [x] 筛选页：根据选择(属性/流派)筛选符合条件的双重词条
- [ ] 筛选页：添加技能位选择器，能根据对应技能位筛选
- [ ] 构建页：保存流派到技能位，自动过滤相斥流派

---

## 常见问题

### 如何添加新的双重策略？

1. 在 `useSkillInfoStore.ts` 中的 `skillInfoList` 数组添加新条目
2. 如果涉及新流派，同步更新 `triggerInfoList`
3. 在 `docs/策略大全.md` 中同步更新文档

### 如何修改技能位？

技能位是固定的5个（普攻/技能/冲刺/传承/召唤），如需修改需要：
1. 修改 `useSkillCardInfoStore.ts` 中的初始化逻辑
2. 修改相关组件中的触发位复选框

---

*文档生成时间: 2026-03-03*
