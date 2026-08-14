# I1 · 数据层换血：V2 索引 + 临时投影

## What to build

将策略数据的单一来源从 V1 扁平结构切换到 V2 索引结构，同时保持现有页面行为不变（通过临时投影过渡）。

### 目标数据模型（设计文档 §3.1，决策已定稿，直接照抄类型形状）

```ts
import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../../domains/config/types.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';

/** 策略的单个候选条件：某个触发位上装配的某个流派 */
export interface DualStrategyCondition {
  slot: Trigger;       // 触发位（普攻/技能/冲刺/传承技/召唤）
  style: SectValue;    // 流派（命名对齐 sectList）
  name: string;        // 具体技能名，如「普攻燃烧」
}

/** 双重策略（V2 的 dualStrategies 元素） */
export interface DualStrategyInfo {
  id: string;                       // 稳定主键（去重/继承/持久化用）
  name: string;                     // 显示名
  element: Attribute;               // 属性
  triggerSlots: Trigger[];          // 触发位（显式检查）
  primary: DualStrategyCondition[]; // 主条件候选集（单一流派，多槽位）
  secondary: DualStrategyCondition[]; // 副条件候选集（单一流派，多槽位）
  description: string;
}

/** 加载时一次性构建的只读索引 */
export interface DualStrategyIndex {
  strategies: readonly DualStrategyInfo[];
  /** (slot, style) 规范化后 -> 策略 id 列表 */
  bySlotStyle: ReadonlyMap<string, readonly string[]>;
  /** 别名展开：变体 style -> canonical style（寒冷(寒气爆发) -> 寒冷） */
  canonicalStyle: ReadonlyMap<SectValue, SectValue>;
  /** 由 V2.slots 派生：触发位 -> 可用流派列表 */
  stylesBySlot: ReadonlyMap<Trigger, readonly SectValue[]>;
}

export type FrozenDualStrategyIndex = Readonly<DualStrategyIndex>;
```

`SkillInfo` 类型**暂留**：作为临时投影的显示类型，供未迁移消费者编译，最终在收尾切片 I6 删除。

### 加载器换源

- `import('../../data/DoubleSkillInfoListV2.json')`，校验 `version === '2.0'`。
- 构建 `DualStrategyIndex`：
  - `canonicalStyle`：遍历 `styleAliases`，把每个变体映射到 canonical（当前仅一条：`寒冷 → [寒冷 (寒气爆发), 寒冷 (聚寒成冰)]`）。
  - `bySlotStyle`：遍历 `dualStrategies` 的 primary/secondary，按规范化后的 `(slot, style)` 建立倒排。
  - `stylesBySlot`：直接来自 V2 `slots`。
- `deepFreeze` 整个索引。
- 保留 `loadSkillData`/`getCachedSkillData`/`resetCache` 语义（返回值改为 `FrozenDualStrategyIndex`）。

### 仓库层临时投影（过渡机制，I6 删除）

`skill/repository.ts` 新增索引访问器；旧形状 getters（`getSkillInfoList`/`getSectAttributeMap`/`getTriggerInfoList`/`filterByAttribute`/`filterBySect`/`filterByTrigger`/`filterSkills`/`getValidTriggersForSect`/`isValidSect`/`getAttributeBySectValue`）改为**从索引派生**，产出与 V1 等价的显示数据，保证 UI/筛选/装配/校验在过渡期编译与行为不破。

投影规则（从 `DualStrategyInfo` 派生出旧形状显示对象）：
- `mainSect` ← `primary[0].style`，`secondSect` ← `secondary[0].style`（单侧总是单一流派，Q3/Q10）
- `mainAttribute`/`secondAttribute` ← `element`
- `trigger` ← `triggerSlots`，且**将「传承技」映射为「传承」**（V2 原生用传承技；旧消费者仍用传承，映射在 I3 移除）

V2 命名对齐事实（设计文档 §3.3，已确认 V2 现状）：
- V2 的 style 已对齐 `sectList`（`寒冷 (寒气爆发)`、`毒泡河豚`、`暗影标记` 等，无空格差异）
- V2 的触发位 key 用「传承技」，`sectList`/config/UI 用「传承」——反向迁移发生在 I3

## Acceptance criteria

- [ ] `vue-tsc && vite build` 通过
- [ ] V2 载入成功（控制台日志无报错），`version === '2.0'` 校验生效
- [ ] 索引三结构（`canonicalStyle`/`bySlotStyle`/`stylesBySlot`）构建正确且整个索引被冻结（只读，写操作抛错或静默失败）
- [ ] 现有页面（装配页 / 搜索页）显示与迁移前一致（临时投影生效，激活集合不变）
- [ ] `resetCache`/缓存语义保留

## Blocked by

None - can start immediately
