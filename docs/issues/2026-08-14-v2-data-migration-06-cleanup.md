# I6 · 收尾清理：删除 V1 / 旧类型 / 临时投影

## What to build

迁移收尾（设计文档 §2 Q2/Q9/Q13/Q14、§7 非目标），让 V2 成为唯一数据源，代码库只保留新模型路径。

- **删除 V1**：`DoubleSkillInfoListV1.json`（Q2：彻底删除，V2 为唯一数据源）。
- **删除旧类型**：`SkillInfo` 及旧字段（core/data/types.ts），`DoubleSkillName` 若不再被引用一并清理。
- **删除临时投影**：repository 的旧形状 getters（`getSkillInfoList`/`getSectAttributeMap`/`getTriggerInfoList`/`filterByAttribute`/`filterBySect`/`filterByTrigger`/`filterSkills`/`getValidTriggersForSect`/`isValidSect`/`getAttributeBySectValue`）及投影映射；确认无任何消费者。
- **删除 add-descriptions**：设计 §6 Q13 要求删除（依赖 V1，与生成链重叠）。当前工作区未发现该脚本，需在 git 历史确认；若从未存在则跳过并在 PR 说明。
- **移除 deprecated `sectConfig`**（config/constants.ts 标注 @deprecated）：若引用方已全部迁移到 `sectList`/`getSectsByAttribute`。
- `exportConfiguration`/`importConfiguration` **保持未接线**（Q14，不做 localStorage，本切片不动它们）。
- 不做 UI 组件重构、不把 `sectList` 收编进 V2 生成链、不引入 vitest（§7 非目标）。

## Acceptance criteria

- [ ] `vue-tsc && vite build` 通过
- [ ] V1 数据文件不存在；代码库无对 V1 数据 / 旧 `SkillInfo` 形状的引用
- [ ] repository 无投影代码；UI、筛选、装配、校验全部走 V2 索引
- [ ] 全功能可用：装配 → 激活判定（含寒冷变体修复）、继承（id 化）、筛选、搜索
- [ ] `exportConfiguration`/`importConfiguration` 仍存在但未接线（保持现状）
- [ ] add-descriptions 状态在 PR 说明中交代（已删 / 从未存在）

## Blocked by

- [2026-08-14-v2-data-migration-03-naming-trigger-slot.md](2026-08-14-v2-data-migration-03-naming-trigger-slot.md)
- [2026-08-14-v2-data-migration-04-filter-search.md](2026-08-14-v2-data-migration-04-filter-search.md)
- [2026-08-14-v2-data-migration-05-ui-shape.md](2026-08-14-v2-data-migration-05-ui-shape.md)
