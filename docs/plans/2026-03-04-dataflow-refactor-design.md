# 数据流模块化重构设计文档

## 1. 项目背景

### 1.1 当前痛点
- **职责边界模糊**：`useSkillData` (composable) 和 `useSkillInfoStore` (Pinia) 功能重叠，Store 只是简单包装 composable
- **筛选逻辑散落**：`SearchDoubleEffectForm.vue` 中直接操作复选框状态和筛选逻辑，没有统一的状态管理
- **配置分散**：`sectConfig.ts` 混合了类型定义、配置数据、工具函数
- **验证与 UI 耦合**：`useSectValidation` 直接返回 Element Plus 的表单规则，难以在其他场景复用

### 1.2 重构目标
- 按功能域组织代码，让数据流跟着业务逻辑走
- 明确分层：数据层 → 领域层 → UI 层
- 状态集中管理，业务逻辑抽离为可测试的纯函数
- 验证逻辑与 UI 框架解耦

---

## 2. 架构设计

### 2.1 新目录结构

```
src/
├── core/                    # 核心基础设施（只放纯技术层）
│   └── data/               # 数据访问层
│       ├── loader.ts       # JSON 数据加载
│       ├── freeze.ts       # Object.freeze 工具
│       └── types.ts        # 核心类型（SkillInfoInterface 等）
│
├── domains/                 # 业务功能模块（按业务域组织）
│   ├── skill/              # 技能数据域
│   │   ├── types.ts        # 技能领域类型
│   │   ├── repository.ts   # 技能数据查询
│   │   └── index.ts        # 对外导出
│   │
│   ├── filter/             # 筛选功能域
│   │   ├── types.ts        # 筛选条件类型
│   │   ├── store.ts        # Pinia: 筛选状态管理
│   │   ├── service.ts      # 筛选逻辑服务（纯函数）
│   │   └── index.ts
│   │
│   ├── builder/            # 流派构建域
│   │   ├── types.ts        # SkillCard 类型
│   │   ├── store.ts        # Pinia: 5个技能位状态
│   │   ├── service.ts      # 激活策略计算逻辑
│   │   └── index.ts
│   │
│   └── config/             # 配置域
│       ├── types.ts        # Attribute, SectInfo 等
│       ├── constants.ts    # sectList, sectConfig
│       └── utils.ts        # getSkillsBySect 等工具函数
│
├── shared/                  # 共享工具（无业务逻辑）
│   └── validation/         # 通用验证器
│       ├── sect.ts         # 流派验证规则（纯函数）
│       └── index.ts
│
└── components/              # UI 组件（只负责渲染）
    ├── SearchDoublePage/
    └── SectBuilderPage/
```

### 2.2 核心原则

1. **domains 层自治**：每个业务域内部包含自己的 types、store、service，不直接依赖其他域的具体实现
2. **组件只读 Store**：UI 组件只读取状态，通过调用 store actions 更新
3. **Service 层无状态**：所有纯业务逻辑放在 service.ts，便于测试

---

## 3. 组件设计

### 3.1 职责重新划分

**SearchDoubleEffectForm.vue**
- 渲染筛选表单（属性/流派输入框、复选框）
- 读取 filterStore 的状态显示当前筛选条件
- 调用 filterStore.actions 更新筛选条件
- **不负责**：筛选逻辑计算、复选框状态管理

**SectBuilderPage.vue**
- 渲染已激活策略列表
- 渲染5个技能位配置区
- 读取 builderStore 获取当前配置
- 读取 skillRepository 获取完整技能数据
- **不负责**：激活策略匹配计算、继承状态切换逻辑

**ChangeSkillSectForm.vue**
- 渲染流派选择表单
- 调用 validation 函数进行验证
- 提交时调用 builderStore.updateSkillCardInfo()
- **不负责**：流派与触发位匹配验证、重复流派检测

---

## 4. 数据流设计

### 4.1 数据流向

```
数据源层 (core/data/loader.ts)
    ↓ 加载并冻结 JSON
领域仓库层 (domains/skill/repository.ts)
    ↓              ↓              ↓
filter/store   builder/store   组件直接读取
    ↓              ↓
filter/service builder/service
    ↓              ↓
SearchDouble   SectBuilder
EffectForm.vue Page.vue
```

### 4.2 关键规则

**单向数据流**：
```typescript
// 正确：组件 → Store Action → State → 组件重新渲染
const handleFilterChange = () => {
  filterStore.setAttribute('火')
}

// 错误：组件直接修改状态或执行筛选逻辑
```

**状态更新模式**：
```typescript
export const useFilterStore = defineStore('filter', () => {
  const state = shallowRef<FilterState>({...})
  
  const setAttribute = (attr: Attribute | '') => {
    state.value = { ...state.value, attribute: attr }
  }
  
  return { state: readonly(state), setAttribute }
})
```

---

## 5. 错误处理设计

### 5.1 分层策略

**数据加载层**：
```typescript
export class DataLoadError extends Error {
  constructor(cause: unknown) {
    super('技能数据加载失败', { cause })
  }
}

export type Result<T, E = Error> = 
  | { ok: true; data: T }
  | { ok: false; error: E }
```

**业务逻辑层**：
- 不捕获错误，让调用方处理
- 验证错误作为返回值

**UI 层**：
- 全局错误处理（数据加载失败）
- 表单验证错误即时反馈

---

## 6. 测试设计

### 6.1 测试目录

```
tests/
├── unit/
│   └── domains/
│       ├── filter/
│       │   └── service.spec.ts
│       └── builder/
│           └── service.spec.ts
└── integration/
    └── filter-store.spec.ts
```

### 6.2 测试优先级

1. **Service 层单元测试**（最高）：筛选逻辑、激活策略计算
2. **Store 层集成测试**：状态管理、跨域交互
3. **Validation 层单元测试**：验证规则
4. **E2E 测试**（可选）：页面基本流程

---

## 7. 文件变更清单

### 7.1 新增文件
- `src/core/data/loader.ts`
- `src/core/data/types.ts`
- `src/domains/skill/repository.ts`
- `src/domains/skill/types.ts`
- `src/domains/filter/store.ts`
- `src/domains/filter/service.ts`
- `src/domains/filter/types.ts`
- `src/domains/builder/store.ts`
- `src/domains/builder/service.ts`
- `src/domains/builder/types.ts`
- `src/domains/config/types.ts`
- `src/domains/config/constants.ts`
- `src/domains/config/utils.ts`
- `src/shared/validation/sect.ts`

### 7.2 修改文件
- `src/components/SearchDoublePage/SearchDoubleEffectForm.vue`
- `src/components/SectBuilderPage/ChangeSkillSectForm.vue`
- `src/components/SectBuilderPage/SectBuilderPage.vue`
- `src/config/sectConfig.ts` → 迁移到 `src/domains/config/`

### 7.3 删除文件
- `src/composables/useSkillData.ts`
- `src/composables/useSectValidation.ts`
- `src/store/useSkillInfoStore.ts`
- `src/store/useSkillCardInfoStore.ts`

---

*设计完成日期: 2026-03-04*
