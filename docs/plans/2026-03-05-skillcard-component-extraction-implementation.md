# SkillCard 组件抽离实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将分散在三个文件中的双重策略卡片代码抽离为统一的公共组件 SkillCard.vue

**Architecture:** 创建一个纯展示组件 SkillCard.vue，通过 props 接收 SkillInfo 数据和配置选项（size、showTriggers、showTooltip、clickable），支持 compact/normal 两种尺寸，内部使用 Element Plus 的 Tooltip 组件显示流派技能列表。

**Tech Stack:** Vue 3, TypeScript, Element Plus, SCSS

---

## 前置信息

**涉及的源文件：**
- `src/components/SearchDoublePage/SearchDoubleEffectForm.vue` - 第 85-125 行的 skill-card 样式和第 178-210 行的模板代码
- `src/components/SectBuilderPage/SelectableSkillCard.vue` - 第 15-52 行的 skill-item 样式和第 66-95 行的模板代码
- `src/views/SectBuilderPage.vue` - 第 15-65 行的 activated-card 样式和第 128-145 行的模板代码

**目标文件：**
- `src/components/Public/SkillCard.vue` - 新建

**依赖：**
- `SkillInfo` 类型来自 `src/core/data/types.ts`
- `getSkillsBySect` 函数来自 `src/domains/config/index.ts`
- `Attribute` 类型来自 `src/interfaces/Attribute.ts`
- `element-dot` 样式类已在全局定义

---

## Task 1: 创建 SkillCard.vue 组件文件

**Files:**
- Create: `src/components/Public/SkillCard.vue`

**Step 1: 创建组件基础结构**

```vue
<script lang="ts" setup>
import { computed } from 'vue';
import type { SkillInfo } from '../../core/data/types.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import { getSkillsBySect } from '../../domains/config/index.ts';

interface Props {
  skill: SkillInfo;
  size?: 'compact' | 'normal';
  showTriggers?: boolean;
  showTooltip?: boolean;
  clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'normal',
  showTriggers: true,
  showTooltip: true,
  clickable: false,
});

const emit = defineEmits<{
  (e: 'click', skill: SkillInfo): void;
}>();

const handleClick = () => {
  if (props.clickable) {
    emit('click', props.skill);
  }
};

const styleMapper: Record<Attribute, string> = {
  '火': 'fire',
  '冰': 'ice',
  '电': 'thunder',
  '毒': 'poison',
  '暗': 'dark',
  '光': 'light',
  '刃': 'blade',
};

const getSkillDisplay = (sectName: string): string => {
  return getSkillsBySect(sectName);
};
</script>

<template>
  <div
    class="skill-card"
    :class="[`skill-card--${size}`, { 'skill-card--clickable': clickable }]"
    @click="handleClick"
  >
    <!-- Header: 名称 + 触发位 -->
    <div class="skill-card__header">
      <h3 class="skill-card__name">{{ skill.name }}</h3>
      <div v-if="showTriggers && skill.trigger.length > 0" class="skill-card__triggers">
        <span
          v-for="trigger in skill.trigger"
          :key="trigger"
          class="trigger-badge"
        >
          {{ trigger }}
        </span>
      </div>
    </div>

    <!-- Sects: 流派组合 -->
    <div class="skill-card__sects">
      <!-- 主流派 -->
      <div class="sect-item">
        <span
          :class="['element-dot', `element-dot--${styleMapper[skill.mainAttribute]}`]"
        ></span>
        <template v-if="showTooltip && getSkillDisplay(skill.mainSect)">
          <el-tooltip :content="getSkillDisplay(skill.mainSect)" placement="top">
            <span class="sect-name">{{ skill.mainSect }}</span>
          </el-tooltip>
        </template>
        <template v-else>
          <span class="sect-name">{{ skill.mainSect }}</span>
        </template>
      </div>

      <span class="sect-connector">+</span>

      <!-- 副流派 -->
      <div class="sect-item">
        <span
          :class="['element-dot', `element-dot--${styleMapper[skill.secondAttribute]}`]"
        ></span>
        <template v-if="showTooltip && getSkillDisplay(skill.secondSect)">
          <el-tooltip :content="getSkillDisplay(skill.secondSect)" placement="top">
            <span class="sect-name">{{ skill.secondSect }}</span>
          </el-tooltip>
        </template>
        <template v-else>
          <span class="sect-name">{{ skill.secondSect }}</span>
        </template>
      </div>
    </div>

    <!-- Description: 描述 -->
    <p class="skill-card__desc">{{ skill.description }}</p>
  </div>
</template>

<style lang="scss" scoped>
.skill-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  transition: all 0.15s ease;

  &:hover {
    border-color: hsl(var(--ring));
    background: hsl(var(--accent) / 0.3);
  }
}

.skill-card--normal {
  padding: 16px;

  .skill-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .skill-card__name {
    font-family: var(--font-chinese);
    font-size: 14px;
    font-weight: 600;
    color: hsl(var(--foreground));
  }

  .skill-card__triggers {
    display: flex;
    gap: 4px;
  }

  .trigger-badge {
    font-family: var(--font-chinese);
    font-size: 11px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: calc(var(--radius) - 4px);
    background: hsl(var(--secondary));
    color: hsl(var(--secondary-foreground));
  }

  .skill-card__sects {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .sect-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .sect-name {
    font-family: var(--font-chinese);
    font-size: 13px;
    font-weight: 500;
    color: hsl(var(--foreground));
  }

  .sect-connector {
    color: hsl(var(--muted-foreground));
    font-size: 12px;
  }

  .skill-card__desc {
    font-family: var(--font-chinese);
    font-size: 13px;
    line-height: 1.5;
    color: hsl(var(--muted-foreground));
    padding-top: 8px;
    border-top: 1px solid hsl(var(--border));
  }
}

.skill-card--compact {
  padding: 10px 12px;

  .skill-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .skill-card__name {
    font-family: var(--font-chinese);
    font-size: 13px;
    font-weight: 500;
    color: hsl(var(--foreground));
  }

  .skill-card__triggers {
    display: flex;
    gap: 4px;
  }

  .trigger-badge {
    font-family: var(--font-chinese);
    font-size: 10px;
    font-weight: 500;
    padding: 2px 6px;
    border-radius: calc(var(--radius) - 4px);
    background: hsl(var(--secondary));
    color: hsl(var(--secondary-foreground));
  }

  .skill-card__sects {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .sect-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .sect-name {
    font-family: var(--font-chinese);
    font-size: 11px;
    color: hsl(var(--foreground));
  }

  .sect-connector {
    color: hsl(var(--muted-foreground));
    font-size: 10px;
  }

  .skill-card__desc {
    font-family: var(--font-chinese);
    font-size: 11px;
    color: hsl(var(--muted-foreground));
    line-height: 1.4;
  }
}

.skill-card--clickable {
  cursor: pointer;
}
</style>
```

**Step 2: 验证文件创建成功**

Run: `dir src/components/Public/SkillCard.vue`
Expected: 文件存在

**Step 3: Commit**

```bash
git add src/components/Public/SkillCard.vue
git commit -m "feat: create SkillCard public component"
```

---

## Task 2: 在 SearchDoubleEffectForm.vue 中使用 SkillCard

**Files:**
- Modify: `src/components/SearchDoublePage/SearchDoubleEffectForm.vue`

**Step 1: 导入 SkillCard 组件**

在 `<script>` 部分添加导入：

```typescript
import SkillCard from '../Public/SkillCard.vue';
```

**Step 2: 替换模板中的 skill-card**

找到第 178-210 行的 skill-card div，替换为：

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

**Step 3: 删除原 skill-card 的样式代码**

删除第 85-125 行的 `.skill-card` 相关样式代码。

**Step 4: 删除未使用的辅助函数**

检查并删除以下不再使用的代码：
- `styleMapper`（如果只在 skill-card 中使用）
- `getSkillDisplay` 函数（如果只在 skill-card 中使用）

注意：保留 `styleMapper` 和 `getSkillDisplay` 如果文件中其他地方还在使用。

**Step 5: 测试验证**

Run: `pnpm dev`
操作：访问首页，验证筛选结果卡片正常显示
Expected: 卡片样式与之前一致，Tooltip 正常显示流派技能

**Step 6: Commit**

```bash
git add src/components/SearchDoublePage/SearchDoubleEffectForm.vue
git commit -m "refactor: use SkillCard component in SearchDoubleEffectForm"
```

---

## Task 3: 在 SelectableSkillCard.vue 中使用 SkillCard

**Files:**
- Modify: `src/components/SectBuilderPage/SelectableSkillCard.vue`

**Step 1: 导入 SkillCard 组件**

在 `<script>` 部分添加导入：

```typescript
import SkillCard from '../Public/SkillCard.vue';
```

**Step 2: 替换模板中的 skill-item**

找到第 66-95 行的 skill-item div，替换为：

```vue
<SkillCard
  v-for="detail in filterDetailList"
  :key="detail.name"
  :skill="detail"
  size="compact"
  :show-triggers="false"
  :show-tooltip="true"
/>
```

**Step 3: 删除原 skill-item 的样式代码**

删除第 15-52 行的 `.skill-item` 相关样式代码。

**Step 4: 删除未使用的辅助函数和导入**

检查并删除以下不再使用的代码：
- `styleMapper`（如果不再使用）
- `getSkillDisplay` 函数（如果不再使用）
- `getSkillsBySect` 导入（如果不再使用）
- `Attribute` 类型导入（如果不再使用）

**Step 5: 测试验证**

Run: `pnpm dev`
操作：访问构建页，选择流派后验证可选策略列表正常显示
Expected: 紧凑样式卡片正常显示，Tooltip 正常工作

**Step 6: Commit**

```bash
git add src/components/SectBuilderPage/SelectableSkillCard.vue
git commit -m "refactor: use SkillCard component in SelectableSkillCard"
```

---

## Task 4: 在 SectBuilderPage.vue 中使用 SkillCard

**Files:**
- Modify: `src/views/SectBuilderPage.vue`

**Step 1: 导入 SkillCard 组件**

在 `<script>` 部分添加导入：

```typescript
import SkillCard from '../components/Public/SkillCard.vue';
```

**Step 2: 替换模板中的 activated-card**

找到第 128-145 行的 activated-card div，替换为：

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

**Step 3: 删除原 activated-card 的样式代码**

删除第 15-65 行的 `.activated-card` 相关样式代码。

**Step 4: 删除未使用的辅助函数**

检查并删除以下不再使用的代码：
- `styleMapper`（如果只在 activated-card 中使用）

保留其他仍在使用的代码。

**Step 5: 测试验证**

Run: `pnpm dev`
操作：访问构建页，选择流派后验证已激活策略列表正常显示
Expected: 标准样式卡片正常显示，触发位标签显示，无 Tooltip

**Step 6: Commit**

```bash
git add src/views/SectBuilderPage.vue
git commit -m "refactor: use SkillCard component in SectBuilderPage"
```

---

## Task 5: 运行构建验证

**Step 1: 类型检查**

Run: `pnpm build`
Expected: 无 TypeScript 错误，构建成功

**Step 2: 最终回归测试**

| 测试项 | 操作 | 预期结果 |
|--------|------|----------|
| 首页筛选 | 访问首页，选择属性/流派筛选 | 卡片正常显示，样式正确 |
| 首页 Tooltip | 悬停流派名称 | 显示对应流派技能列表 |
| 构建页配置 | 访问构建页，选择流派 | 可选策略列表紧凑显示 |
| 构建页激活 | 配置多个流派 | 已激活策略正常显示触发位 |
| 响应式 | 调整浏览器宽度 | 各页面布局正常适配 |

**Step 3: Commit（如有修改）**

```bash
git add -A
git commit -m "fix: resolve any issues from refactoring" || echo "No changes to commit"
```

---

## Summary

**变更文件：**
1. 新建: `src/components/Public/SkillCard.vue` - 公共卡片组件
2. 修改: `src/components/SearchDoublePage/SearchDoubleEffectForm.vue` - 使用 SkillCard
3. 修改: `src/components/SectBuilderPage/SelectableSkillCard.vue` - 使用 SkillCard
4. 修改: `src/views/SectBuilderPage.vue` - 使用 SkillCard

**删除代码：**
- SearchDoubleEffectForm.vue 中的 `.skill-card` 样式 (~40 行)
- SelectableSkillCard.vue 中的 `.skill-item` 样式 (~37 行)
- SectBuilderPage.vue 中的 `.activated-card` 样式 (~50 行)

**预期收益：**
- 消除约 127 行重复样式代码
- 统一卡片 UI，便于后续维护
- 新增功能时只需修改一处
