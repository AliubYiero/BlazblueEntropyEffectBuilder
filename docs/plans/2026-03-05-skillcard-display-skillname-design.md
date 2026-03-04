# SkillCard 显示技能名设计文档

## 需求概述
将 `SkillCard.vue` 组件中选择流派后的显示内容由流派名称改为该流派在当前触发位下的具体技能名称。

**示例**：
- 选择流派 "暗影标记"，触发位为 "普攻"
- 当前显示："暗影标记"
- 期望显示："普攻影标"

## 设计决策

### 方案选择
采用计算属性方案，在组件层处理显示逻辑，不修改数据流和架构。

### 关键决策
1. **技能名查找**：只显示第一个匹配的技能名（根据 sect 和 trigger 匹配）
2. **流派信息**：不需要额外显示流派名称，技能名已足够
3. **错误回退**：如果找不到对应技能，回退到显示流派名称

## 组件修改

### SkillCard.vue 改动点

1. **添加导入**：
   - `computed` from 'vue'
   - `sectList` from '../../domains/config/constants.ts'

2. **添加计算属性 `displaySkillName`**：
   - 根据 `skillCardInfo.sect` 和 `skillCardInfo.triggerName` 查找对应技能
   - 返回匹配的技能名，找不到则返回流派名

3. **模板更新**：
   - 将 `{{ skillCardInfo.sect }}` 改为 `{{ displaySkillName }}`

## 数据流
无需修改，保持现有数据流：
```
user selects sect → updateSkillCardInfo → skillCardInfo.sect updated → displaySkillName recomputed
```

## 错误处理
- 如果 `sectList` 中找不到对应流派 → 显示原流派名
- 如果找到流派但无匹配的 trigger → 显示原流派名
- 空状态保持不变：显示 "点击选择"

## 实现步骤
1. 在 `SkillCard.vue` 中添加 `computed` 和 `sectList` 导入
2. 创建 `displaySkillName` 计算属性
3. 更新模板使用新的显示值
4. 验证各流派在各触发位下正确显示

## YAGNI 检查
- ✓ 不添加额外功能（如 Tooltip 显示流派名）
- ✓ 不修改数据结构
- ✓ 只在组件层处理显示逻辑
