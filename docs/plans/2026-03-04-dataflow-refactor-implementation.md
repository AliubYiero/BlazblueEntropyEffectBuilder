# 数据流模块化重构实施计划

>

*

*For Claude:
** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

*

*Goal:
** 将现有代码按功能域重新组织，实现清晰的分层架构（数据层 → 领域层 → UI 层）

*

*Architecture:
** 按 domains 组织代码，每个业务域包含 types、store、service；UI 组件只负责渲染和调用 store actions

*

*Tech Stack:
** Vue 3 + Pinia + TypeScript + Vite

---

## 任务概览

| 阶段 | 任务数 | 说明 |
|------|--------|------|
| Phase 1: 基础设施层 | 3 | 创建 core/data 模块 |
| Phase 2: 配置域 | 2 | 迁移 sectConfig |
| Phase 3: 技能域 | 2 | 创建 skill repository |
| Phase 4: 筛选域 | 3 | 创建 filter store/service |
| Phase 5: 构建域 | 3 | 创建 builder store/service |
| Phase 6: 验证模块 | 2 | 解耦验证逻辑 |
| Phase 7: 组件迁移 | 3 | 更新组件使用新模块 |
| Phase 8: 清理 | 2 | 删除旧文件 |

---

## Phase 1: 基础设施层 (core/data)

### Task 1: 创建 core/data/types.ts

*

*Files:
**

- Create:
  `src/core/data/types.ts`

*

*Step 1:
创建目录和类型文件
**

```typescript
// src/core/data/types.ts
/**
 * 核心数据类型定义
 * @description 从 interfaces 迁移的核心类型
 */

import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../../interfaces/SectValue.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { DoubleSkillName } from '../../interfaces/DoubleSkillName.ts';

/**
 * 双重技能信息接口
 */
export interface SkillInfo {
  name: DoubleSkillName;
  mainSect: SectValue;
  mainAttribute: Attribute;
  secondSect: SectValue;
  secondAttribute: Attribute;
  trigger: Trigger[];
  description: string;
}

/**
 * 冻结的技能数据类型
 */
export type FrozenSkillInfoList = readonly SkillInfo[];

/**
 * 数据加载结果类型
 */
export type DataLoadResult<T> =
  | { success: true; data: T }
  | { success: false; error: Error };
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/core/data/types.ts
git commit -m "feat(core): add core data types"
```

---

### Task 2: 创建 core/data/loader.ts

*

*Files:
**

- Create:
  `src/core/data/loader.ts`

*

*Step 1:
创建数据加载器
**

```typescript
// src/core/data/loader.ts
/**
 * 数据加载器
 * @description 负责加载和冻结 JSON 数据
 */

import type {
	SkillInfo,
	FrozenSkillInfoList,
	DataLoadResult
} from './types.ts';

/**
 * 数据加载状态
 */
let cachedData: FrozenSkillInfoList | null = null;

/**
 * 深度冻结对象
 */
function deepFreeze<T>( obj: T ): Readonly<T> {
	if ( obj === null || typeof obj !== 'object' ) {
		return obj as Readonly<T>;
	}
	
	Object.freeze( obj );
	
	for ( const key of Object.keys( obj ) ) {
		const value = ( obj as Record<string, unknown> )[ key ];
		if ( value && typeof value === 'object' && !Object.isFrozen( value ) ) {
			deepFreeze( value );
		}
	}
	
	return obj as Readonly<T>;
}

/**
 * 加载技能数据
 */
export async function loadSkillData(): Promise<DataLoadResult<FrozenSkillInfoList>> {
	// 返回缓存数据
	if ( cachedData !== null ) {
		return {
			success: true,
			data: cachedData
		};
	}
	
	try {
		const module = await import('../../data/DoubleSkillInfoList.json');
		const data = module.default as SkillInfo[];
		cachedData = deepFreeze( [ ...data ] ) as FrozenSkillInfoList;
		
		console.log( '[core/data/loader] 数据加载成功' );
		return {
			success: true,
			data: cachedData
		};
	}
	catch ( error ) {
		const err = error instanceof Error ? error : new Error( String( error ) );
		console.error( '[core/data/loader] 数据加载失败:', err );
		return {
			success: false,
			error: err
		};
	}
}

/**
 * 获取缓存的数据（同步）
 */
export function getCachedSkillData(): FrozenSkillInfoList | null {
	return cachedData;
}

/**
 * 重置缓存（用于测试）
 */
export function resetCache(): void {
	cachedData = null;
}
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/core/data/loader.ts
git commit -m "feat(core): add data loader with freeze support"
```

---

### Task 3: 创建 core/data/index.ts

*

*Files:
**

- Create:
  `src/core/data/index.ts`

*

*Step 1:
创建模块导出
**

```typescript
// src/core/data/index.ts
/**
 * Core Data Module
 * @description 核心数据层统一导出
 */

export * from './types.ts';
export * from './loader.ts';
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/core/data/index.ts
git commit -m "feat(core): add core data module exports"
```

---

## Phase 2: 配置域 (domains/config)

### Task 4: 创建 domains/config/types.ts

*

*Files:
**

- Create:
  `src/domains/config/types.ts`

*

*Step 1:
创建配置类型定义
**

```typescript
// src/domains/config/types.ts
/**
 * 配置域类型定义
 */

import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../../interfaces/SectValue.ts';

/**
 * 流派信息接口
 */
export interface SectInfo {
  attribute: Attribute;
  sect: SectValue;
  skill: string[];
}

/**
 * 属性到流派列表的映射
 */
export type SectConfigMap = Record<Attribute, SectValue[]>;
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/domains/config/types.ts
git commit -m "feat(domains/config): add config types"
```

---

### Task 5: 创建 domains/config/constants.ts

*

*Files:
**

- Create:
  `src/domains/config/constants.ts`

*

*Step 1:
迁移配置常量
**

```typescript
// src/domains/config/constants.ts
/**
 * 配置常量
 * @description 从 sectConfig.ts 迁移
 */

import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../../interfaces/SectValue.ts';
import type { SectInfo, SectConfigMap } from './types.ts';

/**
 * 完整流派列表（36个流派）
 */
export const sectList: SectInfo[] = [
  { attribute: '火', sect: '燃烧', skill: ['普攻燃烧', '技能燃烧', '冲刺燃烧'] },
  { attribute: '火', sect: '火弹', skill: ['技能火弹', '传承技火弹'] },
  { attribute: '火', sect: '火环', skill: ['传承技火环'] },
  { attribute: '火', sect: '地雷', skill: ['放置地雷'] },
  { attribute: '火', sect: '火精灵', skill: ['火精灵助战'] },
  { attribute: '冰', sect: '寒冷', skill: ['普攻寒冷', '技能寒冷'] },
  { attribute: '冰', sect: '寒冷 (寒气爆发)', skill: ['普攻寒冷 (寒气爆发)', '技能寒冷 (寒气爆发)'] },
  { attribute: '冰', sect: '寒冷 (聚寒成冰)', skill: ['普攻寒冷 (聚寒成冰)', '技能寒冷 (聚寒成冰)'] },
  { attribute: '冰', sect: '冰锥', skill: ['冲刺冰锥', '传承技冰锥'] },
  { attribute: '冰', sect: '冰刺', skill: ['召唤冰刺'] },
  { attribute: '冰', sect: '冰雹', skill: ['技能冰雹', '传承技冰雹'] },
  { attribute: '冰', sect: '玄冰剑刃', skill: ['玄冰剑刃'] },
  { attribute: '电', sect: '感电', skill: ['技能感电', '传承技感电'] },
  { attribute: '电', sect: '闪电链', skill: ['普攻闪电', '技能闪电', '电闪雷鸣'] },
  { attribute: '电', sect: '落雷', skill: ['冲刺落雷'] },
  { attribute: '电', sect: '电球', skill: ['环绕电球'] },
  { attribute: '电', sect: '电桩', skill: ['传承技电桩'] },
  { attribute: '毒', sect: '中毒', skill: ['普攻淬毒', '技能毒环'] },
  { attribute: '毒', sect: '史莱姆', skill: ['召唤史莱姆'] },
  { attribute: '毒', sect: '毒弹', skill: ['冲刺毒弹'] },
  { attribute: '毒', sect: '毒液', skill: ['技能毒液', '传承技毒液'] },
  { attribute: '毒', sect: '毒泡河豚', skill: ['传承技河豚'] },
  { attribute: '暗', sect: '触手', skill: ['召唤触手'] },
  { attribute: '暗', sect: '影子', skill: ['冲刺影子'] },
  { attribute: '暗', sect: '影刺', skill: ['普攻影刺', '技能影刺'] },
  { attribute: '暗', sect: '黑洞', skill: ['传承技黑洞'] },
  { attribute: '暗', sect: '暗影标记', skill: ['普攻影标', '技能影标'] },
  { attribute: '光', sect: '光枪', skill: ['技能光枪', '传承技光枪'] },
  { attribute: '光', sect: '闪光', skill: ['传承技闪光'] },
  { attribute: '光', sect: '光波', skill: ['普攻光波'] },
  { attribute: '光', sect: '光阵', skill: ['召唤光阵'] },
  { attribute: '光', sect: '圣光标记', skill: ['圣光标记'] },
  { attribute: '刃', sect: '飞剑', skill: ['冲刺飞剑'] },
  { attribute: '刃', sect: '撕裂', skill: ['普攻撕裂', '技能撕裂'] },
  { attribute: '刃', sect: '刃环', skill: ['召唤刃环'] },
  { attribute: '刃', sect: '刀刃风暴', skill: ['技能风暴', '传承技风暴'] },
  { attribute: '刃', sect: '飞刃', skill: ['普攻飞刃'] },
];

/**
 * 属性列表
 */
export const attributeList: Attribute[] = ['火', '冰', '电', '毒', '暗', '光', '刃'];

/**
 * 触发位列表
 */
export const triggerList = ['普攻', '技能', '冲刺', '传承', '召唤'] as const;
export type TriggerType = typeof triggerList[number];

/**
 * 派系列表映射（向后兼容）
 * @deprecated 使用 sectList 替代
 */
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

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/domains/config/constants.ts
git commit -m "feat(domains/config): add config constants"
```

---

### Task 6: 创建 domains/config/utils.ts

*

*Files:
**

- Create:
  `src/domains/config/utils.ts`

*

*Step 1:
创建配置工具函数
**

```typescript
// src/domains/config/utils.ts
/**
 * 配置工具函数
 */

import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../../interfaces/SectValue.ts';
import { sectList, sectConfig } from './constants.ts';

/**
 * 根据流派名称获取技能列表
 */
export function getSkillsBySect(sectName: SectValue): string {
  const sect = sectList.find(s => s.sect === sectName);
  return sect ? sect.skill.join(' / ') : sectName;
}

/**
 * 根据流派获取属性
 */
export function getAttributeBySect(sect: SectValue): Attribute | undefined {
  const found = sectList.find(s => s.sect === sect);
  return found?.attribute;
}

/**
 * 获取指定属性的所有流派
 */
export function getSectsByAttribute(attribute: Attribute): SectValue[] {
  return sectConfig[attribute] || [];
}

/**
 * 检查流派是否有效
 */
export function isValidSect(sect: SectValue): boolean {
  return sectList.some(s => s.sect === sect);
}

/**
 * 获取所有流派名称列表
 */
export function getAllSectNames(): SectValue[] {
  return sectList.map(s => s.sect);
}
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/domains/config/utils.ts
git commit -m "feat(domains/config): add config utility functions"
```

---

### Task 7: 创建 domains/config/index.ts

*

*Files:
**

- Create:
  `src/domains/config/index.ts`

*

*Step 1:
创建模块导出
**

```typescript
// src/domains/config/index.ts
/**
 * Config Domain Module
 */

export * from './types.ts';
export * from './constants.ts';
export * from './utils.ts';
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/domains/config/index.ts
git commit -m "feat(domains/config): add module exports"
```

---

## Phase 3: 技能域 (domains/skill)

### Task 8: 创建 domains/skill/types.ts

*

*Files:
**

- Create:
  `src/domains/skill/types.ts`

*

*Step 1:
创建技能域类型
**

```typescript
// src/domains/skill/types.ts
/**
 * 技能域类型定义
 */

import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../../interfaces/SectValue.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';

/**
 * 触发位信息
 */
export interface TriggerInfo {
  name: SectValue;
  trigger: Trigger[];
}

/**
 * 筛选条件
 */
export interface SkillFilter {
  attribute?: Attribute | '';
  sect?: SectValue | '';
  trigger?: Trigger;
}

/**
 * 流派到属性的映射
 */
export type SectAttributeMap = Map<SectValue, Attribute>;
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/domains/skill/types.ts
git commit -m "feat(domains/skill): add skill domain types"
```

---

### Task 9: 创建 domains/skill/repository.ts

*

*Files:
**

- Create:
  `src/domains/skill/repository.ts`

*

*Step 1:
创建技能数据仓库
**

```typescript
// src/domains/skill/repository.ts
/**
 * 技能数据仓库
 * @description 提供技能数据的查询和派生计算
 */

import { computed, readonly, type Ref, shallowRef } from 'vue';
import { loadSkillData } from '../../core/data/index.ts';
import type { SkillInfo, FrozenSkillInfoList } from '../../core/data/types.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../../interfaces/SectValue.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { TriggerInfo, SectAttributeMap } from './types.ts';
import { sectList, sectConfig } from '../config/index.ts';

// 单例状态
let isInitialized = false;
const rawData = shallowRef<FrozenSkillInfoList>([]);

/**
 * 初始化数据
 */
export async function initializeRepository(): Promise<boolean> {
  if (isInitialized) return true;

  const result = await loadSkillData();
  if (result.success) {
    rawData.value = result.data;
    isInitialized = true;
    return true;
  }
  
  rawData.value = [] as unknown as FrozenSkillInfoList;
  isInitialized = true;
  return false;
}

/**
 * 获取只读的技能数据
 */
export function getSkillInfoList(): Readonly<Ref<FrozenSkillInfoList>> {
  if (!isInitialized) {
    initializeRepository();
  }
  return readonly(rawData) as Readonly<Ref<FrozenSkillInfoList>>;
}

/**
 * 获取流派到属性的映射
 */
export function getSectAttributeMap(): SectAttributeMap {
  const map = new Map<SectValue, Attribute>();
  sectList.forEach(item => {
    map.set(item.sect, item.attribute);
  });
  return map;
}

/**
 * 获取触发位信息列表
 */
export function getTriggerInfoList(): TriggerInfo[] {
  const sectTriggers = new Map<SectValue, Set<Trigger>>();

  rawData.value.forEach(skill => {
    [skill.mainSect, skill.secondSect].forEach(sect => {
      if (!sectTriggers.has(sect)) {
        sectTriggers.set(sect, new Set());
      }
      skill.trigger.forEach(t => sectTriggers.get(sect)?.add(t));
    });
  });

  return Object.freeze(
    Array.from(sectTriggers.entries()).map(([name, triggers]) => ({
      name,
      trigger: Array.from(triggers),
    }))
  );
}

// ==================== 查询方法 ====================

/**
 * 按属性筛选
 */
export function filterByAttribute(attribute: Attribute): SkillInfo[] {
  return rawData.value.filter(
    skill => skill.mainAttribute === attribute || skill.secondAttribute === attribute
  );
}

/**
 * 按流派筛选
 */
export function filterBySect(sect: SectValue): SkillInfo[] {
  return rawData.value.filter(
    skill => skill.mainSect === sect || skill.secondSect === sect
  );
}

/**
 * 按触发位筛选
 */
export function filterByTrigger(trigger: Trigger): SkillInfo[] {
  return rawData.value.filter(skill => skill.trigger.includes(trigger));
}

/**
 * 多条件筛选
 */
export function filterSkills(filters: {
  attribute?: Attribute | '';
  sect?: SectValue | '';
  trigger?: Trigger;
}): SkillInfo[] {
  return rawData.value.filter(skill => {
    if (filters.attribute) {
      const matches = skill.mainAttribute === filters.attribute || 
                      skill.secondAttribute === filters.attribute;
      if (!matches) return false;
    }

    if (filters.sect) {
      const matches = skill.mainSect === filters.sect || 
                      skill.secondSect === filters.sect;
      if (!matches) return false;
    }

    if (filters.trigger) {
      if (!skill.trigger.includes(filters.trigger)) return false;
    }

    return true;
  });
}

/**
 * 获取流派支持的触发位
 */
export function getValidTriggersForSect(sect: SectValue): Trigger[] {
  const triggerInfoList = getTriggerInfoList();
  const info = triggerInfoList.find(t => t.name === sect);
  return info ? info.trigger : [];
}

/**
 * 检查流派是否有效
 */
export function isValidSect(sect: SectValue): boolean {
  return getSectAttributeMap().has(sect);
}

/**
 * 根据流派获取属性
 */
export function getAttributeBySect(sect: SectValue): Attribute | undefined {
  return getSectAttributeMap().get(sect);
}
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/domains/skill/repository.ts
git commit -m "feat(domains/skill): add skill repository"
```

---

### Task 10: 创建 domains/skill/index.ts

*

*Files:
**

- Create:
  `src/domains/skill/index.ts`

*

*Step 1:
创建模块导出
**

```typescript
// src/domains/skill/index.ts
/**
 * Skill Domain Module
 */

export * from './types.ts';
export * from './repository.ts';
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/domains/skill/index.ts
git commit -m "feat(domains/skill): add module exports"
```

---

## Phase 4: 筛选域 (domains/filter)

### Task 11: 创建 domains/filter/types.ts

*

*Files:
**

- Create:
  `src/domains/filter/types.ts`

*

*Step 1:
创建筛选域类型
**

```typescript
// src/domains/filter/types.ts
/**
 * 筛选域类型定义
 */

import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../../interfaces/SectValue.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';

/**
 * 筛选状态
 */
export interface FilterState {
  attribute: Attribute | '';
  sect: SectValue | '';
  sectCheckboxes: {
    main: boolean;
    second: boolean;
  };
  triggerCheckboxes: {
    普攻: boolean;
    技能: boolean;
    冲刺: boolean;
    召唤: boolean;
    传承: boolean;
  };
}

/**
 * 筛选结果
 */
export interface FilterResult {
  skills: import('../../core/data/types.ts').SkillInfo[];
  count: number;
}
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/domains/filter/types.ts
git commit -m "feat(domains/filter): add filter domain types"
```

---

### Task 12: 创建 domains/filter/store.ts

*

*Files:
**

- Create:
  `src/domains/filter/store.ts`

*

*Step 1:
创建筛选状态 Store
**

```typescript
// src/domains/filter/store.ts
/**
 * 筛选状态管理
 */

import { defineStore } from 'pinia';
import { shallowRef, readonly, computed } from 'vue';
import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../../interfaces/SectValue.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { FilterState, FilterResult } from './types.ts';
import { filterSkills } from '../skill/repository.ts';
import { applyFilter } from './service.ts';

/**
 * 创建初始筛选状态
 */
function createInitialState(): FilterState {
  return {
    attribute: '',
    sect: '',
    sectCheckboxes: {
      main: true,
      second: true,
    },
    triggerCheckboxes: {
      普攻: true,
      技能: true,
      冲刺: true,
      召唤: true,
      传承: true,
    },
  };
}

export const useFilterStore = defineStore('filter', () => {
  const state = shallowRef<FilterState>(createInitialState());

  // ==================== Getters ====================

  /**
   * 获取只读状态
   */
  const readOnlyState = computed(() => readonly(state.value));

  /**
   * 获取筛选结果
   */
  const filterResult = computed<FilterResult>(() => {
    const skills = applyFilter(state.value);
    return { skills, count: skills.length };
  });

  // ==================== Actions ====================

  /**
   * 设置属性
   */
  function setAttribute(attr: Attribute | ''): void {
    state.value = { ...state.value, attribute: attr };
  }

  /**
   * 设置流派
   */
  function setSect(sect: SectValue | ''): void {
    state.value = { ...state.value, sect };
  }

  /**
   * 切换流派复选框
   */
  function toggleSectCheckbox(key: 'main' | 'second', value: boolean): void {
    state.value = {
      ...state.value,
      sectCheckboxes: { ...state.value.sectCheckboxes, [key]: value },
    };
  }

  /**
   * 切换触发位复选框
   */
  function toggleTriggerCheckbox(trigger: Trigger, value: boolean): void {
    state.value = {
      ...state.value,
      triggerCheckboxes: { ...state.value.triggerCheckboxes, [trigger]: value },
    };
  }

  /**
   * 重置筛选条件
   */
  function resetFilter(): void {
    state.value = createInitialState();
  }

  return {
    state: readOnlyState,
    filterResult,
    setAttribute,
    setSect,
    toggleSectCheckbox,
    toggleTriggerCheckbox,
    resetFilter,
  };
});
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/domains/filter/store.ts
git commit -m "feat(domains/filter): add filter store"
```

---

### Task 13: 创建 domains/filter/service.ts

*

*Files:
**

- Create:
  `src/domains/filter/service.ts`

*

*Step 1:
创建筛选逻辑服务
**

```typescript
// src/domains/filter/service.ts
/**
 * 筛选逻辑服务
 * @description 纯函数，便于测试
 */

import type { SkillInfo } from '../../core/data/types.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../../interfaces/SectValue.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { FilterState } from './types.ts';
import { getSkillInfoList } from '../skill/repository.ts';

/**
 * 应用筛选条件
 */
export function applyFilter(filterState: FilterState): SkillInfo[] {
  const skillList = getSkillInfoList().value;
  const { attribute, sect, sectCheckboxes, triggerCheckboxes } = filterState;

  // 获取未选中的触发位
  const uncheckedTriggers = Object.entries(triggerCheckboxes)
    .filter(([, checked]) => !checked)
    .map(([trigger]) => trigger as Trigger);

  return skillList.filter(skill => {
    // 检查流派匹配
    const isMain = sectCheckboxes.main &&
      skill.mainAttribute.includes(attribute) &&
      skill.mainSect.includes(sect);

    const isSecond = sectCheckboxes.second &&
      skill.secondAttribute.includes(attribute) &&
      skill.secondSect.includes(sect);

    // 检查触发位（排除未选中的）
    const hasExcludedTrigger = skill.trigger.some(t => uncheckedTriggers.includes(t));

    return (isMain || isSecond) && !hasExcludedTrigger;
  });
}

/**
 * 获取属性建议列表
 */
export function getAttributeSuggestions(
  skills: SkillInfo[],
  searchString: string
): { value: Attribute }[] {
  const attributeSet = new Set<Attribute>();
  skills.forEach(item => attributeSet.add(item.mainAttribute));
  
  const list = Array.from(attributeSet).map(item => ({ value: item }));
  return searchString ? list.filter(item => item.value.includes(searchString)) : list;
}

/**
 * 获取流派建议列表
 */
export function getSectSuggestions(
  skills: SkillInfo[],
  attribute: Attribute | '',
  searchString: string
): { value: SectValue }[] {
  const { sectConfig } = await import('../config/index.ts');
  
  let sectSet = new Set<SectValue>();
  
  if (attribute) {
    // 按属性筛选流派
    const sects = sectConfig[attribute] || [];
    sects.forEach(s => sectSet.add(s));
  } else {
    // 获取所有流派
    skills.forEach(item => {
      sectSet.add(item.mainSect);
    });
  }
  
  const list = Array.from(sectSet).map(item => ({ value: item }));
  return searchString ? list.filter(item => item.value.includes(searchString)) : list;
}
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
修复 async 问题
**

```typescript
// src/domains/filter/service.ts (修正版)
/**
 * 筛选逻辑服务
 * @description 纯函数，便于测试
 */

import type { SkillInfo } from '../../core/data/types.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../../interfaces/SectValue.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { FilterState } from './types.ts';
import { getSkillInfoList } from '../skill/repository.ts';
import { sectConfig } from '../config/index.ts';

/**
 * 应用筛选条件
 */
export function applyFilter(filterState: FilterState): SkillInfo[] {
  const skillList = getSkillInfoList().value;
  const { attribute, sect, sectCheckboxes, triggerCheckboxes } = filterState;

  // 获取未选中的触发位
  const uncheckedTriggers = Object.entries(triggerCheckboxes)
    .filter(([, checked]) => !checked)
    .map(([trigger]) => trigger as Trigger);

  return skillList.filter(skill => {
    // 检查流派匹配
    const isMain = sectCheckboxes.main &&
      skill.mainAttribute.includes(attribute) &&
      skill.mainSect.includes(sect);

    const isSecond = sectCheckboxes.second &&
      skill.secondAttribute.includes(attribute) &&
      skill.secondSect.includes(sect);

    // 检查触发位（排除未选中的）
    const hasExcludedTrigger = skill.trigger.some(t => uncheckedTriggers.includes(t));

    return (isMain || isSecond) && !hasExcludedTrigger;
  });
}

/**
 * 获取属性建议列表
 */
export function getAttributeSuggestions(
  skills: SkillInfo[],
  searchString: string
): { value: Attribute }[] {
  const attributeSet = new Set<Attribute>();
  skills.forEach(item => attributeSet.add(item.mainAttribute));
  
  const list = Array.from(attributeSet).map(item => ({ value: item }));
  return searchString ? list.filter(item => item.value.includes(searchString)) : list;
}

/**
 * 获取流派建议列表
 */
export function getSectSuggestions(
  skills: SkillInfo[],
  attribute: Attribute | '',
  searchString: string
): { value: SectValue }[] {
  let sectSet = new Set<SectValue>();
  
  if (attribute) {
    // 按属性筛选流派
    const sects = sectConfig[attribute] || [];
    sects.forEach(s => sectSet.add(s));
  } else {
    // 获取所有流派
    skills.forEach(item => {
      sectSet.add(item.mainSect);
    });
  }
  
  const list = Array.from(sectSet).map(item => ({ value: item }));
  return searchString ? list.filter(item => item.value.includes(searchString)) : list;
}
```

*

*Step 4:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 5:
提交
**

```bash
git add src/domains/filter/service.ts
git commit -m "feat(domains/filter): add filter service"
```

---

### Task 14: 创建 domains/filter/index.ts

*

*Files:
**

- Create:
  `src/domains/filter/index.ts`

*

*Step 1:
创建模块导出
**

```typescript
// src/domains/filter/index.ts
/**
 * Filter Domain Module
 */

export * from './types.ts';
export * from './store.ts';
export * from './service.ts';
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/domains/filter/index.ts
git commit -m "feat(domains/filter): add module exports"
```

---

## Phase 5: 构建域 (domains/builder)

### Task 15: 创建 domains/builder/types.ts

*

*Files:
**

- Create:
  `src/domains/builder/types.ts`

*

*Step 1:
创建构建域类型
**

```typescript
// src/domains/builder/types.ts
/**
 * 构建域类型定义
 */

import type { SectValue } from '../../interfaces/SectValue.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { SkillInfo } from '../../core/data/types.ts';

/**
 * 技能卡信息
 */
export interface SkillCardInfo {
  triggerName: Trigger;
  sect: SectValue | '';
  inherit: boolean;
}

/**
 * 技能卡元组（5个固定位置）
 */
export type SkillCardInfoTuple = [
  SkillCardInfo, // 普攻
  SkillCardInfo, // 技能
  SkillCardInfo, // 冲刺
  SkillCardInfo, // 传承
  SkillCardInfo, // 召唤
];

/**
 * 激活的策略结果
 */
export interface ActivatedSkillResult {
  skills: SkillInfo[];
  count: number;
}
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/domains/builder/types.ts
git commit -m "feat(domains/builder): add builder domain types"
```

---

### Task 16: 创建 domains/builder/store.ts

*

*Files:
**

- Create:
  `src/domains/builder/store.ts`

*

*Step 1:
创建构建状态 Store
**

```typescript
// src/domains/builder/store.ts
/**
 * 构建状态管理
 */

import { defineStore } from 'pinia';
import { shallowRef, computed, readonly } from 'vue';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { SectValue } from '../../interfaces/SectValue.ts';
import type { SkillCardInfo, SkillCardInfoTuple, ActivatedSkillResult } from './types.ts';
import { calculateActivatedSkills } from './service.ts';
import { isValidSect } from '../skill/repository.ts';

/**
 * 创建初始技能卡列表
 */
function createInitialCardList(): SkillCardInfoTuple {
  return [
    { triggerName: '普攻', sect: '', inherit: false },
    { triggerName: '技能', sect: '', inherit: false },
    { triggerName: '冲刺', sect: '', inherit: false },
    { triggerName: '传承', sect: '', inherit: false },
    { triggerName: '召唤', sect: '', inherit: false },
  ];
}

export const useBuilderStore = defineStore('builder', () => {
  const skillCardInfoList = shallowRef<SkillCardInfoTuple>(createInitialCardList());

  // ==================== Getters ====================

  /**
   * 获取只读的技能卡列表
   */
  const readOnlyCardList = computed(() => readonly(skillCardInfoList.value));

  /**
   * 获取激活的策略
   */
  const activatedSkills = computed<ActivatedSkillResult>(() => {
    const skills = calculateActivatedSkills(skillCardInfoList.value);
    return { skills, count: skills.length };
  });

  // ==================== Actions ====================

  /**
   * 更新技能卡流派
   */
  function updateSkillCardInfo(triggerName: Trigger, sect: SectValue | ''): void {
    // 验证触发位
    const validTriggers: Trigger[] = ['普攻', '技能', '冲刺', '传承', '召唤'];
    if (!validTriggers.includes(triggerName)) {
      console.warn(`[useBuilderStore] 无效的触发位: ${triggerName}`);
      return;
    }

    // 验证流派（允许空字符串）
    if (sect && !isValidSect(sect)) {
      console.warn(`[useBuilderStore] 无效的流派: ${sect}`);
      return;
    }

    skillCardInfoList.value = skillCardInfoList.value.map(item =>
      item.triggerName === triggerName ? { ...item, sect } : item
    ) as SkillCardInfoTuple;
  }

  /**
   * 更新技能卡继承状态
   */
  function updateSkillCardInherit(triggerName: Trigger, inherit: boolean): void {
    skillCardInfoList.value = skillCardInfoList.value.map(item =>
      item.triggerName === triggerName ? { ...item, inherit } : item
    ) as SkillCardInfoTuple;
  }

  /**
   * 获取指定触发位的卡片信息
   */
  function getSkillCardByTrigger(triggerName: Trigger): SkillCardInfo | undefined {
    return skillCardInfoList.value.find(item => item.triggerName === triggerName);
  }

  /**
   * 重置所有卡片
   */
  function resetAllSkillCards(): void {
    skillCardInfoList.value = createInitialCardList();
  }

  return {
    skillCardInfoList: readOnlyCardList,
    activatedSkills,
    updateSkillCardInfo,
    updateSkillCardInherit,
    getSkillCardByTrigger,
    resetAllSkillCards,
  };
});
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/domains/builder/store.ts
git commit -m "feat(domains/builder): add builder store"
```

---

### Task 17: 创建 domains/builder/service.ts

*

*Files:
**

- Create:
  `src/domains/builder/service.ts`

*

*Step 1:
创建构建逻辑服务
**

```typescript
// src/domains/builder/service.ts
/**
 * 构建逻辑服务
 * @description 计算激活的策略
 */

import type { SkillInfo } from '../../core/data/types.ts';
import type { SkillCardInfoTuple } from './types.ts';
import { getSkillInfoList } from '../skill/repository.ts';

/**
 * 计算已激活的策略
 */
export function calculateActivatedSkills(cards: SkillCardInfoTuple): SkillInfo[] {
  const skillList = getSkillInfoList().value;
  
  // 收集已配置的流派
  const sectList = cards
    .filter(card => card.sect)
    .map(card => card.sect);

  // 筛选同时包含主流派和副流派的策略
  return skillList.filter(skill =>
    sectList.includes(skill.mainSect) && sectList.includes(skill.secondSect)
  );
}

/**
 * 检查流派是否重复配置
 */
export function checkDuplicateSect(
  cards: SkillCardInfoTuple,
  sect: string,
  excludeTrigger: string
): { isDuplicate: boolean; existingTrigger?: string } {
  const existing = cards.find(
    card => card.sect === sect && card.triggerName !== excludeTrigger
  );
  
  if (existing) {
    return { isDuplicate: true, existingTrigger: existing.triggerName };
  }
  
  return { isDuplicate: false };
}
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/domains/builder/service.ts
git commit -m "feat(domains/builder): add builder service"
```

---

### Task 18: 创建 domains/builder/index.ts

*

*Files:
**

- Create:
  `src/domains/builder/index.ts`

*

*Step 1:
创建模块导出
**

```typescript
// src/domains/builder/index.ts
/**
 * Builder Domain Module
 */

export * from './types.ts';
export * from './store.ts';
export * from './service.ts';
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/domains/builder/index.ts
git commit -m "feat(domains/builder): add module exports"
```

---

## Phase 6: 验证模块 (shared/validation)

### Task 19: 创建 shared/validation/sect.ts

*

*Files:
**

- Create:
  `src/shared/validation/sect.ts`

*

*Step 1:
创建流派验证函数
**

```typescript
// src/shared/validation/sect.ts
/**
 * 流派验证规则
 * @description 纯验证函数，与 UI 框架解耦
 */

import type { SectValue } from '../../interfaces/SectValue.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SkillCardInfo } from '../../domains/builder/types.ts';
import { getValidTriggersForSect, getAttributeBySect } from '../../domains/skill/repository.ts';

/**
 * 验证结果
 */
export interface ValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * 验证流派是否支持指定触发位
 */
export function validateSectTriggerMatch(
  sect: SectValue,
  trigger: Trigger
): ValidationResult {
  const validTriggers = getValidTriggersForSect(sect);
  
  if (!validTriggers.includes(trigger)) {
    return {
      valid: false,
      message: `该流派无法在【${trigger}】位使用`,
    };
  }
  
  return { valid: true };
}

/**
 * 验证流派是否重复配置
 */
export function validateDuplicateSect(
  sect: SectValue,
  cards: SkillCardInfo[],
  excludeTrigger: Trigger
): ValidationResult {
  const existing = cards.find(
    card => card.sect === sect && card.triggerName !== excludeTrigger
  );
  
  if (existing) {
    return {
      valid: false,
      message: `该流派已在【${existing.triggerName}】位配置`,
    };
  }
  
  return { valid: true };
}

/**
 * 验证流派与属性是否匹配
 */
export function validateAttributeMatch(
  sect: SectValue | '',
  attribute: Attribute | ''
): boolean {
  if (!sect || !attribute) return true;
  
  const actualAttribute = getAttributeBySect(sect);
  return actualAttribute === attribute;
}

/**
 * 组合验证
 */
export function validateSect(
  sect: SectValue | '',
  trigger: Trigger,
  cards: SkillCardInfo[]
): ValidationResult {
  if (!sect) {
    return { valid: false, message: '请选择流派' };
  }
  
  const triggerResult = validateSectTriggerMatch(sect, trigger);
  if (!triggerResult.valid) return triggerResult;
  
  const duplicateResult = validateDuplicateSect(sect, cards, trigger);
  if (!duplicateResult.valid) return duplicateResult;
  
  return { valid: true };
}
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/shared/validation/sect.ts
git commit -m "feat(shared/validation): add sect validation functions"
```

---

### Task 20: 创建 shared/validation/index.ts

*

*Files:
**

- Create:
  `src/shared/validation/index.ts`

*

*Step 1:
创建模块导出
**

```typescript
// src/shared/validation/index.ts
/**
 * Validation Module
 */

export * from './sect.ts';
```

*

*Step 2:
验证类型编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
提交
**

```bash
git add src/shared/validation/index.ts
git commit -m "feat(shared/validation): add module exports"
```

---

## Phase 7: 组件迁移

### Task 21: 更新 SearchDoubleEffectForm.vue

*

*Files:
**

- Modify:
  `src/components/SearchDoublePage/SearchDoubleEffectForm.vue`

*

*Step 1:
更新导入和状态管理
**

修改
`<script>` 部分，使用新的 domain 模块：

```typescript
// 更新导入
import { useFilterStore, getAttributeSuggestions, getSectSuggestions } from '../../domains/filter/index.ts';
import { getSkillInfoList } from '../../domains/skill/repository.ts';
import { getSkillsBySect } from '../../domains/config/index.ts';
import { sectConfig } from '../../domains/config/index.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../../interfaces/SectValue.ts';
import { Attribute as AttributeType } from '../../interfaces/Attribute.ts';
import { Sect } from '../../interfaces/Sect.ts';

// 使用新的 filterStore
const filterStore = useFilterStore();
const skillInfoList = getSkillInfoList();

// 使用 store 状态
const attribute = computed({
  get: () => filterStore.state.value.attribute,
  set: (val) => filterStore.setAttribute(val),
});

const sect = computed({
  get: () => filterStore.state.value.sect,
  set: (val) => filterStore.setSect(val),
});

// 复选框状态映射
const sectCheckboxes = computed(() => filterStore.state.value.sectCheckboxes);
const triggerCheckboxes = computed(() => filterStore.state.value.triggerCheckboxes);

// 筛选结果
const filterSkillInfoList = computed(() => filterStore.filterResult.value.skills);

// 建议函数
const handleFetchAttributeSuggestions = (searchString: string, cb: Function) => {
  const list = getAttributeSuggestions(skillInfoList.value, searchString);
  cb(list);
};

const handleFetchSectSuggestions = (searchString: string, cb: Function) => {
  const list = getSectSuggestions(skillInfoList.value, attribute.value, searchString);
  cb(list);
};
```

*

*Step 2:
验证编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
验证应用运行
**

Run:
`pnpm dev`
Expected: 应用正常启动，筛选功能正常

*

*Step 4:
提交
**

```bash
git add src/components/SearchDoublePage/SearchDoubleEffectForm.vue
git commit -m "refactor(SearchDoublePage): migrate to use filter domain"
```

---

### Task 22: 更新 SectBuilderPage.vue

*

*Files:
**

- Modify:
  `src/views/SectBuilderPage.vue`

*

*Step 1:
更新导入和状态管理
**

修改
`<script>` 部分：

```typescript
// 更新导入
import {
	useBuilderStore
} from '../domains/builder/index.ts';
import type {
	SkillCardInfoTuple
} from '../domains/builder/types.ts';
import type {
	Trigger
} from '../interfaces/Trigger.ts';
import type {
	Attribute
} from '../interfaces/Attribute.ts';
import SkillCard
	from '../components/SectBuilderPage/SelectSkillCard.vue';
import SelectableSkillCard
	from '../components/SectBuilderPage/SelectableSkillCard.vue';
import ChangeSkillSectForm
	from '../components/SectBuilderPage/ChangeSkillSectForm.vue';

// 使用新的 builderStore
const builderStore = useBuilderStore();

// 技能卡列表
const skillCardInfoList = computed<SkillCardInfoTuple>(
	() => builderStore.skillCardInfoList.value as SkillCardInfoTuple
);

// 激活的策略
const activatedSkills = computed( () => builderStore.activatedSkills.value.skills );

// 继承状态
const triggerList: Trigger[] = [ '普攻', '技能', '冲刺', '传承', '召唤' ];

const isInheritChecked = ( trigger: Trigger ) => {
	const card = builderStore.getSkillCardByTrigger( trigger );
	return card?.inherit || false;
};

const toggleInherit = ( trigger: Trigger, value: boolean ) => {
	builderStore.updateSkillCardInherit( trigger, value );
};
```

*

*Step 2:
验证编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
验证应用运行
**

Run:
`pnpm dev`
Expected: 应用正常启动，构建功能正常

*

*Step 4:
提交
**

```bash
git add src/views/SectBuilderPage.vue
git commit -m "refactor(SectBuilderPage): migrate to use builder domain"
```

---

### Task 23: 更新 ChangeSkillSectForm.vue

*

*Files:
**

- Modify:
  `src/components/SectBuilderPage/ChangeSkillSectForm.vue`

*

*Step 1:
更新导入和验证逻辑
**

修改
`<script>` 部分：

```typescript
// 更新导入
import { computed, reactive, ref, watch } from 'vue';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../../interfaces/SectValue.ts';
import { sectConfig, attributeList, getValidTriggersForSect } from '../../domains/config/index.ts';
import { getTriggerInfoList, getAttributeBySect } from '../../domains/skill/repository.ts';
import { useBuilderStore } from '../../domains/builder/index.ts';
import { validateSect, validateAttributeMatch } from '../../shared/validation/index.ts';
import type { FormInstance, FormRules } from 'element-plus';

const props = defineProps<{ triggerName: Trigger }>();
const emit = defineEmits<{ (event: 'closeDialog'): void }>();

const builderStore = useBuilderStore();

const formData = reactive({
  triggerName: props.triggerName,
  attribute: '' as Attribute | '',
  sect: '' as SectValue | '',
});

const formRef = ref<FormInstance>();

// Element Plus 表单规则
const rules: FormRules = {
  sect: [
    { required: true, message: '请选择流派', trigger: 'change' },
    {
      validator: (_rule, value, callback) => {
        const result = validateSect(
          value,
          props.triggerName,
          [...builderStore.skillCardInfoList.value]
        );
        if (!result.valid) {
          callback(new Error(result.message));
        } else {
          callback();
        }
      },
      trigger: 'change',
    },
  ],
};

// 监听流派变化，自动设置属性
watch(() => formData.sect, (val) => {
  if (val) {
    const actualAttr = getAttributeBySect(val);
    if (actualAttr && actualAttr !== formData.attribute) {
      formData.attribute = actualAttr;
    }
  }
});

// 监听属性变化，验证与流派是否匹配
watch(() => formData.attribute, (val) => {
  if (val && formData.sect) {
    const isMatch = validateAttributeMatch(formData.sect, val);
    if (!isMatch) {
      formData.sect = '';
    }
  }
});

// 筛选可用流派
const filterSectList = computed(() => {
  const triggerInfoList = getTriggerInfoList();
  const available = triggerInfoList.filter(t => t.trigger.includes(props.triggerName));
  const all: { name: SectValue; attribute: Attribute }[] = [];

  for (const attr of attributeList) {
    sectConfig[attr].forEach((sect) => {
      if (available.find(t => t.name === sect)) {
        all.push({ name: sect as SectValue, attribute: attr });
      }
    });
  }

  return formData.attribute ? all.filter(s => s.attribute === formData.attribute) : all;
});

// 流派搜索建议
const fetchSectListSuggestions = (search: string, cb: Function) => {
  const list = filterSectList.value.map(s => ({ value: s.name }));
  cb(search ? list.filter(s => s.value.includes(search)) : list);
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid && formData.sect) {
      builderStore.updateSkillCardInfo(props.triggerName, formData.sect);
      handleCancel();
    }
  });
};

// 取消
const handleCancel = () => {
  formData.sect = '';
  formData.attribute = '';
  emit('closeDialog');
};
```

*

*Step 2:
验证编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
验证应用运行
**

Run:
`pnpm dev`
Expected: 应用正常启动，表单验证正常

*

*Step 4:
提交
**

```bash
git add src/components/SectBuilderPage/ChangeSkillSectForm.vue
git commit -m "refactor(ChangeSkillSectForm): migrate to use validation module"
```

---

## Phase 8: 清理旧代码

### Task 24: 更新 sectConfig.ts 为重导出

*

*Files:
**

- Modify:
  `src/config/sectConfig.ts`

*

*Step 1:
修改为重导出模块
**

```typescript
// src/config/sectConfig.ts
/**
 * @deprecated 此文件已迁移至 src/domains/config/
 * 保留此文件仅用于向后兼容
 */

export {
  sectList,
  sectConfig,
  getSkillsBySect,
  type SectInfo,
  type SectConfigMap,
} from '../domains/config/index.ts';
```

*

*Step 2:
验证编译通过
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误

*

*Step 3:
验证应用运行
**

Run:
`pnpm dev`
Expected: 应用正常启动

*

*Step 4:
提交
**

```bash
git add src/config/sectConfig.ts
git commit -m "refactor(config): convert sectConfig to re-export module"
```

---

### Task 25: 删除废弃文件

*

*Files:
**

- Delete:
  `src/composables/useSkillData.ts`
- Delete:
  `src/composables/useSectValidation.ts`
- Delete:
  `src/store/useSkillInfoStore.ts`
- Delete:
  `src/store/useSkillCardInfoStore.ts`

*

*Step 1:
确认无引用
**

Run:
`pnpm exec tsc --noEmit`
Expected: 无类型错误（如果有引用，会报错）

*

*Step 2:
删除文件
**

```bash
git rm src/composables/useSkillData.ts
git rm src/composables/useSectValidation.ts
git rm src/store/useSkillInfoStore.ts
git rm src/store/useSkillCardInfoStore.ts
```

*

*Step 3:
验证应用运行
**

Run:
`pnpm dev`
Expected: 应用正常启动

*

*Step 4:
提交
**

```bash
git commit -m "refactor: remove deprecated composables and stores"
```

---

## 验证清单

完成后执行以下验证：

1.

*

*类型检查
**

```bash
pnpm exec tsc --noEmit
```

2.

*

*构建测试
**

```bash
pnpm build
```

3.

*

*功能验证
**
- 双重词条筛选页：属性/流派筛选、复选框切换 - 流派构建页：技能位配置、激活策略显示、继承切换 - 表单验证：流派选择、重复检测

4.

*

*清理提交
**

```bash
git status
git log --oneline -n 10
```

---

*计划生成日期:
2026-03-04*
