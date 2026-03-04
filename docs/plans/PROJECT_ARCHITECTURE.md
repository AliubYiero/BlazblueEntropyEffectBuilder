# 苍翼混沌效应构建器 - 项目架构文档

> 本文档基于源码分析生成，反映项目实际架构与设计模式  
> 最后更新：2026-03-04

---

## 1. 项目概览

### 1.1 项目定位

《苍翼：混沌效应构建器》(BlazBlue: Entropy Effect Builder) 是一个专为游戏《苍翼：混沌效应》开发的网页工具，帮助玩家：
- **双重词条筛选**：根据属性/流派/触发位筛选符合条件的双重策略（共 73 种）
- **流派构建**：为 5 个技能位配置流派，自动计算可激活的双重策略

### 1.2 技术栈清单

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 框架 | Vue | ^3.4.21 | 前端响应式框架 |
| 构建工具 | Vite | ^5.2.8 | 开发与生产构建 |
| 状态管理 | Pinia | ^2.1.7 | 全局状态管理 |
| UI 组件库 | Element Plus | ^2.6.3 | 基础 UI 组件 |
| 路由 | Vue Router | ^4.3.0 | 页面导航 |
| 样式 | SCSS | ^1.74.1 | CSS 预处理器 |
| 语言 | TypeScript | ^5.2.2 | 类型安全开发 |

### 1.3 架构演进

项目经历了从简单组件架构向 **领域驱动设计 (DDD)** 的演进：

| 阶段 | 架构特征 | 代码位置 |
|------|---------|---------|
| V1 | 基础组件 + Store | `store/`, `interfaces/` |
| V2 | 领域分层架构 | `domains/`, `core/`, `shared/` |

当前采用 **领域驱动设计**，将业务逻辑按领域划分，实现关注点分离。

---

## 2. 目录结构

### 2.1 完整目录树

```
src/
├── components/           # UI 组件层
│   ├── Public/          # 公共组件
│   │   └── PageHeader.vue       # 页面头部（导航 + 主题切换）
│   ├── SearchDoublePage/        # 双重词条页组件
│   │   └── SearchDoubleEffectForm.vue    # 筛选表单与结果
│   └── SectBuilderPage/         # 流派构建页组件
│       ├── ChangeSkillSectForm.vue       # 修改流派对话框
│       ├── SelectableSkillCard.vue       # 可选择技能卡片
│       └── SkillCard.vue                 # 技能位卡片
├── composables/         # 组合式函数
│   └── useTheme.ts      # 主题管理（浅色/深色模式）
├── config/              # 配置文件（遗留，推荐使用 domains/config）
│   └── sectConfig.ts    # 属性到流派映射
├── core/                # 核心基础设施层
│   └── data/
│       ├── index.ts     # 核心数据层入口
│       ├── loader.ts    # 数据加载器（JSON 加载 + 冻结）
│       └── types.ts     # 核心数据类型定义
├── data/                # 静态数据文件
│   └── SkillInfoList.json    # 73 条双重技能数据
├── domains/             # 领域层（核心业务逻辑）
│   ├── builder/         # 构建域：技能位配置管理、策略计算
│   │   ├── index.ts     # 域统一导出
│   │   ├── types.ts     # 领域类型定义
│   │   ├── store.ts     # 构建状态 Store
│   │   └── service.ts   # 构建逻辑服务（纯函数）
│   ├── config/          # 配置域：流派、属性、触发位定义
│   │   ├── index.ts     # 域统一导出
│   │   ├── types.ts     # 配置类型定义
│   │   ├── constants.ts # 流派/属性/触发位常量
│   │   └── utils.ts     # 配置工具函数
│   ├── filter/          # 筛选域：双重词条筛选逻辑
│   │   ├── index.ts     # 域统一导出
│   │   ├── types.ts     # 筛选类型定义
│   │   ├── store.ts     # 筛选状态 Store
│   │   └── service.ts   # 筛选逻辑服务（纯函数）
│   └── skill/           # 技能域：技能数据仓库、查询和筛选
│       ├── index.ts     # 域统一导出
│       ├── types.ts     # 技能类型定义
│       ├── repository.ts# 技能数据仓库
│       └── service.ts   # 技能查询服务
├── interfaces/          # TypeScript 类型定义（基础领域模型）
│   ├── Attribute.ts          # 属性类型：火/冰/电/毒/暗/光/刃
│   ├── DoubleSkillName.ts    # 双重技能名称联合类型
│   ├── Nullable.ts           # 空字符串工具类型
│   ├── Sect.ts               # 流派接口定义
│   ├── SectParmaInterface.ts # 组件参数接口
│   ├── SectValue.ts          # 流派值类型
│   ├── SkillCardInfo.ts      # 技能位信息接口
│   ├── SkillCardInfoTuple.ts # 技能位元组类型
│   ├── SkillInfoInterface.ts # 双重技能信息接口
│   └── Trigger.ts            # 触发位类型
├── router/              # 路由配置
│   └── index.ts         # Vue Router 配置（Hash 模式）
├── shared/              # 共享工具层
│   └── validation/
│       ├── index.ts     # 验证模块入口
│       └── sect.ts      # 流派验证纯函数
├── store/               # Pinia Store（遗留，推荐使用 domains 内的 Store）
│   ├── useSkillInfoStore.ts      # [遗留] 技能数据存储
│   └── useSkillCardInfoStore.ts  # [遗留] 技能位配置存储
├── views/               # 页面视图
│   ├── SearchDoublePage.vue      # 双重词条筛选页（路径：/）
│   └── SectBuilderPage.vue       # 流派构建页（路径：/builder）
├── App.vue              # 根组件（全局样式与布局）
└── main.ts              # 应用入口
```

### 2.2 模块职责说明

| 层级 | 模块 | 职责 | 依赖方向 |
|-----|------|------|---------|
| **表现层** | `components/`, `views/` | UI 渲染、用户交互 | → domains, → composables |
| **领域层** | `domains/*` | 核心业务逻辑、状态管理 | → core, → shared, → interfaces |
| **基础设施层** | `core/` | 数据加载、冻结 | → interfaces |
| **共享层** | `shared/` | 通用工具函数（验证等） | → domains, → interfaces |
| **类型层** | `interfaces/` | 基础类型定义 | 无依赖 |

---

## 3. 核心架构模式

### 3.1 领域驱动分层架构

```flowchart TD
    subgraph Presentation[表现层]
        A[Vue Components]
        B[Views]
    end

    subgraph Domain[领域层]
        D1[domains/builder - 构建域]
        D2[domains/filter - 筛选域]
        D3[domains/skill - 技能域]
        D4[domains/config - 配置域]
    end

    subgraph Core[核心层]
        C1[core/data - 数据加载]
    end

    subgraph Shared[共享层]
        S1[shared/validation - 验证]
    end

    subgraph Types[类型层]
        T1[interfaces - 基础类型]
    end

    A --> D1
    A --> D2
    B --> D1
    B --> D2
    D1 --> D3
    D2 --> D3
    D3 --> C1
    D4 --> T1
    S1 --> D3
```

### 3.2 领域层内部结构

每个领域模块遵循统一的结构模式：

```flowchart LR
    subgraph Domain[领域模块]
        Index[index.ts - 统一导出]
        Types[types.ts - 类型定义]
        Store[store.ts - 状态管理]
        Service[service.ts - 业务逻辑]
    end

    Index --> Types
    Index --> Store
    Index --> Service
    Store --> Service
```

### 3.3 状态管理架构

项目采用 **Pinia** 进行状态管理，每个领域有独立的 Store：

```flowchart TD
    subgraph Components[Vue Components]
        C1[SearchDoubleEffectForm]
        C2[SectBuilderPage]
        C3[SkillCard]
        C4[SelectableSkillCard]
    end

    subgraph DomainStores[领域 Stores]
        FS[useFilterStore - 筛选状态]
        BS[useBuilderStore - 构建状态]
    end

    subgraph DomainRepos[领域 Repository]
        SR[skill repository - 技能数据]
    end

    subgraph State[状态数据]
        ST1[filterState: 筛选条件]
        ST2[skillCardInfoList: 5 个技能位配置]
        ST3[skillInfoList: 73 条技能数据]
    end

    C1 -->|读取/写入 | FS
    C2 -->|读取 | BS
    C3 -->|写入 | BS
    C4 -->|读取 | BS
    C4 -->|读取 | SR
    FS --> ST1
    BS --> ST2
    SR --> ST3
```

### 3.4 组件通信模式

| 通信方式 | 使用场景 | 实现方式 |
|---------|---------|---------|
| Props/Events | 父子组件通信 | `defineProps` / `defineEmits` |
| Pinia Store | 跨组件共享状态 | `useXxxStore()` 函数调用 |
| Computed | 响应式数据派生 | `computed()` + Store getters |
| Provide/Inject | 未使用 | - |
| 全局事件 | 未使用 | - |

---

## 4. 关键组件关系图

### 4.1 整体组件层次结构

```flowchart TD
    subgraph App[App.vue]
        PH[PageHeader]
        RV[RouterView]
    end

    subgraph Routes[路由页面]
        SDP[SearchDoublePage - /]
        SBP[SectBuilderPage - /builder]
    end

    subgraph SearchComponents[双重词条页组件]
        SDEF[SearchDoubleEffectForm]
    end

    subgraph BuilderComponents[流派构建页组件]
        SC[SkillCard]
        SSC[SelectableSkillCard]
        CSSF[ChangeSkillSectForm]
    end

    subgraph DomainModules[领域模块]
        Filter[domains/filter]
        Builder[domains/builder]
        Skill[domains/skill]
        Config[domains/config]
    end

    PH -->|导航 | Routes
    RV -->|路由切换 | Routes

    SDP -->|包含 | SDEF
    SBP -->|包含 | SC
    SBP -->|包含 | SSC
    SBP -->|对话框 | CSSF

    SDEF -->|读取 | Filter
    SDEF -->|读取 | Skill
    SDEF -->|读取 | Config
    SBP -->|读取/写入 | Builder
    SBP -->|读取 | Skill
    SC -->|触发事件 | SBP
    SC -->|写入 | Builder
    SSC -->|读取 | Skill
    SSC -->|读取 | Builder
    CSSF -->|写入 | Builder
    CSSF -->|验证 | shared/validation
```

### 4.2 流派构建页数据流

```flowchart TD
    subgraph UserAction[用户操作]
        A1[点击 SkillCard]
        A2[选择流派]
        A3[勾选继承]
    end

    subgraph Components[组件层]
        C1[SkillCard]
        C2[ChangeSkillSectForm]
        C3[SectBuilderPage]
        C4[SelectableSkillCard]
    end

    subgraph Domain[领域层]
        BS[useBuilderStore]
        ST[skillCardInfoList]
    end

    subgraph Computed[计算属性]
        CP1[activatedSkills]
        CP2[filterDetailList]
    end

    A1 -->|open-dialog 事件 | C3
    C3 -->|显示 | C2
    A2 -->|提交 | C2
    C2 -->|updateSkillCardInfo| BS
    A3 -->|toggleInherit| BS
    BS -->|更新 | ST
    ST -->|驱动 | CP1
    ST -->|驱动 | CP2
    CP1 -->|展示 | C3
    CP2 -->|展示 | C4
```

### 4.3 双重词条筛选数据流

```flowchart TD
    subgraph Input[用户输入]
        I1[属性选择]
        I2[流派选择]
        I3[流派复选框]
        I4[槽位复选框]
    end

    subgraph Component[组件]
        C[SearchDoubleEffectForm]
    end

    subgraph Domain[领域层]
        FS[useFilterStore]
        SR[skill repository]
    end

    subgraph ReactiveState[响应式状态]
        RS1[attribute: ref]
        RS2[sect: ref]
        RS3[sectCheckboxes: reactive]
        RS4[triggerCheckboxes: reactive]
    end

    subgraph Computed[计算属性]
        CP[filterResult]
    end

    I1 -->|v-model| RS1
    I2 -->|v-model| RS2
    I3 -->|v-model| RS3
    I4 -->|v-model| RS4

    RS1 -->|依赖 | FS
    RS2 -->|依赖 | FS
    RS3 -->|依赖 | FS
    RS4 -->|依赖 | FS
    FS -->|computed| CP
    SR -->|提供数据 | CP
    CP -->|渲染结果 | C
```

### 4.4 领域层依赖关系

```flowchart TD
    subgraph Presentation[表现层]
        V1[SearchDoublePage]
        V2[SectBuilderPage]
        C1[SearchDoubleEffectForm]
        C2[ChangeSkillSectForm]
    end

    subgraph Domain[领域层]
        D1[domains/filter]
        D2[domains/builder]
        D3[domains/skill]
        D4[domains/config]
    end

    subgraph Core[核心层]
        C3[core/data/loader]
    end

    subgraph Shared[共享层]
        S1[shared/validation]
    end

    V1 --> D1
    V1 --> D3
    C1 --> D1
    C1 --> D3
    C1 --> D4
    V2 --> D2
    V2 --> D3
    C2 --> D2
    C2 --> D4
    C2 --> S1
    D1 --> D3
    D2 --> D3
    D3 --> C3
    S1 --> D3
    D4 --> D3
```

---

## 5. 数据流与状态管理详解

### 5.1 核心数据结构

#### 5.1.1 双重技能信息 (SkillInfo)

```typescript
interface SkillInfo {
  name: DoubleSkillName;      // 技能名称（73 种之一）
  mainSect: SectValue;        // 主流派
  mainAttribute: Attribute;   // 主属性
  secondSect: SectValue;      // 副流派
  secondAttribute: Attribute; // 副属性
  trigger: Trigger[];         // 可触发位置
  description: string;        // 效果描述
}
```

#### 5.1.2 技能位配置 (SkillCardInfo)

```typescript
interface SkillCardInfo {
  triggerName: Trigger;       // 触发位名称
  sect: SectValue | '';       // 流派名称（空表示未选择）
  inherit: boolean;           // 是否继承
}
```

#### 5.1.3 技能位元组 (SkillCardInfoTuple)

```typescript
type SkillCardInfoTuple = [
  SkillCardInfo,  // 普攻
  SkillCardInfo,  // 技能
  SkillCardInfo,  // 冲刺
  SkillCardInfo,  // 传承
  SkillCardInfo   // 召唤
];
```

### 5.2 领域 Store 职责划分

#### useFilterStore - 筛选状态管理

| 成员 | 类型 | 职责 |
|-----|------|------|
| `attribute` | `ref<Attribute>` | 属性筛选条件 |
| `sect` | `ref<SectValue>` | 流派筛选条件 |
| `sectCheckboxes` | `reactive` | 主流派/副流派复选框 |
| `triggerCheckboxes` | `reactive` | 5 个触发位复选框 |
| `filterResult` | `computed` | 筛选结果（自动计算） |
| `setAttribute()` | Action | 设置属性筛选 |
| `setSect()` | Action | 设置流派筛选 |
| `toggleSectCheckbox()` | Action | 切换流派复选框 |
| `toggleTriggerCheckbox()` | Action | 切换触发位复选框 |
| `resetFilter()` | Action | 重置所有筛选条件 |

#### useBuilderStore - 构建状态管理

| 成员 | 类型 | 职责 |
|-----|------|------|
| `skillCardInfoList` | `shallowRef<SkillCardInfoTuple>` | 5 个技能位的配置状态 |
| `activatedSkills` | `computed` | 已激活的策略（自动计算） |
| `configuredCount` | `computed` | 已配置的流派数量 |
| `updateSkillCardInfo()` | Action | 更新技能位的流派 |
| `updateSkillCardInherit()` | Action | 更新技能位的继承状态 |
| `getSkillCardByTrigger()` | Action | 获取指定触发位的卡片信息 |
| `checkSectDuplicate()` | Action | 检查流派是否重复配置 |
| `resetAllSkillCards()` | Action | 重置所有卡片信息 |

### 5.3 核心计算逻辑

#### 5.3.1 筛选逻辑 (applyFilter)

```typescript
function applyFilter(skills, state): SkillInfo[] {
  // 1. 获取未选中的触发位（用于过滤）
  const excludedTriggers = getExcludedTriggers(triggerCheckboxes);

  // 2. 过滤技能
  return skills.filter(skill => {
    // 流派匹配：主流派或副流派匹配
    const isMainMatch = sectCheckboxes.main && 
                        matchesAttribute(skill.mainAttribute, attribute) &&
                        matchesSect(skill.mainSect, sect);
    const isSecondMatch = sectCheckboxes.second && 
                          matchesAttribute(skill.secondAttribute, attribute) &&
                          matchesSect(skill.secondSect, sect);

    // 触发位匹配：技能的触发位不能全被排除
    const isTriggerMatch = !skill.trigger.every(t => excludedTriggers.includes(t));

    return (isMainMatch || isSecondMatch) && isTriggerMatch;
  });
}
```

#### 5.3.2 激活策略计算 (calculateActivatedSkills)

```typescript
function calculateActivatedSkills(cards: SkillCardInfoTuple): ActivatedSkillResult {
  // 1. 收集已配置的流派及其触发位
  const configuredSects = new Map<SectValue, Trigger>();
  cards.forEach(card => {
    if (card.sect) {
      configuredSects.set(card.sect, card.triggerName);
    }
  });

  // 2. 筛选可激活的策略
  const activatedSkills: SkillInfo[] = [];
  skillInfoList.forEach(skill => {
    // 主流派和副流派都必须已配置
    const mainTrigger = configuredSects.get(skill.mainSect);
    const secondTrigger = configuredSects.get(skill.secondSect);
    if (!mainTrigger || !secondTrigger) return;

    // 触发位必须匹配
    const hasValidTrigger = 
      skill.trigger.includes(mainTrigger) || 
      skill.trigger.includes(secondTrigger);

    if (hasValidTrigger) {
      activatedSkills.push(skill);
    }
  });

  return { skills: activatedSkills, count: activatedSkills.length };
}
```

### 5.4 数据加载机制

```flowchart TD
    subgraph AppInit[应用初始化]
        A1[main.ts]
        A2[createPinia]
    end

    subgraph DataLoad[数据加载]
        D1[initializeRepository]
        D2[getCachedSkillData]
        D3[loadSkillData]
        D4[import SkillInfoList.json]
        D5[deepFreeze]
    end

    subgraph Cache[缓存层]
        C1[cachedData: FrozenSkillInfoList]
    end

    subgraph Domain[领域使用]
        U1[useFilterStore]
        U2[useBuilderStore]
        U3[filter/service]
        U4[builder/service]
    end

    A1 --> A2
    U1 --> D1
    U2 --> D1
    U3 --> D1
    D1 --> D2
    D2 -->|缓存命中 | C1
    D2 -->|缓存未命中 | D3
    D3 --> D4
    D4 --> D5
    D5 --> C1
    C1 --> U1
    C1 --> U2
    C1 --> U3
    C1 --> U4
```

---

## 6. 配置管理

### 6.1 属性 - 流派映射配置

```typescript
// src/domains/config/constants.ts
export const sectConfig: SectConfigMap = {
  '火': ['燃烧', '火弹', '火环', '地雷', '火精灵'],
  '冰': ['寒冷', '寒冷 (寒气爆发)', '寒冷 (聚寒成冰)', '冰锥', '冰刺', '冰雹', '玄冰剑刃'],
  '电': ['感电', '闪电链', '落雷', '电球', '电桩'],
  '毒': ['中毒', '史莱姆', '毒弹', '毒液', '毒泡河豚'],
  '暗': ['触手', '影子', '影刺', '黑洞', '暗影标记'],
  '光': ['光枪', '闪光', '光波', '光阵', '圣光标记'],
  '刃': ['飞剑', '撕裂', '刃环', '刀刃风暴', '飞刃'],
};
```

### 6.2 流派信息常量

```typescript
// 完整流派列表（36 个流派）
export const sectList: SectInfo[] = [
  { attribute: '火', sect: '燃烧', skill: ['普攻燃烧', '技能燃烧', '冲刺燃烧'] },
  { attribute: '火', sect: '火弹', skill: ['技能火弹', '传承技火弹'] },
  // ... 共 36 个流派
];
```

### 6.3 路由配置

```typescript
// src/router/index.ts
export const router = createRouter({
  history: createWebHashHistory(),  // Hash 模式，支持静态部署
  routes: [
    { path: '/', component: () => import('../views/SearchDoublePage.vue') },
    { path: '/builder', component: () => import('../views/SectBuilderPage.vue') },
  ],
});
```

### 6.4 主题配置

```typescript
// src/composables/useTheme.ts
const THEME_KEY = 'theme-preference';

// 使用 localStorage 持久化主题偏好
// 监听系统主题变化 (prefers-color-scheme)
// 全局单例模式管理主题状态
```

### 6.5 CSS 变量主题系统

```scss
:root {
  /* 基础颜色 (HSL 格式) */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --border: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
  
  /* 元素颜色 */
  --element-fire: 0 84% 60%;
  --element-ice: 199 89% 48%;
  --element-thunder: 48 96% 53%;
  --element-poison: 271 91% 65%;
  --element-dark: 258 90% 66%;
  --element-light: 45 93% 47%;
  --element-blade: 215 16% 47%;
}

.dark {
  /* 深色模式颜色覆盖 */
}
```

---

## 7. 构建与部署

### 7.1 构建脚本

```json
{
  "scripts": {
    "dev": "vite",                    // 开发服务器
    "build": "vue-tsc && vite build", // 类型检查 + 构建
    "preview": "vite preview"         // 预览生产构建
  }
}
```

### 7.2 Vite 配置

```typescript
// vite.config.ts
export default defineConfig({
  base: './',           // 相对路径，支持任意目录部署
  plugins: [vue()],
});
```

### 7.3 TypeScript 配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "resolveJsonModule": true
  }
}
```

### 7.4 部署特性

- **静态站点**：输出为纯静态 HTML/CSS/JS
- **Hash 路由**：使用 `createWebHashHistory`，无需服务端配置
- **相对路径**：`base: './'` 支持部署到任何子目录
- **数据内联**：技能数据通过 `import` 内联到构建产物

---

## 8. 可维护性分析与建议

### 8.1 当前架构优势

| 优势 | 说明 |
|-----|------|
| 领域驱动设计 | 按业务领域划分模块，职责清晰 |
| 类型安全 | 完整的 TypeScript 类型定义 |
| 状态集中 | Pinia Store 统一管理状态 |
| 纯函数服务 | Service 层使用纯函数，易于测试 |
| 响应式设计 | CSS 变量驱动的主题系统 |
| 静态部署友好 | Hash 路由 + 相对路径 |
| 数据冻结 | 使用 `deepFreeze` 防止数据被意外修改 |
| 性能优化 | 使用 `shallowRef` 避免不必要的响应式开销 |

### 8.2 遗留代码处理

#### 8.2.1 旧 Store 目录

**状态**：`store/` 目录已废弃，推荐使用 `domains/*/store.ts`

**迁移建议**：
- `useSkillInfoStore` → `domains/skill/repository.ts` + `domains/config/utils.ts`
- `useSkillCardInfoStore` → `domains/builder/store.ts`

#### 8.2.2 旧配置目录

**状态**：`config/sectConfig.ts` 已废弃，推荐使用 `domains/config/`

**迁移建议**：
- 使用 `domains/config/constants.ts` 中的 `sectConfig`、`sectList`
- 使用 `domains/config/utils.ts` 中的工具函数

### 8.3 潜在改进点

#### 8.3.1 类型一致性

**问题**：`SectValue` 类型在多处定义不一致

```typescript
// interfaces/SectValue.ts - 使用 Sect 映射
export type SectValue = Sect[keyof Sect]

// domains/config/types.ts - 使用 string
export type SectValue = string
```

**建议**：统一使用 `domains/config/types.ts` 中的定义，或从 `constants.ts` 派生：
```typescript
export type SectValue = typeof sectList[number]['sect'];
```

#### 8.3.2 验证模块独立性

**当前问题**：`shared/validation/sect.ts` 依赖 `domains/skill/repository.ts`

**建议**：将验证所需数据作为参数传入，使验证函数成为纯函数：
```typescript
export function validateSect(
  sect: SectValue,
  trigger: Trigger,
  cards: SkillCardInfo[],
  validTriggers: Trigger[],  // 从外部传入
): ValidationResult { ... }
```

#### 8.3.3 本地存储持久化

**建议**：为 `useBuilderStore` 添加本地存储持久化：
```typescript
// 使用 Pinia 插件或自定义 Composable
import { useLocalStorage } from '@vueuse/core';

export const useBuilderStore = defineStore('builder', () => {
  const skillCardInfoList = useLocalStorage<SkillCardInfoTuple>(
    'builder-config',
    structuredClone(DEFAULT_SKILL_CARDS)
  );
  // ...
});
```

#### 8.3.4 错误边界处理

**建议**：添加全局错误边界组件：
```vue
<!-- components/Public/ErrorBoundary.vue -->
<template>
  <div v-if="error" class="error-boundary">
    <h2>出错了</h2>
    <button @click="retry">重试</button>
  </div>
  <slot v-else />
</template>
```

### 8.4 测试策略建议

#### 8.4.1 单元测试

```typescript
// domains/builder/service.test.ts
import { describe, it, expect } from 'vitest';
import { calculateActivatedSkills } from './service';

describe('calculateActivatedSkills', () => {
  it('应返回空结果当配置少于 2 个流派', () => {
    const cards: SkillCardInfoTuple = [
      { triggerName: '普攻', sect: '燃烧', inherit: false },
      { triggerName: '技能', sect: '', inherit: false },
      // ...
    ];
    const result = calculateActivatedSkills(cards);
    expect(result.count).toBe(0);
  });
});
```

#### 8.4.2 集成测试

```typescript
// 测试领域层协作
import { useFilterStore } from '@/domains/filter';
import { initializeRepository } from '@/domains/skill';

describe('Filter Domain Integration', () => {
  it('应正确筛选技能', async () => {
    await initializeRepository();
    const store = useFilterStore();
    store.setAttribute('火');
    expect(store.filterResult.count).toBeGreaterThan(0);
  });
});
```

---

## 9. 附录

### 9.1 领域术语表

| 术语 | 英文 | 说明 |
|-----|------|------|
| 属性 | Attribute | 7 种元素：火/冰/电/毒/暗/光/刃 |
| 流派 | Sect | 36 种具体流派，隶属于各属性 |
| 触发位 | Trigger | 5 个技能位：普攻/技能/冲刺/传承/召唤 |
| 双重策略 | Double Skill | 两个流派组合激活的额外效果（共 73 种） |
| 继承 | Inherit | 技能位是否继承策略效果 |
| 领域 | Domain | 业务逻辑的边界上下文 |
| Repository | Repository | 数据访问层，负责数据加载和缓存 |

### 9.2 文件引用关系

```flowchart TD
    subgraph Entry[入口]
        M[main.ts]
        A[App.vue]
    end

    subgraph Router[路由]
        R[index.ts]
        V1[SearchDoublePage.vue]
        V2[SectBuilderPage.vue]
    end

    subgraph Components[组件]
        C1[PageHeader.vue]
        C2[SearchDoubleEffectForm.vue]
        C3[SkillCard.vue]
        C4[SelectableSkillCard.vue]
        C5[ChangeSkillSectForm.vue]
    end

    subgraph Domains[领域层]
        D1[domains/filter]
        D2[domains/builder]
        D3[domains/skill]
        D4[domains/config]
    end

    subgraph Core[核心层]
        C6[core/data/loader]
    end

    subgraph Shared[共享层]
        S1[shared/validation]
    end

    M --> A
    M --> R
    A --> C1
    R --> V1
    R --> V2
    V1 --> C2
    V2 --> C3
    V2 --> C4
    V2 --> C5

    C2 --> D1
    C2 --> D3
    C2 --> D4
    C3 --> D2
    C4 --> D2
    C4 --> D3
    C5 --> D2
    C5 --> D4
    C5 --> S1

    D1 --> D3
    D2 --> D3
    D3 --> C6
    S1 --> D3
```

### 9.3 技能数据示例

```json
{
  "name": "火环燃烧",
  "mainSect": "燃烧",
  "mainAttribute": "火",
  "secondSect": "火环",
  "secondAttribute": "火",
  "trigger": ["传承"],
  "description": "火环可使敌人燃烧，每秒收到 550 伤害"
}
```

### 9.4 领域层 API 速查

#### domains/filter

```typescript
// Store
import { useFilterStore } from '@/domains/filter';
const store = useFilterStore();
store.setAttribute('火');
store.setSect('燃烧');
store.toggleTriggerCheckbox('普攻', false);

// Service (纯函数)
import { applyFilter, isFilterEmpty } from '@/domains/filter';
const filtered = applyFilter(skills, filterState);
```

#### domains/builder

```typescript
// Store
import { useBuilderStore } from '@/domains/builder';
const store = useBuilderStore();
store.updateSkillCardInfo('普攻', '燃烧');
store.updateSkillCardInherit('技能', true);
const activated = store.activatedSkills;

// Service (纯函数)
import { calculateActivatedSkills, checkDuplicateSect } from '@/domains/builder';
const result = calculateActivatedSkills(cards);
```

#### domains/skill

```typescript
// Repository
import { initializeRepository, getSkillInfoList } from '@/domains/skill';
await initializeRepository();
const skills = getSkillInfoList().value;

// 筛选
import { filterByAttribute, filterBySect } from '@/domains/skill';
const fireSkills = filterByAttribute('火').value;
```

#### domains/config

```typescript
// 常量
import { sectList, attributeList, triggerList, sectConfig } from '@/domains/config';

// 工具函数
import { getAttributeBySect, isValidSect, getSectsByAttribute } from '@/domains/config';
const attr = getAttributeBySect('燃烧');  // '火'
```

---

*文档生成时间：2026-03-04*  
*基于源码分析自动生成*
