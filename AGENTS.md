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

**浏览器兼容性**：现代浏览器（Chrome, Firefox, Safari, Edge）

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
│   │   └── PageHeader.vue       # 页面导航头部（含主题切换）
│   ├── SearchDoublePage/        # 双重词条页组件
│   │   └── SearchDoubleEffectForm.vue  # 筛选表单与结果展示
│   └── SectBuilderPage/         # 流派构建页组件
│       ├── ChangeSkillSectForm.vue   # 修改流派对话框
│       ├── SelectableSkillCard.vue   # 可选择技能卡片
│       └── SkillCard.vue             # 技能位卡片
├── composables/         # 组合式函数
│   └── useTheme.ts              # 主题管理（深色/浅色模式）
├── core/                # 核心层
│   └── data/                    # 数据基础设施
│       ├── index.ts             # 统一导出
│       ├── loader.ts            # 数据加载器（异步加载+冻结）
│       └── types.ts             # 数据类型定义
├── domains/             # 领域层（DDD架构）
│   ├── builder/                 # 构建领域
│   │   ├── index.ts             # 领域导出
│   │   ├── service.ts           # 业务逻辑服务
│   │   ├── store.ts             # useBuilderStore
│   │   └── types.ts             # 领域类型
│   ├── config/                  # 配置领域
│   │   ├── constants.ts         # 流派/属性/触发位常量
│   │   ├── utils.ts             # 配置查询工具
│   │   ├── types.ts             # 配置类型
│   │   └── index.ts             # 领域导出
│   ├── filter/                  # 筛选领域
│   │   ├── index.ts             # 领域导出
│   │   ├── service.ts           # 筛选逻辑服务
│   │   ├── store.ts             # useFilterStore
│   │   └── types.ts             # 筛选类型
│   └── skill/                   # 技能领域
│       ├── index.ts             # 领域导出
│       ├── repository.ts        # 技能数据仓库
│       └── types.ts             # 技能类型
├── interfaces/          # TypeScript 类型定义
│   ├── Attribute.ts     # 属性类型：火/冰/电/毒/暗/光/刃
│   ├── Sect.ts          # 流派接口
│   ├── SectValue.ts     # 流派值类型
│   ├── SkillInfoInterface.ts  # 双重技能信息接口
│   ├── SkillCardInfo.ts # 技能位信息接口
│   ├── Trigger.ts       # 触发位类型
│   └── ...
├── shared/              # 共享工具
│   └── validation/              # 验证逻辑
│       ├── index.ts             # 验证导出
│       └── sect.ts              # 流派验证函数
├── router/
│   └── index.ts         # 路由配置（Hash模式）
├── views/               # 页面视图
│   ├── SearchDoublePage.vue      # 双重词条筛选页（路径：/）
│   └── SectBuilderPage.vue       # 流派构建页（路径：/builder）
├── data/                # 数据文件目录
│   └── SkillInfoList.json       # 双重策略数据（73条）
├── App.vue              # 根组件（shadcn风格UI主题）
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

每个属性下有多个流派，每个流派包含特定技能列表：

- **火系**：`燃烧`、`火弹`、`火环`、`地雷`、`火精灵`
- **冰系**：`寒冷`、`寒冷 (寒气爆发)`、`寒冷 (聚寒成冰)`、`冰锥`、`冰刺`、`冰雹`、`玄冰剑刃`
- **电系**：`感电`、`闪电链`、`落雷`、`电球`、`电桩`
- **毒系**：`中毒`、`史莱姆`、`毒弹`、`毒液`、`毒泡河豚`
- **暗系**：`触手`、`影子`、`影刺`、`黑洞`、`暗影标记`
- **光系**：`光枪`、`闪光`、`光波`、`光阵`、`圣光标记`
- **刃系**：`飞剑`、`撕裂`、`刃环`、`刀刃风暴`、`飞刃`

### 双重策略

当两个特定流派在正确的技能位组合时，会激活额外的双重策略效果。共73种双重策略。

---

## 架构设计

### 领域驱动设计（DDD）

项目采用领域驱动设计架构，将业务逻辑按领域划分：

```
┌─────────────────────────────────────────────────────┐
│                   表现层 (Vue Components)            │
├─────────────────────────────────────────────────────┤
│                   领域层 (Domains)                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐ │
│  │ builder │  │ filter  │  │  skill  │  │ config │ │
│  │ 构建领域 │  │ 筛选领域 │  │ 技能领域 │  │配置领域 │ │
│  └─────────┘  └─────────┘  └─────────┘  └────────┘ │
├─────────────────────────────────────────────────────┤
│                   核心层 (Core)                      │
│                   数据加载与冻结                      │
├─────────────────────────────────────────────────────┤
│                   基础设施 (Shared/Interfaces)        │
│                   验证逻辑、类型定义                   │
└─────────────────────────────────────────────────────┘
```

### 数据流架构

```
src/data/SkillInfoList.json
       ↓
core/data/loader.ts (异步加载 + deepFreeze)
       ↓
domains/skill/repository.ts (数据仓库)
       ↓
   ┌───┴───┐
   ↓       ↓
domains/filter   domains/builder
   ↓               ↓
   └───────┬───────┘
           ↓
      Vue Components
```

### 性能优化策略

1. **数据层**：使用 `deepFreeze()` 深度冻结 JSON 数据，避免 Vue 深度响应式代理
2. **缓存层**：数据加载后缓存，避免重复请求
3. **Store 层**：使用 `shallowRef` 替代 `reactive`，只监听引用变化
4. **计算层**：使用 `computed` 缓存派生数据

### UI设计系统

采用 **shadcn/ui** 风格设计系统：

- **CSS变量**：使用 HSL 格式定义颜色，支持深色/浅色主题切换
- **主题切换**：通过 `useTheme` composable 实现，偏好存储在 localStorage
- **Element Plus 覆盖**：自定义样式覆盖 Element Plus 默认主题

---

## 领域模块详解

### core/data - 核心数据层

数据加载和冻结的基础设施。

**主要导出：**
- `loadSkillData()`: 异步加载并冻结技能数据
- `getCachedSkillData()`: 获取缓存数据
- `FrozenSkillInfoList`: 冻结类型定义

### domains/skill - 技能领域

技能数据仓库，管理数据的加载、缓存和查询。

**主要导出：**
- `initializeRepository()`: 初始化数据仓库
- `getSkillInfoList()`: 获取技能列表（响应式）
- `filterByAttribute()`: 按属性筛选
- `filterBySect()`: 按流派筛选
- `filterByTrigger()`: 按触发位筛选
- `filterSkills()`: 多条件组合筛选
- `getValidTriggersForSect()`: 获取流派支持的触发位
- `isValidSect()`: 验证流派有效性

### domains/config - 配置领域

流派、属性、触发位的常量和工具函数。

**主要导出：**
- `sectList`: 完整流派列表（36个流派含技能）
- `attributeList`: 属性列表（7种元素）
- `triggerList`: 触发位列表（5个位置）
- `sectConfig`: 派系列表映射（向后兼容）
- `getSkillsBySect()`: 获取流派技能列表
- `getAttributeBySect()`: 获取流派对应属性
- `getSectsByAttribute()`: 获取属性下的流派列表

### domains/filter - 筛选领域

双重词条筛选的状态和逻辑管理。

**Store: useFilterStore**

| 成员 | 类型 | 说明 |
|-----|------|------|
| `attribute` | `Ref<Attribute \| ''>` | 属性筛选 |
| `sect` | `Ref<SectValue \| ''>` | 流派筛选 |
| `sectCheckboxes` | `SectCheckboxState` | 流派复选框状态 |
| `triggerCheckboxes` | `TriggerCheckboxState` | 触发位复选框状态 |
| `filterResult` | `ComputedRef<FilterResult>` | 筛选结果 |

**主要方法：**
- `setAttribute(value)`: 设置属性筛选
- `setSect(value)`: 设置流派筛选
- `toggleSectCheckbox(key, value)`: 切换流派复选框
- `toggleTriggerCheckbox(key, value)`: 切换触发位复选框
- `resetFilter()`: 重置所有筛选条件

### domains/builder - 构建领域

流派构建的状态和逻辑管理。

**Store: useBuilderStore**

| 成员 | 类型 | 说明 |
|-----|------|------|
| `skillCardInfoList` | `ShallowRef<SkillCardInfoTuple>` | 5个技能位配置 |
| `activatedSkills` | `ComputedRef<ActivatedSkillResult>` | 已激活的策略 |
| `configuredCount` | `ComputedRef<number>` | 已配置的流派数量 |
| `hasConfiguration` | `ComputedRef<boolean>` | 是否有配置 |

**主要方法：**
- `updateSkillCardInfo(trigger, sect)`: 更新技能位流派
- `updateSkillCardInherit(trigger, inherit)`: 更新继承状态
- `getSkillCardByTrigger(trigger)`: 获取指定位置配置
- `checkSectDuplicate(sect, excludeTrigger)`: 检查流派重复
- `resetAllSkillCards()`: 重置所有配置
- `exportConfiguration()`: 导出配置（用于本地存储）
- `importConfiguration(config)`: 导入配置

### shared/validation - 验证逻辑

与 UI 框架解耦的纯函数验证逻辑。

**主要导出：**
- `validateSectTriggerMatch(sect, trigger)`: 验证流派是否支持触发位
- `validateDuplicateSect(sect, cards, excludeTrigger)`: 验证流派是否重复
- `validateAttributeMatch(sect, attribute)`: 验证流派与属性是否匹配
- `validateSect(sect, trigger, cards)`: 组合验证

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

- 领域类型放在 `domains/*/types.ts`
- 共享类型放在 `src/interfaces/` 目录
- 使用严格的 TypeScript 类型约束
- 避免过多的类型断言

### 领域模块开发

- 每个领域包含：`index.ts`、`types.ts`、`store.ts`、`service.ts`
- 使用领域导出统一暴露 API
- Store 使用函数式定义风格
- Service 包含纯函数业务逻辑

### 状态管理

- 使用 Pinia 管理全局状态
- Store 命名使用 `useXxxStore` 规范
- 读写分离：组件读取 Store，通过 Store 方法更新
- 性能优化：使用 `shallowRef` 替代 `reactive`

### 样式规范

- 使用 SCSS 预处理器
- 采用 shadcn/ui 风格 CSS 变量系统
- 组件样式使用 scoped 属性
- 颜色使用 HSL 格式：`hsl(var(--variable))`

---

## 配置文件

### vite.config.ts

- `base: './'` - 使用相对路径，支持任意目录部署

### tsconfig.json

标准 Vue 3 + TypeScript 配置

---

## 数据来源

游戏中的双重策略数据来自 `docs/策略大全.md`，包含：

- 7大属性流派
- 36种具体流派
- 73种双重策略（含触发位、解锁条件、效果描述）

**数据存储**：`src/data/SkillInfoList.json`

**数据加载**：通过 `core/data/loader.ts` 异步导入并深度冻结

---

## 待办事项

- [x] 筛选页：根据选择(属性/流派)筛选符合条件的双重词条
- [x] 性能优化：使用 shallowRef 和 Object.freeze 优化响应式性能
- [x] 数据重构：从硬编码改为 JSON 数据源
- [x] 表单验证：增强流派选择的验证逻辑
- [x] UI重构：采用 shadcn/ui 风格设计系统
- [x] 主题切换：实现深色/浅色模式切换
- [x] 技能提示：添加流派技能列表 Tooltip 提示
- [x] 架构重构：采用领域驱动设计（DDD）
- [ ] 筛选页：添加技能位选择器，能根据对应技能位筛选
- [ ] 构建页：保存流派配置到本地存储

---

## 常见问题

### 如何添加新的双重策略？

1. 在 `src/data/SkillInfoList.json` 中添加新条目，格式如下：
```json
{
  "name": "策略名称",
  "mainSect": "主流派",
  "mainAttribute": "火",
  "secondSect": "副流派",
  "secondAttribute": "冰",
  "trigger": ["普攻", "技能"],
  "description": "策略效果描述"
}
```
2. 如果涉及新流派，同步更新 `src/domains/config/constants.ts` 中的 `sectList`
3. 在 `docs/策略大全.md` 中同步更新文档

### 如何修改技能位？

技能位是固定的5个（普攻/技能/冲刺/传承/召唤），如需修改需要：
1. 修改 `src/domains/config/constants.ts` 中的 `triggerList`
2. 修改 `src/domains/builder/store.ts` 中的 `DEFAULT_SKILL_CARDS` 和 `VALID_TRIGGERS`
3. 更新 `src/interfaces/Trigger.ts` 类型定义

### 如何调试数据加载问题？

控制台会输出加载状态：
- 成功加载：`[core/data/loader] 数据加载成功`
- 加载失败：`[core/data/loader] 数据加载失败: [错误信息]`
- 仓库加载：`[domains/skill/repository] 数据加载成功`

### 如何自定义主题颜色？

在 `src/App.vue` 中修改 CSS 变量：
- `:root` 中定义浅色模式变量
- `.dark` 中定义深色模式变量
- 元素颜色在 `--element-*` 变量中定义

---

## 更新日志

### 2026-03-04

1. **架构重构完成**
   - 采用领域驱动设计（DDD）架构
   - 新增 `core/data` 核心数据层
   - 新增 `domains` 领域层（builder/filter/skill/config）
   - 新增 `shared/validation` 共享验证逻辑
   - 移除旧的 `store` 目录，逻辑迁移到领域模块

2. **数据管理优化**
   - 使用 `deepFreeze()` 深度冻结数据
   - 实现数据缓存机制
   - Repository 模式管理数据访问

3. **技能提示增强**
   - 添加流派技能列表 Tooltip 提示
   - 在 `sectList` 中定义完整技能列表

### 2026-03-03

1. **UI重构完成**
   - 采用 shadcn/ui 风格设计系统
   - 实现深色/浅色主题切换
   - 添加 Element Plus 主题覆盖

2. **Store 重构**
   - `useSkillInfoStore` 移除硬编码数据，改用 `useSkillData` 加载 JSON
   - `useSkillCardInfoStore` 使用 `shallowRef` 替代 `reactive`

3. **组件清理**
   - 删除废弃的 `EnabledDoubleSkill.vue` 组件

---

*文档更新时间: 2026-03-04*