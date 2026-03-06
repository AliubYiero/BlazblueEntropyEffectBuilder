# Inherit Checkbox Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign inherit-filters checkboxes to support three states (checked/pending/unchecked) based on activated dual strategies, with an "Inherit Dual Strategy" dialog.

**Architecture:** Extend `SkillCardInfo` with `inheritSkill` field. Add computed three-state logic in `SectBuilderPage.vue`. Create new `InheritSkillForm.vue` component for selecting which dual strategy to inherit. Merge inherited skills into `activatedSkills`.

**Tech Stack:** Vue 3 + TypeScript, Pinia store, Element Plus (el-checkbox, el-dialog), SCSS

---

### Task 1: Extend SkillCardInfo type with inheritSkill field

**Files:**
- Modify: `src/domains/builder/types.ts:14-21`

**Step 1: Add inheritSkill to SkillCardInfo interface**

In `src/domains/builder/types.ts`, add the optional `inheritSkill` field after `inherit`:

```typescript
export interface SkillCardInfo {
  /** 触发位名称 (普攻/技能/冲刺/传承/召唤) */
  triggerName: Trigger;
  /** 配置的流派名称，空字符串表示未配置 */
  sect: SectValue | '';
  /** 是否继承上位效果 */
  inherit: boolean;
  /** 继承的双重策略信息 */
  inheritSkill?: SkillInfo;
}
```

**Step 2: Verify no type errors**

Run: `npx vue-tsc --noEmit`
Expected: No errors (inheritSkill is optional, existing code unaffected)

**Step 3: Commit**

```bash
git add src/domains/builder/types.ts
git commit -m "feat: add inheritSkill field to SkillCardInfo type"
```

---

### Task 2: Add setInheritSkill and clearInheritSkill store methods

**Files:**
- Modify: `src/domains/builder/store.ts:107-120` (after `updateSkillCardInherit`)
- Modify: `src/domains/builder/store.ts:172-188` (return block)

**Step 1: Add setInheritSkill method**

In `src/domains/builder/store.ts`, after `updateSkillCardInherit` method (around line 120), add:

```typescript
  /**
   * 设置继承的双重策略
   * @param triggerName - 触发位名称
   * @param skill - 要继承的双重策略
   */
  const setInheritSkill = (triggerName: Trigger, skill: SkillInfo): boolean => {
    if (!VALID_TRIGGERS.includes(triggerName)) {
      console.warn(`[useBuilderStore] 无效的触发位: ${triggerName}`);
      return false;
    }

    const newList = skillCardInfoList.value.map((item) =>
      item.triggerName === triggerName
        ? { ...item, inherit: true, inheritSkill: skill }
        : item,
    ) as SkillCardInfoTuple;

    skillCardInfoList.value = newList;
    return true;
  };

  /**
   * 清除继承的双重策略
   * @param triggerName - 触发位名称
   */
  const clearInheritSkill = (triggerName: Trigger): boolean => {
    if (!VALID_TRIGGERS.includes(triggerName)) {
      console.warn(`[useBuilderStore] 无效的触发位: ${triggerName}`);
      return false;
    }

    const newList = skillCardInfoList.value.map((item) =>
      item.triggerName === triggerName
        ? { ...item, inherit: false, inheritSkill: undefined }
        : item,
    ) as SkillCardInfoTuple;

    skillCardInfoList.value = newList;
    return true;
  };
```

**Step 2: Export the new methods in store return block**

Add `setInheritSkill` and `clearInheritSkill` to the return statement:

```typescript
  return {
    // ... existing entries ...
    setInheritSkill,
    clearInheritSkill,
  };
```

**Step 3: Export from domain index**

No change needed — store is exported as `useBuilderStore`, methods are accessible via the store instance.

**Step 4: Verify no type errors**

Run: `npx vue-tsc --noEmit`
Expected: No errors

**Step 5: Commit**

```bash
git add src/domains/builder/store.ts
git commit -m "feat: add setInheritSkill and clearInheritSkill store methods"
```

---

### Task 3: Extend activatedSkills to include inherited skills

**Files:**
- Modify: `src/domains/builder/store.ts:57-61` (activatedSkills computed)

**Step 1: Merge inherited skills into activatedSkills**

Replace the `activatedSkills` computed in `src/domains/builder/store.ts`:

```typescript
  const activatedSkills = computed<ActivatedSkillResult>(() => {
    const calculated = calculateActivatedSkills(skillCardInfoList.value);

    // 合并继承的双重策略（去重）
    const inheritedSkills = skillCardInfoList.value
      .filter((card) => card.inherit && card.inheritSkill)
      .map((card) => card.inheritSkill!);

    const calculatedNames = new Set(calculated.skills.map((s) => s.name));
    const uniqueInherited = inheritedSkills.filter((s) => !calculatedNames.has(s.name));
    const allSkills = [...calculated.skills, ...uniqueInherited];

    return {
      skills: allSkills,
      count: allSkills.length,
    };
  });
```

**Step 2: Verify no type errors**

Run: `npx vue-tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/domains/builder/store.ts
git commit -m "feat: merge inherited skills into activatedSkills computed"
```

---

### Task 4: Create InheritSkillForm component

**Files:**
- Create: `src/components/SectBuilderPage/InheritSkillForm.vue`

**Step 1: Create the component**

Create `src/components/SectBuilderPage/InheritSkillForm.vue`:

```vue
<style lang="scss" scoped>
.inherit-form {
	padding: 8px 0;
}

.skill-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
	max-height: 400px;
	overflow-y: auto;
}

.no-data {
	text-align: center;
	padding: 24px;
	color: var(--muted-foreground);
	font-size: 13px;
}
</style>

<template>
	<div class="inherit-form">
		<div v-if="relatedSkills.length > 0" class="skill-list">
			<SkillCard
				v-for="skill in relatedSkills"
				:key="skill.name"
				:skill="skill"
				size="normal"
				:show-triggers="true"
				:show-tooltip="false"
				:clickable="true"
				@click="handleSelect"
			/>
		</div>
		<div v-else class="no-data">
			暂无可继承的双重策略
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import SkillCard from '../Public/SkillCard.vue';
import { useBuilderStore } from '../../domains/builder/index.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { SkillInfo } from '../../core/data/types.ts';

const props = defineProps<{
	triggerName: Trigger;
}>();

const emit = defineEmits<{
	(event: 'closeDialog'): void;
}>();

const builderStore = useBuilderStore();

const relatedSkills = computed<SkillInfo[]>(() => {
	return builderStore.activatedSkills.skills.filter((skill) =>
		skill.trigger.includes(props.triggerName),
	);
});

const handleSelect = (skill: SkillInfo) => {
	builderStore.setInheritSkill(props.triggerName, skill);
	emit('closeDialog');
};
</script>
```

**Step 2: Verify no type errors**

Run: `npx vue-tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/SectBuilderPage/InheritSkillForm.vue
git commit -m "feat: create InheritSkillForm component for inherit dialog"
```

---

### Task 5: Add three-state checkbox logic and inherit dialog to SectBuilderPage

**Files:**
- Modify: `src/views/SectBuilderPage.vue` (all three sections: style, template, script)

**Step 1: Update script section**

Replace the script section (lines 141-182) of `src/views/SectBuilderPage.vue`:

```typescript
<script lang="ts" setup>
import { computed, ref } from 'vue';
import SelectSkillCard from '../components/SectBuilderPage/SelectSkillCard.vue';
import SelectableSkillCard
	from '../components/SectBuilderPage/SelectableSkillCard.vue';
import ChangeSkillSectForm
	from '../components/SectBuilderPage/ChangeSkillSectForm.vue';
import InheritSkillForm
	from '../components/SectBuilderPage/InheritSkillForm.vue';
import SkillCard from '../components/Public/SkillCard.vue';
import {
	type SkillCardInfoTuple,
	useBuilderStore,
} from '../domains/builder/index.ts';
import { triggerList } from '../domains/config/index.ts';
import type { Trigger } from '../interfaces/Trigger.ts';

const builderStore = useBuilderStore();

const skillCardInfoList = computed<SkillCardInfoTuple>( () => builderStore.skillCardInfoList as SkillCardInfoTuple );

const activatedSkills = computed( () => builderStore.activatedSkills.skills );

/**
 * 获取 checkbox 三态状态
 */
const getCheckboxState = ( trigger: Trigger ): 'checked' | 'pending' | 'unchecked' => {
	const card = builderStore.getSkillCardByTrigger( trigger );
	if ( card?.inherit ) return 'checked';

	const related = activatedSkills.value.filter( s => s.trigger.includes( trigger ) );
	if ( related.length === 0 ) return 'unchecked';

	for ( const skill of related ) {
		if ( skill.trigger.length === 1 ) return 'checked';

		const otherTriggers = skill.trigger.filter( t => t !== trigger );
		const allOthersChecked = otherTriggers.every( t => {
			const otherCard = builderStore.getSkillCardByTrigger( t );
			return otherCard?.inherit;
		} );
		if ( allOthersChecked ) return 'checked';
	}

	return 'pending';
};

const isInheritChecked = ( trigger: Trigger ) => getCheckboxState( trigger ) === 'checked';
const isInheritPending = ( trigger: Trigger ) => getCheckboxState( trigger ) === 'pending';

/**
 * 处理 checkbox 点击
 */
const handleInheritClick = ( trigger: Trigger ) => {
	const state = getCheckboxState( trigger );
	if ( state === 'checked' ) {
		builderStore.clearInheritSkill( trigger );
	} else {
		// pending 或 unchecked -> 打开继承对话框
		currentInheritTrigger.value = trigger;
		isShowInheritDialog.value = true;
	}
};

// 修改技能流派对话框
const isShowDialog = ref( false );
const currentTrigger = ref<Trigger>( '普攻' );

const openDialog = ( trigger: Trigger ) => {
	currentTrigger.value = trigger;
	isShowDialog.value = true;
};

const closeDialog = () => {
	isShowDialog.value = false;
};

// 继承双重策略对话框
const isShowInheritDialog = ref( false );
const currentInheritTrigger = ref<Trigger>( '普攻' );

const closeInheritDialog = () => {
	isShowInheritDialog.value = false;
};
</script>
```

**Step 2: Update template section**

Replace the inherit-filters `div` (lines 92-100) and add the new dialog after the existing one (line 137):

For the inherit-filters section, replace:
```vue
<div class="inherit-filters">
    <el-checkbox
        v-for="trigger in triggerList"
        :key="trigger"
        :label="trigger"
        :model-value="isInheritChecked(trigger)"
        @change="(val: boolean) => toggleInherit(trigger, val)"
    />
</div>
```

With:
```vue
<div class="inherit-filters">
    <el-checkbox
        v-for="trigger in triggerList"
        :key="trigger"
        :label="trigger"
        :model-value="isInheritChecked(trigger)"
        :indeterminate="isInheritPending(trigger)"
        :class="{ 'is-pending': isInheritPending(trigger) }"
        @change="() => handleInheritClick(trigger)"
    />
</div>
```

After the existing `el-dialog` (line 137), add:
```vue
<el-dialog v-model="isShowInheritDialog" title="继承双重策略" width="400px">
    <InheritSkillForm :trigger-name="currentInheritTrigger"
                      @close-dialog="closeInheritDialog"/>
</el-dialog>
```

**Step 3: Add pending checkbox CSS**

In the style section (after `.inherit-filters` around line 39), add:

```scss
.inherit-filters :deep(.el-checkbox.is-pending .el-checkbox__inner) {
	border-style: dashed;
	border-color: var(--border);
	background: transparent;

	&::after {
		display: none;
	}
}

.inherit-filters :deep(.el-checkbox.is-pending.is-checked .el-checkbox__inner) {
	border-style: dashed;
}
```

**Step 4: Verify no type errors**

Run: `npx vue-tsc --noEmit`
Expected: No errors

**Step 5: Test manually in browser**

1. Configure 2+ sects in builder slots
2. Verify checkboxes auto-derive states: single-trigger skills → checked, multi-trigger → pending (dashed border)
3. Click pending checkbox → inherit dialog opens with related skills
4. Click a skill card → dialog closes, checkbox becomes checked
5. Click checked checkbox → inherit cleared, reverts to pending/unchecked

**Step 6: Commit**

```bash
git add src/views/SectBuilderPage.vue
git commit -m "feat: implement three-state inherit checkboxes with inherit dialog"
```

---

### Task 6: Handle auto-check side effects for single-trigger and last-remaining scenarios

**Files:**
- Modify: `src/domains/builder/store.ts` (activatedSkills computed or add a watcher)

**Step 1: Add auto-inherit logic via store method**

The `getCheckboxState` function in the view already handles the _display_ of auto-checked states. However, for single-trigger skills and last-remaining triggers, we need to actually set `inherit = true` and `inheritSkill` in the store so the skill appears in activatedSkills correctly.

Add a method in `src/domains/builder/store.ts` after `clearInheritSkill`:

```typescript
  /**
   * 自动设置单触发位和最后剩余触发位的继承
   * @description 当激活策略变化时调用，自动勾选确定性的触发位
   */
  const autoInheritSingleTriggerSkills = (): void => {
    const calculated = calculateActivatedSkills(skillCardInfoList.value);
    let changed = false;
    let current = skillCardInfoList.value;

    for (const skill of calculated.skills) {
      if (skill.trigger.length === 1) {
        const trigger = skill.trigger[0];
        const card = current.find((c) => c.triggerName === trigger);
        if (card && !card.inherit) {
          current = current.map((item) =>
            item.triggerName === trigger
              ? { ...item, inherit: true, inheritSkill: skill }
              : item,
          ) as SkillCardInfoTuple;
          changed = true;
        }
      }
    }

    if (changed) {
      skillCardInfoList.value = current;
    }
  };
```

Export it in the return block.

**Step 2: Call autoInheritSingleTriggerSkills after sect changes**

In `updateSkillCardInfo`, after setting `skillCardInfoList.value = newList`, call:

```typescript
    skillCardInfoList.value = newList;
    // 自动继承单触发位的双重策略
    autoInheritSingleTriggerSkills();
    return true;
```

**Step 3: Verify no type errors**

Run: `npx vue-tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/domains/builder/store.ts
git commit -m "feat: auto-inherit single-trigger dual strategies on sect change"
```

---

### Task 7: Update resetAllSkillCards to clear inheritSkill

**Files:**
- Modify: `src/domains/builder/store.ts` (resetAllSkillCards method)

**Step 1: Verify DEFAULT_SKILL_CARDS already handles this**

Check that `DEFAULT_SKILL_CARDS` doesn't include `inheritSkill` — since it's optional and absent, `structuredClone` will produce cards without it. No change needed.

**Step 2: Verify importConfiguration handles inheritSkill**

Since `importConfiguration` accepts `SkillCardInfoTuple` and `inheritSkill` is optional, existing stored configs without it will work. Configs with it will also work. No change needed.

**Step 3: Commit (skip if no changes needed)**

---

### Task 8: Final integration test and cleanup

**Files:**
- All modified files

**Step 1: Run full type check**

Run: `npx vue-tsc --noEmit`
Expected: No errors

**Step 2: Run dev server and test**

Run: `npm run dev`

Test scenarios:
1. Fresh page: all checkboxes unchecked
2. Configure two sects that activate a single-trigger dual strategy → checkbox auto-checks
3. Configure two sects that activate a multi-trigger dual strategy → related checkboxes show dashed pending
4. Click pending checkbox → dialog shows related skills → click skill → checkbox becomes checked
5. Click checked checkbox → inherit cleared → reverts to pending or unchecked
6. Reset all → all checkboxes clear
7. Verify activated skills count includes inherited skills

**Step 3: Commit any fixes**

```bash
git add -A
git commit -m "feat: complete inherit checkbox redesign with three-state logic"
```
