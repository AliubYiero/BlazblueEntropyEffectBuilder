# 性能优化与代码重构设计文档

**日期**: 2026-03-03  
**主题**: 性能优化、Store 重构、组件清理、表单验证增强  
**方案**: B - 完整重构方案

---

## 1. 项目背景

### 1.1 现状问题

1. **数据不一致**: `useSkillInfoStore.ts` 硬编码约45条技能数据，而 `SkillInfoList.json` 包含73条完整数据
2. **性能问题**: Store 使用 `reactive([])` 创建大量响应式对象，开销较大
3. **废弃组件**: `EnabledDoubleSkill.vue` 已废弃但文件仍保留
4. **验证不足**: `ChangeSkillSectForm.vue` 只有基础必填验证

### 1.2 目标

- 统一数据来源，以 JSON 为唯一数据源
- 使用 `shallowRef` 和冻结对象优化性能
- 清理废弃代码
- 增强表单验证

---

## 2. 架构设计

### 2.1 目录结构变更

```
src/
├── composables/
│   ├── useSkillData.ts          # 新增：数据获取与缓存
│   ├── useSectValidation.ts     # 新增：表单验证逻辑
│   └── useTheme.ts              # 现有
├── store/
│   ├── useSkillInfoStore.ts     # 修改：移除硬编码
│   └── useSkillCardInfoStore.ts # 修改：shallowRef 优化
├── data/
│   └── SkillInfoList.json       # 数据源
└── components/
    └── SectBuilderPage/
        ├── ChangeSkillSectForm.vue    # 修改
        └── EnabledDoubleSkill.vue     # 删除
```

### 2.2 模块职责

| 模块 | 职责 | 修改类型 |
|------|------|----------|
| `useSkillData` | 加载 JSON 数据，冻结并缓存，提供派生计算属性 | 新增 |
| `useSectValidation` | 封装表单验证逻辑，支持多规则验证 | 新增 |
| `useSkillInfoStore` | 保留筛选/查询逻辑，数据从 useSkillData 获取 | 修改 |
| `useSkillCardInfoStore` | 状态管理，`reactive` 改为 `shallowRef` | 修改 |
| `ChangeSkillSectForm` | 使用 useSectValidation 进行表单验证 | 修改 |
| `EnabledDoubleSkill` | 废弃组件，删除 | 删除 |

---

## 3. 组件设计

### 3.1 useSkillData.ts

```typescript
interface UseSkillDataReturn {
  // 数据
  skillInfoList: Readonly<Ref<Readonly<SkillInfoInterface[]>>>
  triggerInfoList: Readonly<Ref<Readonly<TriggerInfo[]>>>
  sectMapper: Readonly<Ref<Readonly<Map<SectValue, Attribute>>>>
  
  // 查询方法
  getAttributeBySect: (sect: SectValue) => Attribute | undefined
  getValidTriggersForSect: (sect: SectValue) => Trigger[]
  isValidSect: (sect: SectValue) => boolean
}

// 实现要点：
// 1. 使用 shallowRef 存储冻结的数据
// 2. 动态导入 JSON 文件
// 3. 使用 Object.freeze() 冻结数据
// 4. 计算属性缓存派生数据
```

### 3.2 useSectValidation.ts

```typescript
interface UseSectValidationReturn {
  rules: FormRules
  validateSectTriggerMatch: (rule: any, value: any, callback: Function) => void
  validateAttributeMatch: (rule: any, value: any, callback: Function) => void
  validateDuplicateSect: (rule: any, value: any, callback: Function) => void
}

// 验证规则：
// 1. 流派必填
// 2. 流派必须支持当前触发位
// 3. 流派必须属于所选属性
// 4. 可选：检查重复配置
```

### 3.3 useSkillInfoStore.ts (修改后)

```typescript
export const useSkillInfoStore = defineStore('skillInfo', () => {
  const skillData = useSkillData()
  
  // 保持原有 API 兼容
  const skillInfoList = skillData.skillInfoList
  const triggerInfoList = skillData.triggerInfoList
  
  // 筛选方法（使用计算属性缓存）
  const getSkillsByAttribute = computed(() => {...})
  const getSkillsBySect = computed(() => {...})
  
  return {
    skillInfoList,
    triggerInfoList,
    getSkillsByAttribute,
    getSkillsBySect,
  }
})
```

### 3.4 useSkillCardInfoStore.ts (修改后)

```typescript
export const useSkillCardInfoStore = defineStore('skillCardInfo', () => {
  // reactive 改为 shallowRef
  const skillCardInfoList = shallowRef<SkillCardInfoTuple>([...])
  
  // 更新方法（触发 shallowRef 更新）
  const updateSkillCardInfo = (triggerName: Trigger, sect: SectValue) => {
    const newList = [...skillCardInfoList.value]
    const card = newList.find(c => c.triggerName === triggerName)
    if (card) {
      card.sect = sect
      skillCardInfoList.value = newList
    }
  }
  
  return {
    skillCardInfoList: readonly(skillCardInfoList),
    updateSkillCardInfo,
    updateSkillCardInfoInherit,
  }
})
```

---

## 4. 数据流设计

### 4.1 启动时序

```
应用启动
  ↓
useSkillData 首次被调用
  ↓
import SkillInfoList.json
  ↓
Object.freeze() 冻结数据
  ↓
存储到 shallowRef
  ↓
派生计算属性自动计算
  ↓
组件/Store 使用 readonly 数据
```

### 4.2 表单验证流程

```
用户选择流派
  ↓
el-form 触发验证
  ↓
useSectValidation 验证器执行
  ↓
从 useSkillData 获取验证数据
  ↓
返回验证结果
  ↓
UI 显示错误提示或允许提交
```

### 4.3 状态更新流程

```
用户确认表单
  ↓
调用 skillCardInfoStore.updateSkillCardInfo()
  ↓
创建新数组副本，更新对应项
  ↓
shallowRef.value = newList（触发响应）
  ↓
computed 筛选结果自动更新
  ↓
相关组件重新渲染
```

### 4.4 数据流向图

```
SkillInfoList.json
       ↓
  useSkillData (冻结数据)
       ↓
   ┌───┴───┐
   ↓       ↓
useSkillInfoStore  useSectValidation
   ↓               ↓
   └───────┬───────┘
           ↓
      各组件使用
```

---

## 5. 错误处理设计

### 5.1 数据加载错误

| 场景 | 处理 | 用户反馈 |
|------|------|----------|
| JSON 导入失败 | try-catch，返回空数组 | 控制台报错，提示数据加载失败 |
| 数据为空 | 检查数组长度 | 显示"暂无数据" |
| 格式错误 | 开发环境类型检查 | 控制台警告 |

### 5.2 表单验证错误

| 场景 | 规则 | 提示 |
|------|------|------|
| 未选择流派 | required | "请选择流派" |
| 流派不支持触发位 | 自定义 validator | "该流派无法在【xxx】位使用" |
| 流派与属性不匹配 | 自定义 validator | "流派【xxx】不属于属性【xxx】" |

### 5.3 Store 防御性编程

```typescript
const updateSkillCardInfo = (triggerName: Trigger, sect: SectValue) => {
  // 验证 triggerName 有效性
  // 验证 sect 有效性
  // 执行更新
}
```

---

## 6. 测试设计

### 6.1 单元测试

| 模块 | 测试内容 | 工具 |
|------|----------|------|
| useSkillData | 数据加载、冻结、派生计算 | Vitest |
| useSectValidation | 各验证规则正确性 | Vitest |
| useSkillInfoStore | 筛选逻辑 | Vitest |
| useSkillCardInfoStore | 状态更新 | Vitest |

### 6.2 手动测试清单

- [ ] 应用启动，数据正确加载
- [ ] 双重词条筛选页功能正常
- [ ] 流派构建页正常选择和配置
- [ ] 表单验证正确拦截无效输入
- [ ] 删除废弃组件后无编译错误
- [ ] 构建产物正常

---

## 7. 实施步骤

1. 创建 `useSkillData.ts`，实现数据加载和缓存
2. 创建 `useSectValidation.ts`，实现验证逻辑
3. 修改 `useSkillInfoStore.ts`，移除硬编码，使用 useSkillData
4. 修改 `useSkillCardInfoStore.ts`，使用 shallowRef
5. 修改 `ChangeSkillSectForm.vue`，使用 useSectValidation
6. 删除 `EnabledDoubleSkill.vue`
7. 更新 `AGENTS.md` 和 `PROJECT_ARCHITECTURE.md`
8. 运行测试和构建验证

---

## 8. YAGNI 确认

已检查并移除以下不必要功能：

- ❌ 不做深拷贝数据（冻结后无需拷贝）
- ❌ 不做数据持久化（JSON 文件已足够）
- ❌ 不做过度抽象的验证库（当前规模足够）
- ❌ 不做错误边界（验证和防御性编程已足够）

---

**设计完成，等待实施。**
