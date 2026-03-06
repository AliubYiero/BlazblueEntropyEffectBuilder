# 继承勾选框三态逻辑修复设计

## 问题

选择继承的双重策略后，如果该策略存在多个触发位，所有关联触发位的勾选框会同时激活为 `pending` 或 `checked` 状态。

**根本原因：** `getCheckboxState` 基于 `activatedSkills`（包含继承的策略）查找关联策略。一个策略被继承后，其所有触发位都会被视为 related，导致状态污染。

## 方案

将三态逻辑从 `SectBuilderPage.vue` 下沉到 `store.ts`，使用 `calculatedSkills`（仅自然激活的策略）代替 `activatedSkills`。

### 改动清单

1. **`store.ts`**：新增 `calculatedSkills` getter 和 `getCheckboxState` 方法
2. **`SectBuilderPage.vue`**：删除本地 `getCheckboxState`，使用 store 方法

### 修复原理

- `calculatedSkills` = 仅通过流派配置自然激活的策略（不含继承）
- `activatedSkills` = 自然激活 + 继承的策略（用于展示）
- 三态判断基于 `calculatedSkills`，继承的策略不会影响其他触发位
