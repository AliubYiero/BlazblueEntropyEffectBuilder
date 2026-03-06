# 过滤已占用触发位显示 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在 SelectableSkillCard 中隐藏已被 checked 占用的触发位 badge，全部占用则隐藏整张卡片。

**Architecture:** 给 SkillCard 新增可选 `triggers` prop 来覆盖默认触发位显示；在 SelectableSkillCard 中计算被占用的触发位集合，过滤后传递给 SkillCard。

**Tech Stack:** Vue 3, TypeScript, Pinia

---

### Task 1: SkillCard 新增 triggers prop

**Files:**
- Modify: `src/components/Public/SkillCard.vue:1-58`

**Step 1: 添加 triggers prop 和导入 Trigger 类型**

在 `src/components/Public/SkillCard.vue` 的 `<script>` 中：

1. 添加导入：
```typescript
import type { Trigger } from '../../interfaces/Trigger.ts';
```

2. 在 Props interface 中新增：
```typescript
interface Props {
  skill: SkillInfo;
  size?: 'compact' | 'normal';
  showTriggers?: boolean;
  showTooltip?: boolean;
  clickable?: boolean;
  triggers?: Trigger[];  // 新增：覆盖 skill.trigger 的显示
}
```

3. 模板中将触发位渲染从 `skill.trigger` 改为使用 `triggers`：

```html
<!-- 原来的 -->
<div v-if="showTriggers && skill.trigger.length > 0" class="skill-card__triggers">
  <span v-for="trigger in skill.trigger" :key="trigger" class="trigger-badge">

<!-- 改为 -->
<div v-if="showTriggers && displayTriggers.length > 0" class="skill-card__triggers">
  <span v-for="trigger in displayTriggers" :key="trigger" class="trigger-badge">
```

4. 在 script 中添加 computed：
```typescript
import { computed } from 'vue';

const displayTriggers = computed(() => props.triggers ?? props.skill.trigger);
```

**Step 2: 验证开发服务器无报错**

Run: `npm run dev`（确认页面无报错，现有功能不受影响）

**Step 3: Commit**

```bash
git add src/components/Public/SkillCard.vue
git commit -m "feat(SkillCard): 新增可选 triggers prop 覆盖默认触发位显示"
```

---

### Task 2: SelectableSkillCard 过滤已占用触发位

**Files:**
- Modify: `src/components/SectBuilderPage/SelectableSkillCard.vue:1-47`

**Step 1: 添加导入和 occupiedTriggers computed**

在 `<script>` 中添加：

```typescript
import { triggerList } from '../../domains/config/index.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
```

新增 computed：

```typescript
const occupiedTriggers = computed<Set<Trigger>>( () => {
	const occupied = new Set<Trigger>();
	for ( const trigger of triggerList ) {
		if ( builderStore.getCheckboxState( trigger ) === 'checked' ) {
			occupied.add( trigger );
		}
	}
	return occupied;
} );
```

**Step 2: 修改 filterDetailList 返回带 availableTriggers 的对象数组**

将 `filterDetailList` 的类型和逻辑改为：

```typescript
const filterDetailList = computed( () => {
	const skillInfoList = getSkillInfoList().value;
	let list = skillInfoList.filter( skill =>
		props.skillCardInfo.sect && ( skill.mainSect.includes( props.skillCardInfo.sect ) || skill.secondSect.includes( props.skillCardInfo.sect ) ),
	);
	const existing = builderStore.skillCardInfoList.filter( c => c.sect || c.inherit ).map( c => c.triggerName );
	const inheritedNames = new Set(
		builderStore.skillCardInfoList
			.filter( c => c.inheritSkill )
			.map( c => c.inheritSkill!.name ),
	);
	return list
		.filter( skill =>
			!inheritedNames.has( skill.name ) &&
			skill.trigger.some( t => !existing.includes( t ) ),
		)
		.map( skill => ( {
			skill,
			availableTriggers: skill.trigger.filter( t => !occupiedTriggers.value.has( t ) ),
		} ) )
		.filter( item => item.availableTriggers.length > 0 );
} );
```

**Step 3: 更新模板使用新数据结构**

```html
<div v-else class="skills-grid">
	<SkillCard
		v-for="item in filterDetailList"
		:key="item.skill.name"
		:show-tooltip="true"
		:show-triggers="true"
		:skill="item.skill"
		:triggers="item.availableTriggers"
		size="compact"
	/>
</div>
```

**Step 4: 验证功能**

Run: `npm run dev`

验证步骤：
1. 选择一个流派，看到技能卡片显示所有触发位
2. 在 inherit-filters 中勾选一个触发位（使其变为 checked）
3. 确认技能卡片上对应触发位 badge 消失
4. 确认 pending 状态的触发位仍然显示
5. 确认所有触发位都被占用的卡片被隐藏

**Step 5: Commit**

```bash
git add src/components/SectBuilderPage/SelectableSkillCard.vue
git commit -m "feat(SelectableSkillCard): 过滤已占用触发位，全部占用时隐藏卡片"
```
