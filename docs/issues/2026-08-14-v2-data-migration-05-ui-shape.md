# I5 · UI 全面切新形状：SkillCard 与装配/继承表单

## What to build

把 UI 显示层全部切到 V2 新形状（设计文档 §5-6、§4.3、Q10），移除 builder store 暴露层的临时投影，装配/继承表单与候选区从索引取数。

### SkillCard.vue（Q10：派生 helper 放 repository/core/data，组件保持薄）

- 流派显示：派生 `primary[0].style + secondary[0].style`（`X + Y` helper 放 repository / core/data，不在组件内联）；已验证单侧单一流派，`primary[0]`/`secondary[0]` 即该侧流派。
- 触发位徽标：用 `triggerSlots`。
- 属性圆点：用 `element`。
- 保留 `triggers` 可选 prop 覆盖行为（现有 `SelectableSkillCard` 依赖）。

### 装配 / 继承表单与候选区

- `InheritSkillForm`：候选列表从索引取（`triggerSlots` 含当前触发位的策略），字段切新形状；`setInheritSkill` 传 id。
- `ChangeSkillSectForm`：候选列表从索引取，可用触发位判定用 `stylesBySlot`。
- `SelectableSkillCard`：候选从索引取，继承 key 已由 I2 切 id，本切片同步剩余字段。
- `SelectSkillCard`：显示技能名匹配逻辑保持正确（I3 已同步命名）。
- `SectBuilderPage`：激活区与装配区统一新形状；移除 store 暴露层的临时投影。

## Acceptance criteria

- [ ] `vue-tsc && vite build` 通过
- [ ] SkillCard 显示「流派X + 流派Y」（来自 primary/secondary 首个候选）、触发位徽标来自 `triggerSlots`、属性圆点来自 `element`
- [ ] 装配「寒冷 (聚寒成冰)」+ 玄冰剑刃 →「冰击化剑」卡片显示为「玄冰剑刃 + 寒冷 (寒气爆发)」类派生组合（Q10，展示候选集而非用户所选变体）
- [ ] 装配页激活列表、候选卡片、继承对话框、修改流派对话框均正确显示新形状数据
- [ ] repository / store 中的临时投影不再被任何消费者使用（编译层面可删除）

## Blocked by

- [2026-08-14-v2-data-migration-02-activation-builder.md](2026-08-14-v2-data-migration-02-activation-builder.md)
- [2026-08-14-v2-data-migration-04-filter-search.md](2026-08-14-v2-data-migration-04-filter-search.md)
