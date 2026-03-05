# SkillCard 组件抽离设计文档

## 概述

将目前分散在三个文件中的"双重策略卡片"代码抽离为统一的公共组件 `SkillCard.vue`，提升代码复用性和可维护性。

## 背景

当前有三个地方独立实现了相似的卡片 UI：

1. **SearchDoubleEffectForm.vue** 中的 `skill-card` - 筛选结果展示
2. **SelectableSkillCard.vue** 中的 `skill-item` - 可选策略列表
3. **SectBuilderPage.vue** 中的 `activated-card` - 已激活策略展示

这些实现存在代码重复问题，抽离后可统一维护样式和行为。

## 设计决策

### 架构

- **组件位置**: `src/components/Public/SkillCard.vue`
- **组件类型**: 纯展示组件，不依赖 Store
- **数据传递**: 通过 props 接收 `SkillInfo` 数据
- **事件通信**: 通过 emits 暴露点击事件

### 组件接口

```typescript
interface SkillCardProps {
  // 核心数据
  skill: SkillInfo
  
  // 外观配置
  size?: 'compact' | 'normal'  // 默认 'normal'
  
  // 功能开关
  showTriggers?: boolean       // 是否显示触发位标签，默认 true
  showTooltip?: boolean        // 是否显示流派技能 Tooltip，默认 true
  
  // 交互
  clickable?: boolean          // 是否可点击
}

interface SkillCardEmits {
  (e: 'click', skill: SkillInfo): void
}
```

### 样式规范

| 元素 | normal | compact |
|------|--------|---------|
| padding | 16px | 10px 12px |
| 名称字号 | 14px | 13px |
| 描述字号 | 13px | 11px |
| 流派字号 | 13px | 11px |
| 间距 | 12px | 6-8px |

### 数据流

```
Props (skill: SkillInfo)
    ↓
Template 直接渲染
    ↓
Emit click 事件（可选）
```

### 使用场景

**SearchDoubleEffectForm.vue：**
```vue
<SkillCard 
  v-for="skill in filterSkillInfoList" 
  :key="skill.name"
  :skill="skill"
  size="normal"
  :show-triggers="true"
  :show-tooltip="true"
/>
```

**SelectableSkillCard.vue：**
```vue
<SkillCard 
  v-for="skill in filterDetailList" 
  :key="skill.name"
  :skill="skill"
  size="compact"
  :show-triggers="false"
  :show-tooltip="true"
  clickable
  @click="handleSkillClick(skill)"
/>
```

**SectBuilderPage.vue：**
```vue
<SkillCard 
  v-for="skill in activatedSkills" 
  :key="skill.name"
  :skill="skill"
  size="normal"
  :show-triggers="true"
  :show-tooltip="false"
/>
```

### 错误处理

- **Props 校验**: 使用 TypeScript 类型严格约束
- **空数据处理**: skill.trigger 为空时不渲染触发位区域
- **Tooltip 条件**: 流派无技能列表时不显示 Tooltip
- **样式降级**: CSS 变量未定义时优雅降级

### 测试要点

1. 三个使用场景渲染正常
2. 各 props 切换后效果正确
3. Tooltip 悬停显示流派技能列表
4. 两种尺寸样式差异正确
5. 点击事件正常触发
6. 替换后原有功能无退化

## 依赖

- `SkillInfo` 类型（来自 `core/data/types.ts`）
- `getSkillsBySect()` 工具函数（来自 `domains/config`）
- `element-dot` 全局样式类

## 实现范围

**YAGNI 原则：**
- 仅实现当前三个场景需要的功能
- 不预设未来可能需要的扩展（如自定义 slot、复杂交互等）
- 样式仅支持 compact/normal 两种预设

## 后续计划

调用 `writing-plans` 技能生成详细实施计划。
