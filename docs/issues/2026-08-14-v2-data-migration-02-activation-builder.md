# I2 · 激活链路换血：新算法 + 继承 id 化 + 单次计算缓存

## What to build

把 builder 域的激活判定从 V1 的 `||` 蒙混逻辑切到 V2 真实候选集 + `triggerSlots` 显式检查（设计文档 §4，Q4 已确认），继承存储改存策略 `id`（Q7），消除重复计算（Q6-b）。

### 激活算法（设计文档 §4.1 伪代码，决策已定稿）

> 策略激活 ⟺ primary 某个候选 `(slot, style)` 命中一张已配置卡片 ∧ secondary 某个候选命中 ∧（命中的 primary 槽位 ∈ triggerSlots ∨ 命中的 secondary 槽位 ∈ triggerSlots）

```ts
export function calculateActivatedSkills(
  cards: SkillCardInfoTuple,
  index: DualStrategyIndex,
): DualStrategyInfo[] {
  // 配置快照：slot -> style（规范化后比对）
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
```

- 候选 style 与配置 sect 在比对前先走 `canonicalStyle` 规范化——这是寒冷变体 bug 的修复点（§4.2：配置快照改 `slot → style`，碰撞语义随之消失；同流派多槽位自然命中多个候选，无需特判）。
- 实现时保持纯函数形态：不依赖 Vue，接受 `(cards, index)` 入参（设计 §4 与 Q12 的意图；本轮不建校验脚本）。

### 继承存储 id 化（Q7）

- `SkillCardInfo.inheritSkill?: SkillInfo` → 存策略 `id`；激活结果里反查索引得完整 `DualStrategyInfo`。
- 去重、`clearInvalidInheritedSkills`、`autoInheritSingleTriggerSkills`、`getCheckboxState` 的 key 全部从 `name` 切到 `id`。
- 本切片涉及 `builder/types.ts` 的 `inheritSkill` 类型变更，会连带 `InheritSkillForm` 的 `setInheritSkill` 调用与 `SelectableSkillCard` 的 `.inheritSkill.name` 读取各改动一处（id 反查），无法推迟到 I5。

### 单次计算缓存（Q6-b）

`calculatedSkills` 作为唯一计算入口（基于新算法 + 索引）；`activatedSkills`、`clearInvalidInheritedSkills`、`autoInheritSingleTriggerSkills` 复用其结果，消除一次 store 变更触发 3~4 次 `calculateActivatedSkills` 的重复。

### 过渡期展示

store 暴露层（`activatedSkills`）保持投影旧形状供未迁移 UI 编译；UI 全面切新形状在 I5，本切片不迁移 UI 渲染。

## Acceptance criteria

- [ ] `vue-tsc && vite build` 通过
- [ ] 装配「寒冷 (聚寒成冰)」+ 玄冰剑刃 →「冰击化剑」激活（寒冷变体 bug 修复，设计 §8）
- [ ] 装配「寒冷 (寒气爆发)」+ 玄冰剑刃 →「冰击化剑」同样激活（styleAliases 等价）
- [ ] 单触发位策略自动继承仍正确；继承去重按 `id` 生效（重名不同 id 不互相误删）
- [ ] 一次 store 变更（updateSkillCardInfo）只触发一次 `calculateActivatedSkills`（可用临时计数验证）
- [ ] 已激活列表显示与迁移前一致（投影兜底；仅激活集合因语义修复而变化）

## Blocked by

- [2026-08-14-v2-data-migration-01-data-layer.md](2026-08-14-v2-data-migration-01-data-layer.md)
