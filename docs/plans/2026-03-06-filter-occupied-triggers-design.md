# 过滤已占用触发位显示

## 需求

在流派配置区域的 `SelectableSkillCard` 中，技能卡片的触发位 badge 应隐藏已被占用（`checked` 状态）的触发位。`pending` 状态不算占用。如果过滤后所有触发位都被占用，隐藏整张卡片。

## 示例

燃烧爆弹触发位为 普攻/冲刺/技能。当"冲刺"在 inherit-filters 中为 `checked` 状态时，燃烧爆弹只显示 普攻/技能。

## 方案

采用方案 A：在 `SelectableSkillCard` 中过滤触发位，通过新 prop 传递给 `SkillCard`。

### 修改文件

1. **`src/components/Public/SkillCard.vue`**
   - 新增可选 prop `triggers?: Trigger[]`
   - 触发位渲染改为 `triggers ?? skill.trigger`
   - 不传时行为不变，向后兼容

2. **`src/components/SectBuilderPage/SelectableSkillCard.vue`**
   - 新增 computed `occupiedTriggers`: 收集 `getCheckboxState` 为 `checked` 的触发位集合
   - `filterDetailList` 返回 `{ skill, availableTriggers }[]`，过滤掉被占用触发位
   - 可用触发位为空的技能不显示
   - SkillCard 渲染时传递 `:triggers="item.availableTriggers"`

### 数据流

```
builderStore.getCheckboxState(trigger) === 'checked'
  → occupiedTriggers: Set<Trigger>
  → skill.trigger.filter(t => !occupiedTriggers.has(t))
  → 空 → 隐藏卡片
  → 非空 → 传给 SkillCard triggers prop
```
