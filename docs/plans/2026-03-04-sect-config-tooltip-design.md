# sectConfig Tooltip 显示设计文档

## 概述

修改 sect-item 的显示方式：默认显示流派名，鼠标浮动时通过 tooltip 显示技能名。

## 目标

- 默认显示流派名称（如"燃烧"）
- 鼠标浮动时显示对应的技能列表（如"普攻燃烧/技能燃烧/冲刺燃烧"）
- 如果技能列表为空，不显示 tooltip

## 架构

采用"默认文本 + 条件 Tooltip"模式：

1. **默认显示**：保持原有的 `skill.mainSect` / `skill.secondSect`（流派名）
2. **Tooltip 内容**：使用 `getSkillsBySect()` 返回的技能列表字符串
3. **条件渲染**：使用 `v-if` 判断，仅当技能列表非空时显示 tooltip
4. **实现方式**：使用 Element Plus 的 `el-tooltip` 组件

需要修改的文件：
- `src/components/SearchDoublePage/SearchDoubleEffectForm.vue`
- `src/components/SectBuilderPage/SelectableSkillCard.vue`

## 修改文件清单

| 文件 | 修改类型 | 说明 |
|------|----------|------|
| `src/components/SearchDoublePage/SearchDoubleEffectForm.vue` | 修改 | 将直接显示改为 tooltip 包裹 |
| `src/components/SectBuilderPage/SelectableSkillCard.vue` | 修改 | 将直接显示改为 tooltip 包裹 |

## 组件实现

### SearchDoubleEffectForm.vue

```vue
<div class="sect-item">
    <span :class="['element-dot', `element-dot--${styleMapper[skill.mainAttribute]}`]"></span>
    <template v-if="getSkillDisplay(skill.mainSect)">
        <el-tooltip :content="getSkillDisplay(skill.mainSect)" placement="top">
            <span class="sect-name">{{ skill.mainSect }}</span>
        </el-tooltip>
    </template>
    <template v-else>
        <span class="sect-name">{{ skill.mainSect }}</span>
    </template>
</div>
```

### SelectableSkillCard.vue

```vue
<span class="sect-tag">
    <span :class="['element-dot', `element-dot--${styleMapper[detail.mainAttribute]}`]"></span>
    <template v-if="getSkillDisplay(detail.mainSect)">
        <el-tooltip :content="getSkillDisplay(detail.mainSect)" placement="top">
            {{ detail.mainSect }}
        </el-tooltip>
    </template>
    <template v-else>
        {{ detail.mainSect }}
    </template>
</span>
```

## 数据流

```
sectConfig.ts (SectInfo[])
       ↓
getSkillsBySect() 函数
       ↓
组件模板 (el-tooltip content 绑定，v-if 条件判断)
       ↓
默认显示流派名 / Tooltip 显示技能列表
```

## 错误处理

1. **Tooltip 内容为空不显示**：使用 `v-if` 条件判断，仅当 `getSkillDisplay()` 返回非空值时渲染 `el-tooltip`
2. **技能列表过长**：Element Plus 的 tooltip 会自动处理长文本，有默认最大宽度
3. **向后兼容**：不修改数据结构，原有功能不受影响

## UI 变更

### 之前
```
[火] 普攻燃烧/技能燃烧/冲刺燃烧 + [刃] 冲刺飞剑
```

### 之后
```
[火] 燃烧 + [刃] 飞剑
        ↑ 鼠标浮动显示: 普攻燃烧/技能燃烧/冲刺燃烧
```

## 测试计划

1. **启动开发服务器**：`pnpm dev`
2. **验证双重词条筛选页**：
   - 默认显示流派名
   - 鼠标浮动显示 tooltip 技能列表
   - 检查 tooltip 位置是否正确
3. **验证流派构建页**：
   - 默认显示流派名
   - 鼠标浮动显示 tooltip
4. **验证边界情况**：
   - 单技能流派（如火环）
   - 带括号的流派名（如"寒冷 (寒气爆发)"）

## 约束

- 使用 Element Plus 的 `el-tooltip` 组件
- 保持 `getSkillDisplay()` 辅助函数
- 仅修改模板显示逻辑，不修改脚本逻辑
