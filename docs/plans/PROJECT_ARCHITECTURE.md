# 苍翼混沌效应构建器 - 项目架构文档

> 本文档基于源码分析生成，反映项目实际架构与设计模式

---

## 1. 项目概览

### 1.1 项目定位

《苍翼：混沌效应构建器》是一个专为游戏《苍翼：混沌效应》(BlazBlue: Entropy Effect) 开发的网页工具，帮助玩家：
- **双重词条筛选**：根据属性/流派/触发位筛选符合条件的双重策略（共73种）
- **流派构建**：为5个技能位配置流派，自动计算可激活的双重策略

### 1.2 技术栈清单

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 框架 | Vue | ^3.4.21 | 前端响应式框架 |
| 构建工具 | Vite | ^5.2.8 | 开发与生产构建 |
| 状态管理 | Pinia | ^2.1.7 | 全局状态管理 |
| UI组件库 | Element Plus | ^2.6.3 | 基础UI组件 |
| 路由 | Vue Router | ^4.3.0 | 页面导航 |
| 样式 | SCSS | ^1.74.1 | CSS预处理器 |
| 语言 | TypeScript | ^5.2.2 | 类型安全开发 |

### 1.3 架构风格

- **设计模式**：基于 Vue 3 Composition API 的模块化组件架构
- **状态管理**：Pinia Store 模式，采用函数式编程风格
- **样式方案**：CSS变量驱动的主题系统（支持浅色/深色模式）
- **UI风格**：shadcn/ui -inspired 设计语言

---

## 2. 目录结构

```
src/
├── components/           # 组件目录
│   ├── Public/          # 公共组件
│   │   └── PageHeader.vue       # 页面导航头部（含主题切换）
│   ├── SearchDoublePage/        # 双重词条页组件
│   │   └── SearchDoubleEffectForm.vue    # 筛选表单与结果展示
│   └── SectBuilderPage/         # 流派构建页组件
│       ├── ChangeSkillSectForm.vue       # 修改流派对话框
│       ├── EnabledDoubleSkill.vue        # [已删除] 功能已整合到 SectBuilderPage.vue
│       ├── SelectableSkillCard.vue       # 可选择技能卡片（展示可激活策略）
│       └── SkillCard.vue                 # 技能位卡片（触发位选择）
├── composables/         # 组合式函数
│   └── useTheme.ts      # 主题管理 Composable（浅色/深色模式）
├── config/              # 配置文件
│   └── sectConfig.ts    # 属性到流派的映射配置
├── data/                # 数据文件
│   └── SkillInfoList.json    # [备用] 技能数据JSON
├── interfaces/          # TypeScript 类型定义（核心领域模型）
│   ├── Attribute.ts          # 属性类型：火/冰/电/毒/暗/光/刃
│   ├── DoubleSkillName.ts    # 双重技能名称联合类型（73种）
│   ├── Nullable.ts           # 空字符串工具类型
│   ├── Sect.ts               # 流派接口定义
│   ├── SectParmaInterface.ts # 组件参数接口
│   ├── SectValue.ts          # 流派值类型
│   ├── SkillCardInfo.ts      # 技能位信息接口
│   ├── SkillCardInfoTuple.ts # 技能位元组类型（固定5个）
│   ├── SkillInfoInterface.ts # 双重技能信息接口
│   └── Trigger.ts            # 触发位类型
├── router/              # 路由配置
│   └── index.ts         # Vue Router 配置（Hash模式）
├── store/               # Pinia 状态管理
│   ├── useSkillInfoStore.ts      # 技能数据存储（73条双重技能）
│   └── useSkillCardInfoStore.ts  # 技能位配置存储
├── views/               # 页面视图
│   ├── SearchDoublePage.vue      # 双重词条筛选页（路径：/）
│   └── SectBuilderPage.vue       # 流派构建页（路径：/builder）
├── App.vue              # 根组件（含全局样式与布局）
└── main.ts              # 应用入口
```

---

## 3. 核心架构模式

### 3.1 分层架构

```flowchart TD
    subgraph Presentation[表现层]
        A[Vue Components]
        B[Views]
    end
    
    subgraph Business[业务逻辑层]
        C[Pinia Stores]
        D[Composables]
    end
    
    subgraph Domain[领域层]
        E[TypeScript Interfaces]
        F[Config]
    end
    
    subgraph Infrastructure[基础设施层]
        G[Vue Router]
        H[Element Plus]
        I[LocalStorage]
    end
    
    A --> C
    B --> C
    C --> E
    C --> F
    A --> D
    B --> G
    D --> I
```

### 3.2 状态管理架构

项目采用 **Pinia** 进行状态管理，遵循 **Flux-like** 模式：

```flowchart LR
    subgraph Components[Vue Components]
        C1[SearchDoubleEffectForm]
        C2[SectBuilderPage]
        C3[SkillCard]
        C4[SelectableSkillCard]
    end
    
    subgraph Stores[Pinia Stores]
        S1[useSkillInfoStore]
        S2[useSkillCardInfoStore]
    end
    
    subgraph State[State]
        ST1[skillInfoList: 73条双重技能]
        ST2[triggerInfoList: 流派触发位映射]
        ST3[skillCardInfoList: 5个技能位配置]
    end
    
    C1 -->|读取| S1
    C2 -->|读取/写入| S1
    C2 -->|读取/写入| S2
    C3 -->|写入| S2
    C4 -->|读取| S1
    C4 -->|读取| S2
    S1 --> ST1
    S1 --> ST2
    S2 --> ST3
```

### 3.3 组件通信模式

| 通信方式 | 使用场景 | 实现方式 |
|---------|---------|---------|
| Props/Events | 父子组件通信 | `defineProps` / `defineEmits` |
| Pinia Store | 跨组件共享状态 | `useXxxStore()` 函数调用 |
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
        SDP[SearchDoublePage]
        SBP[SectBuilderPage]
    end
    
    subgraph SearchComponents[双重词条页组件]
        SDEF[SearchDoubleEffectForm]
    end
    
    subgraph BuilderComponents[流派构建页组件]
        SC[SkillCard]
        SSC[SelectableSkillCard]
        CSSF[ChangeSkillSectForm]
    end
    
    subgraph Stores[全局状态]
        SKI[useSkillInfoStore]
        SCI[useSkillCardInfoStore]
    end
    
    PH -->|导航| Routes
    RV -->|路由切换| Routes
    
    SDP -->|包含| SDEF
    SBP -->|包含| SC
    SBP -->|包含| SSC
    SBP -->|对话框| CSSF
    
    SDEF -->|读取| SKI
    SBP -->|读取| SKI
    SBP -->|读取/写入| SCI
    SC -->|触发事件| SBP
    SC -->|写入| SCI
    SSC -->|读取| SKI
    SSC -->|读取| SCI
    CSSF -->|写入| SCI
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
    
    subgraph Store[状态层]
        S[useSkillCardInfoStore]
        ST[skillCardInfoList]
    end
    
    subgraph Computed[计算属性]
        CP1[activatedSkills]
        CP2[filterDetailList]
    end
    
    A1 -->|open-dialog 事件| C3
    C3 -->|显示| C2
    A2 -->|提交| C2
    C2 -->|updateSkillCardInfo| S
    A3 -->|toggleInherit| S
    S -->|更新| ST
    ST -->|驱动| CP1
    ST -->|驱动| CP2
    CP1 -->|展示| C3
    CP2 -->|展示| C4
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
    
    subgraph ReactiveState[响应式状态]
        RS1[attribute: ref]
        RS2[sect: ref]
        RS3[sectCheckboxes: reactive]
        RS4[triggerCheckboxes: reactive]
    end
    
    subgraph Store[数据层]
        S[useSkillInfoStore]
        SL[skillInfoList: 73条]
    end
    
    subgraph Computed[计算属性]
        CP[filterSkillInfoList]
    end
    
    I1 -->|v-model| RS1
    I2 -->|v-model| RS2
    I3 -->|v-model| RS3
    I4 -->|v-model| RS4
    
    RS1 -->|依赖| CP
    RS2 -->|依赖| CP
    RS3 -->|依赖| CP
    RS4 -->|依赖| CP
    S -->|提供数据| SL
    SL -->|过滤源| CP
    CP -->|渲染结果| C
```

---

## 5. 数据流与状态管理详解

### 5.1 核心数据结构

#### 5.1.1 双重技能信息 (SkillInfoInterface)

```typescript
interface SkillInfoInterface {
    name: DoubleSkillName;      // 技能名称
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
    sect: SectValue | '';       // 流派名称（空表示未选择）
    triggerName: Trigger;       // 触发位名称
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

### 5.2 Store 职责划分

#### useSkillInfoStore - 静态数据存储

| 成员 | 类型 | 职责 |
|-----|------|------|
| `skillInfoList` | `SkillInfoInterface[]` | 存储73种双重技能的完整数据 |
| `triggerInfoList` | `{name, trigger[]}[]` | 流派到可触发位的映射 |
| `sectMapper` | `Map<SectValue, Attribute>` | 流派到属性的映射（内部计算） |
| `createSkillInfo` | Function | 工厂函数，创建技能信息对象 |

#### useSkillCardInfoStore - 用户配置存储

| 成员 | 类型 | 职责 |
|-----|------|------|
| `skillCardInfoList` | `SkillCardInfoTuple` | 5个技能位的当前配置状态 |
| `updateSkillCardInfo` | Function | 更新技能位的流派 |
| `updateSkillCardInfoInherit` | Function | 更新技能位的继承状态 |

### 5.3 核心计算逻辑

#### 5.3.1 已激活策略计算 (SectBuilderPage)

```typescript
const activatedSkills = computed<SkillInfoInterface[]>(() => {
    // 1. 获取当前配置的所有流派
    const sectList = skillCardInfoStore.skillCardInfoList
        .filter(card => card.sect)
        .map(card => card.sect);
    
    // 2. 过滤：主流派和副流派都在配置中的技能
    return skillInfoStore.skillInfoList.filter(skill =>
        sectList.includes(skill.mainSect) && 
        sectList.includes(skill.secondSect)
    );
});
```

#### 5.3.2 可组合策略计算 (SelectableSkillCard)

```typescript
const filterDetailList = computed<SkillInfoInterface[]>(() => {
    // 1. 筛选包含当前技能位流派的策略
    let list = skillInfoStore.skillInfoList.filter(skill =>
        props.skillCardInfo.sect && 
        (skill.mainSect.includes(props.skillCardInfo.sect) || 
         skill.secondSect.includes(props.skillCardInfo.sect))
    );
    
    // 2. 获取已配置或继承的触发位
    const existing = skillCardInfoStore.skillCardInfoList
        .filter(c => c.sect || c.inherit)
        .map(c => c.triggerName);
    
    // 3. 过滤：排除已被占用的触发位
    return list.filter(skill => 
        skill.trigger.some(t => !existing.includes(t))
    );
});
```

---

## 6. 配置管理

### 6.1 属性-流派映射配置

```typescript
// src/config/sectConfig.ts
export const sectConfig = {
    '火': ['燃烧', '火弹', '火环', '地雷', '火精灵'],
    '冰': ['寒冷', '寒冷(爆发)', '寒冷(冰冻)', '冰锥', '冰刺'],
    '电': ['感电', '闪电链', '落雷', '电球', '闪电链(雷云)'],
    '毒': ['中毒', '中毒(毒雾)', '中毒(毒环)', '毒弹', '毒液', '史莱姆'],
    '暗': ['触手', '影子', '影刺', '黑洞'],
    '光': ['光枪', '闪光', '光波', '光阵', '圣光标记'],
    '刃': ['飞剑', '撕裂', '刃环', '刀刃风暴'],
};
```

### 6.2 路由配置

```typescript
// src/router/index.ts
export const router = createRouter({
    history: createWebHashHistory(),  // Hash模式，支持静态部署
    routes: [
        { path: '/', component: () => import('../views/SearchDoublePage.vue') },
        { path: '/builder', component: () => import('../views/SectBuilderPage.vue') },
    ],
});
```

### 6.3 主题配置

```typescript
// src/composables/useTheme.ts
const THEME_KEY = 'theme-preference';

// 使用 localStorage 持久化主题偏好
// 监听系统主题变化 (prefers-color-scheme)
// 全局单例模式管理主题状态
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

### 7.3 部署特性

- **静态站点**：输出为纯静态HTML/CSS/JS
- **Hash路由**：使用 `createWebHashHistory`，无需服务端配置
- **相对路径**：`base: './'` 支持部署到任何子目录

---

## 8. 可维护性分析与建议

### 8.1 当前架构优势

| 优势 | 说明 |
|-----|------|
| 类型安全 | 完整的 TypeScript 类型定义，核心领域模型清晰 |
| 状态集中 | Pinia Store 统一管理状态，便于调试和维护 |
| 组件职责清晰 | 组件按页面分组，功能内聚 |
| 响应式设计 | CSS变量驱动的主题系统，支持深色模式 |
| 静态部署友好 | Hash路由+相对路径，零配置部署 |

### 8.2 潜在改进点

#### 8.2.1 数据与逻辑分离

**当前问题**：`useSkillInfoStore.ts` 中硬编码了73条技能数据，文件体积较大

**建议**：
```typescript
// 将数据提取到独立JSON文件
import skillData from '../data/SkillInfoList.json';

// Store 只保留逻辑
export const useSkillInfoStore = defineStore('skillInfo', () => {
    const skillInfoList = reactive<SkillInfoInterface[]>(
        skillData.map(item => createSkillInfo(...))
    );
    // ...
});
```

#### 8.2.2 重复代码提取

**当前问题**：`styleMapper` 在多个组件中重复定义

**建议**：
```typescript
// 创建共享工具函数
// src/utils/style.ts
export const styleMapper: Record<Attribute, string> = {
    '火': 'fire', '冰': 'ice', '电': 'thunder',
    '毒': 'poison', '暗': 'dark', '光': 'light', '刃': 'blade',
};

// 或使用组合式函数
export function useStyleMapper() {
    return { styleMapper };
}
```

#### 8.2.3 废弃组件清理

**状态**：✅ 已完成

**说明**：`EnabledDoubleSkill.vue` 组件已删除，功能整合到 `SectBuilderPage.vue`

#### 8.2.4 表单验证增强

**当前问题**：`ChangeSkillSectForm.vue` 使用简单的 rules 配置

**建议**：
```typescript
// 使用更严格的类型验证
const rules = {
    sect: [
        { required: true, message: '请选择流派', trigger: 'change' },
        { 
            validator: (rule, value, callback) => {
                const validSects = Object.values(sectConfig).flat();
                if (!validSects.includes(value)) {
                    callback(new Error('无效的流派'));
                } else {
                    callback();
                }
            }
        }
    ]
};
```

#### 8.2.5 性能优化

**建议**：
- 对 `skillInfoList` 使用 `shallowRef` 或冻结对象，避免不必要的响应式开销
- 对大列表使用虚拟滚动（如策略数量增加时）

### 8.3 类型系统完整性检查

**当前类型定义状态**：
- ✅ 领域模型完整（Attribute, Sect, Trigger, SkillInfoInterface）
- ✅ 组件 Props 类型定义完整
- ⚠️ `DoubleSkillName` 为联合类型，需手动维护73种名称

**建议**：
```typescript
// 考虑使用更灵活的类型
type DoubleSkillName = string;

// 或验证函数
type DoubleSkillName = typeof skillInfoList[number]['name'];
```

---

## 9. 附录

### 9.1 领域术语表

| 术语 | 英文 | 说明 |
|-----|------|------|
| 属性 | Attribute | 7种元素：火/冰/电/毒/暗/光/刃 |
| 流派 | Sect | 36种具体流派，隶属于各属性 |
| 触发位 | Trigger | 5个技能位：普攻/技能/冲刺/传承/召唤 |
| 双重策略 | Double Skill | 两个流派组合激活的额外效果 |
| 继承 | Inherit | 技能位是否继承策略效果 |

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
    
    subgraph Stores[状态]
        S1[useSkillInfoStore.ts]
        S2[useSkillCardInfoStore.ts]
    end
    
    subgraph Interfaces[类型]
        I1[SkillInfoInterface.ts]
        I2[SkillCardInfo.ts]
        I3[Attribute.ts]
        I4[Trigger.ts]
        I5[SectValue.ts]
    end
    
    subgraph Config[配置]
        CF[sectConfig.ts]
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
    
    C2 --> S1
    C3 --> S2
    C4 --> S1
    C4 --> S2
    C5 --> S2
    
    S1 --> I1
    S1 --> I3
    S1 --> I5
    S1 --> CF
    S2 --> I2
    S2 --> I4
    
    C2 --> I1
    C2 --> I3
    C5 --> CF
```

---

*文档生成时间: 2026-03-03*  
*基于源码分析自动生成*
