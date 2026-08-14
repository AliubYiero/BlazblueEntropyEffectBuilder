# I4 · 筛选与搜索页换血：filter 按新形状重写

## What to build

把筛选域从旧 `SkillInfo` 形状切到 V2 索引/新策略形状（设计文档 §4.3、§5-5），搜索页（SearchDoublePage）表单与结果同步走新数据。

### filter/service.ts

- `applyFilter`：按 primary/secondary **候选集的 style** 匹配流派；属性匹配用 `element`；触发位匹配用策略的 `triggerSlots`（配合触发位复选框）。
- `getAttributeSuggestions` / `getSectSuggestions`：从索引 / 新形状聚合（`sectList` 为流派命名权威，36 流派全量可用）。
- `isFilterEmpty` / `areAllTriggersSelected`：同步到新形状与「传承技」命名。

### filter/store.ts

`filterResult` 改用索引数据（不再从投影旧形状取值）。

### 搜索页

SearchDoublePage（SearchDoubleEffectForm）的筛选结果渲染走新形状；自动补全建议来自索引聚合 + `sectConfig`。

## Acceptance criteria

- [ ] `vue-tsc && vite build` 通过
- [ ] 搜索页按属性 / 流派 / 触发位筛选，结果与 V2 数据一致（含触发位「传承技」筛选）
- [ ] 属性 / 流派自动补全建议正确（全部流派经 `sectList`，含寒冷变体、毒泡河豚、暗影标记）
- [ ] 流派复选框（主流派/副流派）语义在新形状下仍正确（primary/secondary 候选匹配）
- [ ] 筛选为空判定、全选判定正确

## Blocked by

- [2026-08-14-v2-data-migration-02-activation-builder.md](2026-08-14-v2-data-migration-02-activation-builder.md)
