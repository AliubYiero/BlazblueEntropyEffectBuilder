# 数据源与命名统一：V2 为唯一数据源，sectList 为流派命名权威

三份数据源对同一概念命名不一致（触发位「传承/传承技」、寒冷变体空格差异、毒泡河豚/河豚、暗影标记/影标），导致算法与 UI 相互对不齐、激活判定存在语义歧义。我们决定：删除 `DoubleSkillInfoListV1.json`，`DoubleSkillInfoListV2.json` 成为唯一策略数据源；流派命名以 `config/sectList` 为权威，V2 数据在生成时对齐；触发位统一为「传承技」；领域术语统一为「双重策略 / 触发位 / 流派 / 属性」，见 `CONTEXT.md`。

**Status**: accepted

**Considered Options**:
- 以 V2 为命名权威，反向改 config/UI：否决。UI 装配与校验面以 sectList 为主，改动成本更高，且 sectList 是人工维护的完整目录。
- 保留 V1 与 V2 双数据源：否决。双份数据需同步，正是本次迁移要消除的维护成本。

**Consequences**: V2 的 `name`/`style`/`slots`/`triggerSlots` 均需对齐 sectList 命名；config 与 UI 中的「传承」逐步迁移为「传承技」。
