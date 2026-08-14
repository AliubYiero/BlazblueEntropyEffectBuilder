# V2 数据迁移与算法重构设计文档

> 状态：已评审定稿（2026-08-14 grill-with-docs 会话）
> 关联：`CONTEXT.md`（术语表）、`docs/adr/0001-data-source-and-naming-unification.md`（数据源与命名决策）

## 1. 背景与动机

### 1.1 当前痛点

- **三份数据源对不齐**：`src/data/DoubleSkillInfoListV1.json`、`src/data/DoubleSkillInfoListV2.json`、`src/domains/config/constants.ts` 的 `sectList` 对同一概念命名不一致（触发位「传承/传承技」、寒冷变体空格、毒泡河豚/河豚、暗影标记/影标），导致算法与 UI 相互对不齐。
- **`mainSect`/`secondSect` 语义任意**：V1 扁平编码里"哪边是主、哪边是副"没有规律，当前激活算法靠 `||` 蒙混，无法表达真实的候选集合与触发位约束。
- **语义 bug**：`config` 把「寒冷 / 寒冷 (寒气爆发) / 寒冷 (聚寒成冰)」当 3 个独立流派，V1 数据里「冰击化剑」硬编码 `secondSect="寒冷 (寒气爆发)"`，导致装配「寒冷 (聚寒成冰)」+ 玄冰剑刃时不会激活，而 V2 的 `styleAliases` 声明它们等价。
- **重复计算**：一次 store 变更会触发 `calculateActivatedSkills` 3~4 次；`getSectAttributeMap`/`getTriggerInfoList` 每次访问都重扫全表。

### 1.2 迁移目标（三者都是）

1. **语义正确性**：激活判定基于 V2 的真实候选集与 `triggerSlots`，修复寒冷变体等 bug。
2. **算法性能**：消除重复计算、派生数据从索引取，激活判定从全表扫描改为索引查表。
3. **数据单一来源**：删除 V1，V2 为唯一策略数据源；`sectList` 为流派命名权威，生成端对齐。

---

## 2. 决策摘要（已敲定）

| # | 决策 | 结论 |
|---|---|---|
| Q1 | 优化目标 | 语义正确性 + 算法性能 + 单一数据源，三者都是 |
| Q2 | V1 去留 | 彻底删除，V2 为唯一数据源 |
| Q3 | 迁移范围 | 数据层 + 算法先行；UI 显示派生自候选集（"X + Y"） |
| Q4 | 激活语义 | 保留显式 `triggerSlots` 检查（OR 规则），不搞特例；处理 `configuredSects` Map 碰撞 |
| Q5 | 命名 | 触发位统一「传承技」；流派名以 `sectList` 为权威，V2 生成时对齐；术语统一见 `CONTEXT.md` |
| Q6 | 性能路径 | 优先级：消除重复计算 > 派生数据从索引取 > 倒排索引 |
| Q7 | 继承存储 | `inheritSkill` 改存策略 `id`，去重/三态/自动继承 key 切到 `id` |
| Q8 | sectList 关系 | 本次只做命名对齐 + 生成端校验；收编进 V2 另议 |
| Q9 | 类型落地 | 全量换血，废弃旧接口层，不设兼容壳 |
| Q10 | UI 派生 | `X + Y` 派生 helper 放 repository / core/data，组件保持薄 |
| Q11 | 执行顺序 | 自底向上 6 步，每步以 `vue-tsc && vite build` 为门禁 |
| Q12 | 验证策略 | 轻量 .mjs 校验脚本（数据自检 + V1↔V2 行为对照），激活算法抽成可被 node import 的纯函数 |
| Q13 | add-descriptions | 删除（依赖 V1，与 build 脚本功能重叠） |
| Q14 | 持久化 | 无人调用，无兼容包袱；`exportConfiguration`/`importConfiguration` 保持未接线，不做 localStorage |

---

## 3. 目标数据模型

### 3.1 核心类型（`src/core/data/types.ts`）

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

### 3.2 加载器（`src/core/data/loader.ts`）

- `import('../../data/DoubleSkillInfoListV2.json')`，校验 `version === '2.0'`。
- 构建 `DualStrategyIndex`：
  - `canonicalStyle`：遍历 `styleAliases`，把每个变体映射到 canonical；策略候选与 `slots` 的 style 在匹配前先走规范化。
  - `bySlotStyle`：遍历 `dualStrategies` 的 primary/secondary，按规范化后的 `(slot, style)` 建立倒排。
  - `stylesBySlot`：直接来自 V2 `slots`（命名对齐后）。
- `deepFreeze` 整个索引。
- 保留 `getCachedSkillData`/`resetCache` 语义（返回 `FrozenDualStrategyIndex`）。

### 3.3 数据文件命名对齐

V2 生成时对齐到 `sectList`（Q5/Q8）：

| 现状（V2） | 对齐后（与 sectList 一致） |
|---|---|
| 触发位 `传承技` | `传承技`（保留，config/UI 的 `传承` 反向迁移） |
| style `寒冷(寒气爆发)` | `寒冷 (寒气爆发)` |
| style `寒冷(聚寒成冰)` | `寒冷 (聚寒成冰)` |
| style `河豚` | `毒泡河豚` |
| style `影标` | `暗影标记` |

`slots`、`styleAliases`、策略的 `style`/`name` 全部随生成对齐。

---

## 4. 激活算法（核心）

### 4.1 统一规则（Q4 确认，保留显式检查）

> 策略激活 ⟺ primary 某个候选 `(slot, style)` 命中一张已配置卡片 ∧ secondary 某个候选命中 ∧（命中的 primary 槽位 ∈ triggerSlots ∨ 命中的 secondary 槽位 ∈ triggerSlots）

伪代码：

```ts
export function calculateActivatedSkills(
  cards: SkillCardInfoTuple,
  index: DualStrategyIndex,
): DualStrategyInfo[] {
  // 配置快照：slot -> style（同流派配两个槽位时按 Q4 决议处理，见 4.2）
  const configured = new Map<Trigger, SectValue>();
  for (const card of cards) {
    if (card.sect) configured.set(card.triggerName, canonical(card.sect, index));
  }
  if (configured.size < 2) return [];

  const activated: DualStrategyInfo[] = [];
  for (const strategy of index.strategies) {
    const primaryHit = hit(strategy.primary, configured);
    const secondaryHit = hit(strategy.secondary, configured);
    if (!primaryHit || !secondaryHit) continue;

    const primaryInTrigger = primaryHit.some(p => strategy.triggerSlots.includes(p.slot));
    const secondaryInTrigger = secondaryHit.some(p => strategy.triggerSlots.includes(p.slot));
    if (primaryInTrigger || secondaryInTrigger) activated.push(strategy);
  }
  return activated;
}

function hit(candidates, configured) {
  // 候选 style 规范化后与 configured 比对；返回命中的候选子集
}
```

### 4.2 `configuredSects` Map 碰撞处理

现状：`configuredSects` 是 `sect → triggerName`，同流派配到两个槽位时后者覆盖前者。迁移后配置快照改为 `slot → style`，**每个触发位一张卡片是固有结构**（5 个固定槽位），碰撞语义随之消失；同流派多槽位会自然在 `hit()` 里命中多个候选，无需特判。

### 4.3 派生数据（`skill/repository.ts`）

- `getSectAttributeMap`：保留，但改从 `index.stylesBySlot` 聚合全部 style，再经 `getAttributeBySect`（config）取属性。
- `getTriggerInfoList`（流派 → 支持触发位）：直接从 `index.stylesBySlot` 反查（style → 它出现在哪些 slot 的 styles 列表），不再扫策略。
- `getAvailableTriggersForSect` / `isValidSectTriggerCombination`：同样从 `stylesBySlot` 取。
- `filterByXxx` / `filterSkills`：对新的策略形状重写，按 primary/secondary style 匹配。

### 4.4 继承与去重（`builder/store.ts`，Q7）

- `SkillCardInfo.inheritSkill?: SkillInfo` → 存策略 `id`；激活结果里反查完整 `DualStrategyInfo`。
- 去重、`clearInvalidInheritedSkills`、`autoInheritSingleTriggerSkills`、`getCheckboxState` 的 key 全部从 `name` 切到 `id`。
- `calculateActivatedSkills` 的 3~4 次重复调用收敛：store 内改为**单次计算 + 缓存**（Q6-b）。天然激活（`calculatedSkills`）作为唯一计算入口，其余动作复用其结果。

---

## 5. 迁移步骤（自底向上，Q11）

每步以 `vue-tsc && vite build` 为门禁；第 2~4 步另以 node 校验脚本验证。

1. **`core/data/types.ts`**：新增 `DualStrategyInfo`/`DualStrategyCondition`/`DualStrategyIndex`，废弃 `SkillInfo` 及旧字段。
2. **`core/data/loader.ts`**：改载 V2，构建并冻结索引。
3. **`skill/repository.ts`**：派生数据与筛选改从索引取。
4. **`builder/service.ts` + `store.ts`**：重写激活算法（§4）、id 继承、单次计算缓存。
5. **`filter/service.ts`**：按新形状重写筛选与建议（`applyFilter`/`getAttributeSuggestions`/`getSectSuggestions`）。
6. **UI**：`SkillCard.vue` 显示派生 `primary[0].style + secondary[0].style`（已验证单侧单一流派）、触发位徽标用 `triggerSlots`、属性圆点用 `element`；`SectBuilderPage` 继承选择与 `SearchDoublePage` 表单同步字段。

> UI 侧只做"能编译 + 显示正确"，不做组件重构（Q3 方案 a）。

---

## 6. 生成与校验（Q8/Q12/Q13）

---

## 7. 非目标（明确不做）

- UI 组件重构（SkillCard/SectBuilderPage/SearchDoublePage 只改字段）。
- 把 `sectList` 收编进 V2 生成链（后续独立 ADR）。
- localStorage 持久化接线（`exportConfiguration`/`importConfiguration` 保持未接线）。
- 引入 vitest（后续可加）。

---

## 8. 风险与预期行为变化

- **寒冷变体激活行为变化**：这是有意的语义修复。装配任一寒冷变体 + 玄冰剑刃都会激活「冰击化剑」。
- **触发位展示变化**：UI 从「传承」迁移到「传承技」，`triggerList`（config/constants.ts）同步更新，涉及所有引用了 `传承` 字面量的地方（filter store 默认值、validation、组件）。
- **继承数据格式**：`inheritSkill` 由对象改 `id`，无人调用导出/导入，无兼容包袱（Q14 确认）。
