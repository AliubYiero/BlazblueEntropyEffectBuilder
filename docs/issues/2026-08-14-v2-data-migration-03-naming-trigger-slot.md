# I3 · 命名对齐：触发位「传承」→「传承技」

## What to build

把触发位的「传承」字面量全量迁移为「传承技」（CONTEXT.md 术语表 + 设计文档 §3.3/Q5，决策已定稿），并移除 repository 投影中的 `传承技→传承` 映射。

> ⚠️ 本切片必须一次到位：`Trigger` 联合类型一旦改为「传承技」，所有引用旧字面量的代码在同一落地态内必须同步改完，否则编译失败。因此命名迁移无法拆进多个切片。

对齐表（设计文档 §3.3，V2 数据已是目标状态，本切片改的是 config/UI 侧）：

| V2 现状 | 迁移目标 |
|---|---|
| 触发位 `传承技`（V2 slots/triggerSlots 已用） | 保留；config/UI 的 `传承` 反向迁移为 `传承技` |

涉及面（全量扫描，凡出现触发位 `传承` 字面量处都改）：
- `interfaces/Trigger.ts`：联合类型成员
- `config/types.ts`：`SectSkill.trigger` 联合类型
- `config/constants.ts`：`triggerList`，以及 `sectList` 内每条 `skill` 的 `trigger` 值（如 `传承技火弹`）
- `filter/types.ts`：`TriggerCheckboxState` 键
- `filter/store.ts`：`defaultTriggerCheckboxes`
- `filter/service.ts`：`getExcludedTriggers`
- `builder/store.ts`：`DEFAULT_SKILL_CARDS` / `VALID_TRIGGERS`
- `builder/types.ts`：相关注释
- `components/SearchDoublePage/SearchDoubleEffectForm.vue`：触发位复选框 key
- 其他 grep `传承` 扫描出的引用点（排除 V1 数据文件与 V2 数据文件）

同时：
- 移除 `repository.ts` 投影里的 `传承技→传承` 映射（I1 建立的过渡映射，对齐后不再需要）。
- `SelectSkillCard.vue` 的 `displaySkillName` 用 `sectList.skill.trigger === triggerName` 匹配——`sectList` 与 `triggerName` 同步改后匹配仍正确，需验证。

## Acceptance criteria

- [ ] `vue-tsc && vite build` 通过
- [ ] 代码库（排除数据 JSON）中不再存在触发位「传承」字面量（「传承技」除外）
- [ ] 装配页触发位标签、搜索页/装配页的触发位复选框均显示「传承技」，且行为与迁移前一致
- [ ] `SelectSkillCard` 的显示技能名匹配正确（如「传承技火弹」显示火弹技能名而非流派名回退）
- [ ] repository 投影中无 `传承技→传承` 映射残留

## Blocked by

- [2026-08-14-v2-data-migration-01-data-layer.md](2026-08-14-v2-data-migration-01-data-layer.md)
